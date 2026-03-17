-- Dashboard Analytics Schema
-- Enhanced tables for better visualizations and KPI tracking
-- Run with: psql "$DATABASE_URL" -f dashboard_analytics_schema.sql -v ON_ERROR_STOP=1

-- Analytics tables for dashboard visualizations
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_type TEXT NOT NULL, -- 'kpi', 'trend', 'gauge', 'chart'
  current_value NUMERIC(15,2),
  previous_value NUMERIC(15,2),
  unit TEXT,
  trend_direction TEXT, -- 'up', 'down', 'stable'
  trend_percentage NUMERIC(5,2),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dashboard_metrics_name ON dashboard_metrics(metric_name);
CREATE INDEX idx_dashboard_metrics_type ON dashboard_metrics(metric_type);

-- Hourly throughput data for bar charts
CREATE TABLE IF NOT EXISTS hourly_throughput (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hour INTEGER NOT NULL, -- 0-23 representing hours of day
  date DATE NOT NULL,
  units_processed INTEGER NOT NULL DEFAULT 0,
  orders_processed INTEGER NOT NULL DEFAULT 0,
  efficiency_rate NUMERIC(5,2), -- percentage
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_hourly_throughput_date_hour ON hourly_throughput(date, hour);
CREATE INDEX idx_hourly_throughput_date ON hourly_throughput(date);

-- Regional output share for donut charts
CREATE TABLE IF NOT EXISTS regional_output (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  hub TEXT NOT NULL, -- 'NBI', 'DKR', 'OTHER'
  output_units INTEGER NOT NULL DEFAULT 0,
  output_value_usd NUMERIC(14,2) NOT NULL DEFAULT 0,
  percentage_total NUMERIC(5,2),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_regional_output_date ON regional_output(date);
CREATE INDEX idx_regional_output_hub ON regional_output(hub);

-- Production line status for flow steps
CREATE TABLE IF NOT EXISTS production_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_name TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  status TEXT NOT NULL, -- 'active', 'idle', 'maintenance', 'offline'
  current_units INTEGER NOT NULL DEFAULT 0,
  capacity_units INTEGER NOT NULL DEFAULT 0,
  efficiency_rate NUMERIC(5,2),
  error_count INTEGER NOT NULL DEFAULT 0,
  last_maintenance TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_production_lines_status ON production_lines(status);

-- Inventory pressure for gauge charts
CREATE TABLE IF NOT EXISTS inventory_pressure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_code TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  max_capacity INTEGER NOT NULL DEFAULT 0,
  threshold_stock INTEGER NOT NULL DEFAULT 0,
  pressure_level TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_pressure_sku ON inventory_pressure(sku_code);
CREATE INDEX idx_inventory_pressure_level ON inventory_pressure(pressure_level);

-- Trend data for line charts (7-day, 30-day views)
CREATE TABLE IF NOT EXISTS trend_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  date DATE NOT NULL,
  value NUMERIC(15,2) NOT NULL,
  unit TEXT,
  period_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trend_metrics_name_date ON trend_metrics(metric_name, date);
CREATE INDEX idx_trend_metrics_period ON trend_metrics(period_type);

-- Work order analytics for live table
CREATE TABLE IF NOT EXISTS work_order_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_name TEXT,
  address TEXT,
  order_date DATE NOT NULL,
  total_value NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  processing_stage TEXT, -- 'receiving', 'sorting', 'assembly', 'packing', 'dispatch'
  priority TEXT DEFAULT 'medium',
  estimated_completion TIMESTAMPTZ,
  actual_completion TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_work_order_status ON work_order_analytics(status);
CREATE INDEX idx_work_order_date ON work_order_analytics(order_date);
CREATE INDEX idx_work_order_stage ON work_order_analytics(processing_stage);

-- Capacity utilization tracking
CREATE TABLE IF NOT EXISTS capacity_utilization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_area TEXT NOT NULL,
  current_load INTEGER NOT NULL DEFAULT 0,
  max_capacity INTEGER NOT NULL DEFAULT 0,
  utilization_percentage NUMERIC(5,2),
  efficiency_rate NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_capacity_utilization_area ON capacity_utilization(production_area);
CREATE INDEX idx_capacity_utilization_time ON capacity_utilization(recorded_at);

-- Maintenance alerts and machine health
CREATE TABLE IF NOT EXISTS maintenance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id TEXT NOT NULL,
  equipment_name TEXT NOT NULL,
  alert_type TEXT NOT NULL, -- 'preventive', 'corrective', 'emergency'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  assigned_to TEXT
);

CREATE INDEX idx_maintenance_alerts_status ON maintenance_alerts(status);
CREATE INDEX idx_maintenance_alerts_severity ON maintenance_alerts(severity);

-- Error tracking and quality metrics
CREATE TABLE IF NOT EXISTS quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  total_units_produced INTEGER NOT NULL DEFAULT 0,
  defective_units INTEGER NOT NULL DEFAULT 0,
  error_rate NUMERIC(5,2),
  error_types JSONB, -- Store breakdown of error types
  rework_cost NUMERIC(14,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quality_metrics_date ON quality_metrics(date);

-- Trigger functions for updating analytics
CREATE OR REPLACE FUNCTION update_dashboard_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update dashboard metrics based on various tables
  -- This would be called by scheduled jobs or triggers
  
  -- Example: Update order counts
  INSERT INTO dashboard_metrics (metric_name, metric_type, current_value, unit, trend_direction)
  SELECT 
    'total_orders',
    'kpi',
    COUNT(*)::NUMERIC,
    'count',
    'stable'
  FROM orders 
  WHERE created_at >= CURRENT_DATE
  ON CONFLICT (metric_name) DO UPDATE SET
    current_value = EXCLUDED.current_value,
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate hourly throughput
CREATE OR REPLACE FUNCTION calculate_hourly_throughput(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
  INSERT INTO hourly_throughput (hour, date, units_processed, orders_processed)
  SELECT 
    EXTRACT(HOUR FROM created_at) as hour,
    target_date as date,
    COALESCE(SUM(ol.requested_qty), 0) as units_processed,
    COUNT(*) as orders_processed
  FROM orders o
  JOIN order_lines ol ON o.id = ol.order_id
  WHERE DATE(o.created_at) = target_date
  GROUP BY EXTRACT(HOUR FROM o.created_at)
  ON CONFLICT (date, hour) DO UPDATE SET
    units_processed = EXCLUDED.units_processed,
    orders_processed = EXCLUDED.orders_processed;
END;
$$ LANGUAGE plpgsql;

-- Function to update inventory pressure
CREATE OR REPLACE FUNCTION update_inventory_pressure()
RETURNS VOID AS $$
BEGIN
  INSERT INTO inventory_pressure (sku_code, warehouse_id, current_stock, max_capacity, threshold_stock, pressure_level)
  SELECT 
    il.sku_code,
    il.warehouse_id,
    (il.physical_qty - il.reserved_qty) as current_stock,
    COALESCE(c.max_capacity, 1000) as max_capacity,
    COALESCE(c.threshold_stock_qty, 100) as threshold_stock,
    CASE 
      WHEN (il.physical_qty - il.reserved_qty) <= c.threshold_stock_qty THEN 'critical'
      WHEN (il.physical_qty - il.reserved_qty) <= c.security_stock_qty THEN 'high'
      WHEN (il.physical_qty - il.reserved_qty) <= (c.threshold_stock_qty * 1.5) THEN 'medium'
      ELSE 'low'
    END as pressure_level
  FROM inventory_lots il
  LEFT JOIN commodities c ON il.sku_code = c.sku_code
  ON CONFLICT (sku_code, warehouse_id) DO UPDATE SET
    current_stock = EXCLUDED.current_stock,
    pressure_level = EXCLUDED.pressure_level,
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql;

-- Sample data for dashboard demonstration
INSERT INTO dashboard_metrics (metric_name, metric_type, current_value, previous_value, unit, trend_direction, trend_percentage) VALUES
  ('orders_processed', 'kpi', 2634, 2428, 'count', 'up', 8.4),
  ('active_production_lines', 'kpi', 12, 10, 'lines', 'up', 20.0),
  ('shipping_ontime_rate', 'kpi', 94.2, 92.3, 'percent', 'up', 2.1),
  ('maintenance_alerts', 'kpi', 7, 5, 'count', 'up', 40.0),
  ('capacity_utilization', 'kpi', 61, 57, 'percent', 'up', 7.0),
  ('low_stock_skus', 'kpi', 23, 18, 'count', 'up', 27.8)
ON CONFLICT (metric_name) DO NOTHING;

-- Sample hourly throughput data
INSERT INTO hourly_throughput (hour, date, units_processed, orders_processed) VALUES
  (0, CURRENT_DATE, 320, 12),
  (1, CURRENT_DATE, 410, 15),
  (2, CURRENT_DATE, 350, 13),
  (3, CURRENT_DATE, 420, 16),
  (4, CURRENT_DATE, 580, 22),
  (5, CURRENT_DATE, 750, 28),
  (6, CURRENT_DATE, 890, 33),
  (7, CURRENT_DATE, 920, 34),
  (8, CURRENT_DATE, 780, 29),
  (9, CURRENT_DATE, 620, 23),
  (10, CURRENT_DATE, 450, 17),
  (11, CURRENT_DATE, 390, 14),
  (12, CURRENT_DATE, 280, 10),
  (13, CURRENT_DATE, 310, 11),
  (14, CURRENT_DATE, 420, 16),
  (15, CURRENT_DATE, 580, 22),
  (16, CURRENT_DATE, 520, 19),
  (17, CURRENT_DATE, 610, 23),
  (18, CURRENT_DATE, 730, 27),
  (19, CURRENT_DATE, 820, 31),
  (20, CURRENT_DATE, 750, 28),
  (21, CURRENT_DATE, 680, 25),
  (22, CURRENT_DATE, 720, 27),
  (23, CURRENT_DATE, 760, 28)
ON CONFLICT (date, hour) DO NOTHING;

-- Sample regional output data
INSERT INTO regional_output (region, hub, output_units, output_value_usd, percentage_total, date) VALUES
  ('North', 'NBI', 15000, 225000.00, 42.0, CURRENT_DATE),
  ('East', 'NBI', 9600, 144000.00, 27.0, CURRENT_DATE),
  ('South', 'DKR', 6800, 102000.00, 19.0, CURRENT_DATE),
  ('Overflow', 'OTHER', 4300, 64500.00, 12.0, CURRENT_DATE)
ON CONFLICT (region, hub, date) DO NOTHING;

-- Sample production lines
INSERT INTO production_lines (line_name, line_number, status, current_units, capacity_units, efficiency_rate, error_count) VALUES
  ('Receiving Station 1', 1, 'active', 428, 500, 85.6, 2),
  ('Sorting Line A', 2, 'active', 380, 400, 95.0, 1),
  ('Sorting Line B', 3, 'active', 350, 400, 87.5, 3),
  ('Assembly Line 1', 4, 'active', 290, 300, 96.7, 0),
  ('Assembly Line 2', 5, 'active', 310, 300, 103.3, 1),
  ('Assembly Line 3', 6, 'active', 280, 300, 93.3, 2),
  ('Packing Station 1', 7, 'active', 420, 450, 93.3, 1),
  ('Packing Station 2', 8, 'active', 380, 450, 84.4, 2),
  ('Packing Station 3', 9, 'active', 360, 450, 80.0, 3),
  ('Dispatch Bay 1', 10, 'active', 410, 500, 82.0, 0),
  ('Dispatch Bay 2', 11, 'idle', 0, 500, 0.0, 0),
  ('Dispatch Bay 3', 12, 'maintenance', 0, 500, 0.0, 0)
ON CONFLICT (line_number) DO UPDATE SET
  status = EXCLUDED.status,
  current_units = EXCLUDED.current_units,
  efficiency_rate = EXCLUDED.efficiency_rate,
  error_count = EXCLUDED.error_count,
  updated_at = NOW();

-- Sample inventory pressure data
INSERT INTO inventory_pressure (sku_code, warehouse_id, current_stock, max_capacity, threshold_stock, pressure_level) VALUES
  ('ERK-204', 'wh-nbi-001', 75, 100, 30, 'medium'),
  ('N95-118', 'wh-nbi-001', 46, 100, 100, 'critical'),
  ('SNG-441', 'wh-nbi-001', 67, 100, 100, 'critical'),
  ('IVS-215', 'wh-nbi-001', 23, 100, 300, 'low'),
  ('RDT-302', 'wh-nbi-001', 67, 100, 100, 'critical')
ON CONFLICT (sku_code, warehouse_id) DO UPDATE SET
  current_stock = EXCLUDED.current_stock,
  pressure_level = EXCLUDED.pressure_level,
  last_updated = NOW();

-- Sample trend data (last 7 days)
INSERT INTO trend_metrics (metric_name, date, value, unit, period_type) VALUES
  ('throughput_trend', CURRENT_DATE - INTERVAL '6 days', 32400, 'units', 'daily'),
  ('throughput_trend', CURRENT_DATE - INTERVAL '5 days', 35600, 'units', 'daily'),
  ('throughput_trend', CURRENT_DATE - INTERVAL '4 days', 33800, 'units', 'daily'),
  ('throughput_trend', CURRENT_DATE - INTERVAL '3 days', 37100, 'units', 'daily'),
  ('throughput_trend', CURRENT_DATE - INTERVAL '2 days', 41200, 'units', 'daily'),
  ('throughput_trend', CURRENT_DATE - INTERVAL '1 day', 38900, 'units', 'daily'),
  ('throughput_trend', CURRENT_DATE, 37604, 'units', 'daily'),
  ('error_rate', CURRENT_DATE - INTERVAL '6 days', 2.1, 'percent', 'daily'),
  ('error_rate', CURRENT_DATE - INTERVAL '5 days', 2.4, 'percent', 'daily'),
  ('error_rate', CURRENT_DATE - INTERVAL '4 days', 2.7, 'percent', 'daily'),
  ('error_rate', CURRENT_DATE - INTERVAL '3 days', 2.9, 'percent', 'daily'),
  ('error_rate', CURRENT_DATE - INTERVAL '2 days', 3.2, 'percent', 'daily'),
  ('error_rate', CURRENT_DATE - INTERVAL '1 day', 2.8, 'percent', 'daily'),
  ('error_rate', CURRENT_DATE, 2.6, 'percent', 'daily'),
  ('machine_efficiency', CURRENT_DATE - INTERVAL '6 days', 89.2, 'percent', 'daily'),
  ('machine_efficiency', CURRENT_DATE - INTERVAL '5 days', 91.5, 'percent', 'daily'),
  ('machine_efficiency', CURRENT_DATE - INTERVAL '4 days', 88.7, 'percent', 'daily'),
  ('machine_efficiency', CURRENT_DATE - INTERVAL '3 days', 92.3, 'percent', 'daily'),
  ('machine_efficiency', CURRENT_DATE - INTERVAL '2 days', 94.1, 'percent', 'daily'),
  ('machine_efficiency', CURRENT_DATE - INTERVAL '1 day', 93.8, 'percent', 'daily'),
  ('machine_efficiency', CURRENT_DATE, 94.7, 'percent', 'daily')
ON CONFLICT (metric_name, date, period_type) DO NOTHING;

-- Create views for dashboard queries
CREATE OR REPLACE VIEW dashboard_kpis AS
SELECT 
  dm.*,
  CASE 
    WHEN dm.trend_direction = 'up' AND dm.trend_percentage > 5 THEN 'high'
    WHEN dm.trend_direction = 'down' AND dm.trend_percentage > 5 THEN 'high'
    WHEN dm.trend_direction = 'up' AND dm.trend_percentage > 0 THEN 'medium'
    WHEN dm.trend_direction = 'down' AND dm.trend_percentage > 0 THEN 'medium'
    ELSE 'low'
  END as urgency_level
FROM dashboard_metrics dm
WHERE dm.metric_type = 'kpi';

CREATE OR REPLACE VIEW hourly_throughput_summary AS
SELECT 
  date,
  SUM(units_processed) as total_units,
  SUM(orders_processed) as total_orders,
  AVG(orders_processed) as avg_orders_per_hour,
  MAX(units_processed) as peak_hour_units,
  EXTRACT(HOUR FROM MAX(units_processed) ORDER BY units_processed DESC) as peak_hour
FROM hourly_throughput
GROUP BY date
ORDER BY date DESC;

CREATE OR REPLACE VIEW regional_performance AS
SELECT 
  date,
  hub,
  SUM(output_units) as total_units,
  SUM(output_value_usd) as total_value,
  AVG(percentage_total) as avg_percentage
FROM regional_output
GROUP BY date, hub
ORDER BY date DESC, total_units DESC;
