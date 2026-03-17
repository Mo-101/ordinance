-- HCOMS PostgreSQL Schema
-- Run with: psql "$DATABASE_URL" -f hcoms_schema.sql -v ON_ERROR_STOP=1

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
CREATE TYPE order_state AS ENUM (
  'draft','submitted','coordination_exception','awaiting_country_decision',
  'routed_to_nbi','routed_to_dkr','sr_generated','under_osl_review',
  'stock_reserved','stock_released','dispatched','delivered',
  'cancelled','rejected'
);

CREATE TYPE exception_type AS ENUM ('coordination','osl');
CREATE TYPE notification_channel AS ENUM ('in_app','email','sms','webhook');
CREATE TYPE notification_recipient_type AS ENUM ('country','coordinator','osl_ops','warehouse','chief','system');
CREATE TYPE sla_stage AS ENUM ('submission','coordination','osl_review','stock_reservation','dispatch','delivery');
CREATE TYPE priority_level AS ENUM ('low','medium','high','urgent');

-- Core tables
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        TEXT UNIQUE NOT NULL,
  status              order_state NOT NULL DEFAULT 'draft',
  priority            priority_level NOT NULL DEFAULT 'medium',
  country_id          UUID NOT NULL,
  submitted_by        UUID,
  submitted_at        TIMESTAMPTZ,
  accepted_option_id  UUID,
  routed_to_hub       TEXT,
  total_estimated_cost_usd NUMERIC(14,2) DEFAULT 0,
  official_request_attached BOOLEAN DEFAULT FALSE,
  pteao               TEXT,
  consignee           TEXT,
  notify_party        TEXT,
  ready_date          DATE,
  sr_nbi_generated    BOOLEAN DEFAULT FALSE,
  sr_dkr_generated    BOOLEAN DEFAULT FALSE,
  hold_reason         TEXT,
  rejection_reason    TEXT,
  carrier             TEXT,
  awb_number          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_country ON orders(country_id);

CREATE TABLE order_lines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sku_code        TEXT NOT NULL,
  sku_name        TEXT,
  requested_qty   NUMERIC(12,2) NOT NULL,
  unit_of_measure TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_lines_order ON order_lines(order_id);

CREATE TABLE order_exceptions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  exception_type     exception_type NOT NULL,
  field_key          TEXT,
  field_label        TEXT,
  issue_type         TEXT,
  severity           TEXT,
  required_action    TEXT,
  comment            TEXT,
  raised_by          UUID,
  raised_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved           BOOLEAN DEFAULT FALSE,
  resolved_at        TIMESTAMPTZ,
  requester_response TEXT,
  revision_no        INTEGER DEFAULT 1
);

CREATE INDEX idx_order_exceptions_order ON order_exceptions(order_id);

CREATE TABLE sourcing_options (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                 UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  option_number            INTEGER NOT NULL,
  negotiation_cycle        INTEGER DEFAULT 1,
  sourcing_mode            TEXT,
  primary_hub              TEXT,
  secondary_hub            TEXT,
  goods_cost_usd           NUMERIC(14,2) DEFAULT 0,
  transport_cost_usd       NUMERIC(14,2) DEFAULT 0,
  total_estimated_cost_usd NUMERIC(14,2) DEFAULT 0,
  country_transport_liability TEXT,
  payment_terms_note       TEXT,
  estimated_delivery_days  INTEGER,
  coverage_confidence      TEXT,
  coordinator_summary      TEXT,
  status                   TEXT,
  proposed_by              UUID,
  proposed_at              TIMESTAMPTZ,
  responded_at             TIMESTAMPTZ,
  responded_by             UUID,
  rejection_reason         TEXT,
  internal_flags           JSONB DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX uq_option_per_order ON sourcing_options(order_id, option_number);
CREATE INDEX idx_sourcing_options_order ON sourcing_options(order_id);

CREATE TABLE sourcing_option_lines (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id           UUID NOT NULL REFERENCES sourcing_options(id) ON DELETE CASCADE,
  line_id             UUID NOT NULL REFERENCES order_lines(id) ON DELETE CASCADE,
  sku_code            TEXT NOT NULL,
  requested_qty       NUMERIC(12,2),
  proposed_qty        NUMERIC(12,2),
  backorder_qty       NUMERIC(12,2),
  source_hub          TEXT,
  fulfillment_type    TEXT,
  fefo_lot_reference  TEXT,
  eta_days            INTEGER,
  unit_cost_usd       NUMERIC(12,2),
  line_goods_cost_usd NUMERIC(14,2)
);

CREATE INDEX idx_option_lines_option ON sourcing_option_lines(option_id);
CREATE INDEX idx_option_lines_line ON sourcing_option_lines(line_id);

CREATE TABLE country_option_responses (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  option_id                  UUID NOT NULL REFERENCES sourcing_options(id) ON DELETE CASCADE,
  response                   TEXT NOT NULL,
  responded_by               UUID,
  responded_at               TIMESTAMPTZ,
  rejection_reason           TEXT,
  alternative_request_notes  TEXT,
  accepted_transport_cost    NUMERIC(14,2)
);

CREATE INDEX idx_country_responses_order ON country_option_responses(order_id);

CREATE TABLE inventory_lots (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id   UUID NOT NULL,
  sku_code       TEXT NOT NULL,
  lot_number     TEXT NOT NULL,
  expiry_date    DATE,
  physical_qty   NUMERIC(12,2) DEFAULT 0,
  reserved_qty   NUMERIC(12,2) DEFAULT 0,
  quarantine_qty NUMERIC(12,2) DEFAULT 0,
  unit_cost_usd  NUMERIC(12,2),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_lots_sku ON inventory_lots(sku_code);
CREATE INDEX idx_inventory_lots_wh ON inventory_lots(warehouse_id);

ALTER TABLE commodities
  ADD COLUMN IF NOT EXISTS security_stock_qty NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS threshold_stock_qty NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS reorder_qty NUMERIC(12,2);

CREATE TABLE notifications (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           UUID REFERENCES orders(id) ON DELETE SET NULL,
  event              TEXT NOT NULL,
  recipient_type     notification_recipient_type NOT NULL,
  recipient_user_id  UUID,
  channel            notification_channel NOT NULL DEFAULT 'in_app',
  urgency            TEXT,
  subject            TEXT,
  body               TEXT,
  in_app_label       TEXT,
  sent_at            TIMESTAMPTZ,
  read_at            TIMESTAMPTZ,
  delivered          BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_notifications_order ON notifications(order_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_user_id);

CREATE TABLE audit_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status order_state,
  to_status   order_state,
  actor_id    UUID,
  actor_role  TEXT,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason      TEXT,
  diff        JSONB
);

CREATE INDEX idx_audit_order ON audit_events(order_id);

CREATE TABLE sla_timers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  stage       sla_stage NOT NULL,
  priority    priority_level NOT NULL DEFAULT 'medium',
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deadline_at TIMESTAMPTZ,
  breached    BOOLEAN DEFAULT FALSE,
  breached_at TIMESTAMPTZ,
  escalated   BOOLEAN DEFAULT FALSE
);

CREATE UNIQUE INDEX uq_sla_per_stage ON sla_timers(order_id, stage);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
