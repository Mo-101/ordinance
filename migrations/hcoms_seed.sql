-- HCOMS Demo Seed Data
-- Run after schema: psql "$DATABASE_URL" -f hcoms_seed.sql -v ON_ERROR_STOP=1

-- Countries (minimal)
INSERT INTO countries (id, name, iso3, region, transport_liability_default) VALUES
  (gen_random_uuid(), 'Nigeria', 'NGA', 'West Africa', 'USD 120'),
  (gen_random_uuid(), 'Kenya', 'KEN', 'East Africa', 'USD 95'),
  (gen_random_uuid(), 'Ghana', 'GHA', 'West Africa', 'USD 85'),
  (gen_random_uuid(), 'Ethiopia', 'ETH', 'East Africa', 'USD 110'),
  (gen_random_uuid(), 'South Africa', 'ZAF', 'Southern Africa', 'USD 130');

-- Commodities (demo SKUs)
INSERT INTO commodities (id, name, sku_code, description, unit_of_measure, security_stock_qty, threshold_stock_qty, reorder_qty) VALUES
  (gen_random_uuid(), 'Emergency Response Kit', 'ERK-204', 'Trauma-ready, sealed, category-labeled kits for field response, clinics, and rapid dispatch stations.', 'kit', 50, 30, 100),
  (gen_random_uuid(), 'N95 Protective Masks', 'N95-118', 'High-filtration respiratory masks for airborne barrier protection in clinical, laboratory, and public-health response settings.', 'box', 200, 100, 400),
  (gen_random_uuid(), 'Sterile Nitrile Gloves', 'SNG-441', 'Powder-free nitrile examination gloves with sterile presentation for controlled handling and clean procedural work.', 'box', 300, 150, 600),
  (gen_random_uuid(), 'Rapid Diagnostic Test Kit', 'RDT-302', 'Multiplex antigen/antibody rapid test for priority pathogens in field and clinic settings.', 'kit', 80, 40, 160),
  (gen_random_uuid(), 'IV Infusion Set', 'IVS-215', 'Sterile infusion set with drip chamber, 15 µm filter, 20 drops/mL, 150 cm tubing.', 'unit', 500, 300, 1000);

-- Inventory Lots (demo: NBI and DKR hubs)
INSERT INTO inventory_lots (warehouse_id, sku_code, lot_number, expiry_date, physical_qty, reserved_qty, unit_cost_usd) VALUES
  -- NBI Hub
  ('wh-nbi-001', 'ERK-204', 'EK-B1', '2029-03-31', 120, 20, 149.00),
  ('wh-nbi-001', 'N95-118', 'MK-C2', '2028-12-31', 350, 50, 42.00),
  ('wh-nbi-001', 'SNG-441', 'GL-D3', '2029-06-30', 480, 80, 28.00),
  ('wh-nbi-001', 'RDT-302', 'RD-E4', '2028-09-30', 90, 10, 65.00),
  ('wh-nbi-001', 'IVS-215', 'IV-F5', '2029-02-28', 600, 100, 3.50),
  -- DKR Hub
  ('wh-dkr-001', 'ERK-204', 'EK-G6', '2029-04-30', 45, 5, 149.00),
  ('wh-dkr-001', 'N95-118', 'MK-H7', '2029-01-31', 180, 30, 42.00),
  ('wh-dkr-001', 'SNG-441', 'GL-I8', '2029-07-31', 220, 20, 28.00),
  ('wh-dkr-001', 'RDT-302', 'RD-J9', '2028-10-31', 40, 0, 65.00),
  ('wh-dkr-001', 'IVS-215', 'IV-K10', '2029-03-31', 250, 50, 3.50);

-- Sample Order (Draft)
INSERT INTO orders (id, order_number, status, priority, country_id, submitted_by, submitted_at, total_estimated_cost_usd, pteao, consignee, notify_party, ready_date) VALUES
  (gen_random_uuid(), 'PATEO-2026-NGA-0047', 'draft', 'medium',
   (SELECT id FROM countries WHERE iso3='NGA'),
   gen_random_uuid(),
   NOW(),
   0.00,
   'PATEO-2026-NGA-0047',
   'Federal Ministry of Health, Abuja',
   'logistics@who.int',
   '2026-04-15');

-- Sample Order Lines
INSERT INTO order_lines (id, order_id, sku_code, sku_name, requested_qty, unit_of_measure)
SELECT
  gen_random_uuid(),
  o.id,
  c.sku_code,
  c.name,
  CASE c.sku_code
    WHEN 'ERK-204' THEN 10
    WHEN 'N95-118' THEN 20
    WHEN 'SNG-441' THEN 30
    WHEN 'RDT-302' THEN 15
    WHEN 'IVS-215' THEN 100
  END,
  c.unit_of_measure
FROM orders o
JOIN countries co ON o.country_id = co.id
JOIN commodities c ON c.sku_code IN ('ERK-204','N95-118','SNG-441','RDT-302','IVS-215')
WHERE o.order_number = 'PATEO-2026-NGA-0047';

-- Sample Notification
INSERT INTO notifications (id, order_id, event, recipient_type, recipient_user_id, channel, urgency, subject, body, in_app_label, sent_at)
SELECT
  gen_random_uuid(),
  o.id,
  'ORDER_CREATED',
  'country',
  o.submitted_by,
  'in_app',
  'info',
  'Draft order created',
  'Your draft order has been saved. You can submit it when ready.',
  'Draft saved',
  NOW()
FROM orders o
WHERE o.order_number = 'PATEO-2026-NGA-0047';

-- Sample SLA Timers
INSERT INTO sla_timers (id, order_id, stage, priority, started_at, deadline_at)
SELECT
  gen_random_uuid(),
  o.id,
  'submission',
  o.priority,
  o.created_at,
  o.created_at + INTERVAL '48 hours'
FROM orders o
WHERE o.order_number = 'PATEO-2026-NGA-0047';

-- Sample Audit Event
INSERT INTO audit_events (id, order_id, from_status, to_status, actor_id, actor_role, timestamp, reason)
SELECT
  gen_random_uuid(),
  o.id,
  NULL,
  o.status,
  o.submitted_by,
  'Country Office',
  o.created_at,
  'Order created via catalog.'
FROM orders o
WHERE o.order_number = 'PATEO-2026-NGA-0047';
