/**
 * Enhanced Dashboard View with Neumorphic Design
 * Features KPI cards, charts, and real-time analytics
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Package,
  BarChart3,
  Clock,
  Users,
  ShoppingCart,
  Calendar,
  Bell,
  Settings,
  ChevronRight,
  Activity,
  Zap,
  Warehouse,
  Shield,
} from 'lucide-react';
import { ordersAPI, warehouseAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface KPICard {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  sparklineData: number[];
  urgency: 'low' | 'medium' | 'high';
}

interface ProductionLine {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  units: number;
  capacity: number;
  efficiency: number;
  errors: number;
}

interface RegionalOutput {
  region: string;
  hub: string;
  units: number;
  percentage: number;
  color: string;
}

interface HourlyData {
  hour: number;
  units: number;
  label: string;
}

interface WorkOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  address: string;
  date: string;
  value: number;
  status: 'pending' | 'dispatch' | 'completed' | 'flagged';
  isHighlighted?: boolean;
}

const DashboardView: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPICard[]>([]);
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [regionalOutput, setRegionalOutput] = useState<RegionalOutput[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setKpiData([
        {
          id: 'orders_processed',
          title: 'Orders Processed',
          value: '2,634',
          unit: 'count',
          trend: 'up',
          trendPercentage: 8.4,
          sparklineData: [35, 58, 46, 74, 92, 84, 76],
          urgency: 'low',
        },
        {
          id: 'active_production_lines',
          title: 'Active Production Lines',
          value: '12',
          unit: 'lines',
          trend: 'up',
          trendPercentage: 20.0,
          sparklineData: [26, 32, 50, 63, 70, 76, 84],
          urgency: 'low',
        },
        {
          id: 'shipping_ontime',
          title: 'Shipping On-Time',
          value: '94.2',
          unit: '%',
          trend: 'up',
          trendPercentage: 1.9,
          sparklineData: [50, 62, 59, 68, 78, 88, 92],
          urgency: 'low',
        },
        {
          id: 'maintenance_alerts',
          title: 'Maintenance Alerts',
          value: '07',
          unit: 'count',
          trend: 'up',
          trendPercentage: 40.0,
          sparklineData: [18, 24, 29, 46, 57, 61, 76],
          urgency: 'medium',
        },
        {
          id: 'capacity_utilization',
          title: 'Capacity Utilization',
          value: '61',
          unit: '%',
          trend: 'up',
          trendPercentage: 4.1,
          sparklineData: [38, 41, 45, 52, 64, 72, 76],
          urgency: 'low',
        },
        {
          id: 'low_stock_skus',
          title: 'Low Stock SKUs',
          value: '23',
          unit: 'count',
          trend: 'down',
          trendPercentage: -27.8,
          sparklineData: [78, 70, 65, 55, 46, 40, 40],
          urgency: 'high',
        },
      ]);

      setProductionLines([
        { id: '1', name: 'Receiving', status: 'active', units: 428, capacity: 500, efficiency: 85.6, errors: 0 },
        { id: '2', name: 'Sorting', status: 'active', units: 96.4, capacity: 100, efficiency: 96.4, errors: 0 },
        { id: '3', name: 'Assembly', status: 'active', units: 290, capacity: 300, efficiency: 96.7, errors: 0 },
        { id: '4', name: 'Packing', status: 'active', units: 189, capacity: 200, efficiency: 94.5, errors: 1 },
        { id: '5', name: 'Dispatch', status: 'active', units: 41, capacity: 50, efficiency: 82.0, errors: 0 },
      ]);

      setRegionalOutput([
        { region: 'North Hub', hub: 'NBI', units: 42, percentage: 42, color: '#005eb8' },
        { region: 'East Hub', hub: 'NBI', units: 27, percentage: 27, color: '#4d86ff' },
        { region: 'South Hub', hub: 'DKR', units: 19, percentage: 19, color: '#9fbdff' },
        { region: 'Overflow', hub: 'OTHER', units: 12, percentage: 12, color: '#dbe7ff' },
      ]);

      setHourlyData([
        { hour: 2, units: 38, label: '02:00' },
        { hour: 4, units: 52, label: '04:00' },
        { hour: 6, units: 44, label: '06:00' },
        { hour: 8, units: 57, label: '08:00' },
        { hour: 10, units: 76, label: '10:00' },
        { hour: 12, units: 95, label: '12:00' },
        { hour: 14, units: 80, label: '14:00' },
        { hour: 16, units: 42, label: '16:00' },
        { hour: 18, units: 81, label: '18:00' },
        { hour: 20, units: 83, label: '20:00' },
        { hour: 22, units: 82, label: '22:00' },
        { hour: 24, units: 84, label: '24:00' },
      ]);

      setWorkOrders([
        {
          id: '1',
          orderNumber: '#2632',
          customerName: 'Brooklyn Zoe',
          address: '302 Slider Street, Rutland, VT',
          date: '31 Jul 2026',
          value: 64.00,
          status: 'pending',
        },
        {
          id: '2',
          orderNumber: '#2633',
          customerName: 'John McCormick',
          address: '1095 Wiseman Street, Calmar, IA',
          date: '01 Aug 2026',
          value: 35.00,
          status: 'dispatch',
          isHighlighted: true,
        },
        {
          id: '3',
          orderNumber: '#2634',
          customerName: 'Sandra Pugh',
          address: '1640 Thorn Street, Salt City, CA',
          date: '02 Aug 2026',
          value: 74.00,
          status: 'completed',
        },
        {
          id: '4',
          orderNumber: '#2635',
          customerName: 'Verrie Herr',
          address: '1488 Oak Drive, Dover, DE',
          date: '02 Aug 2026',
          value: 82.00,
          status: 'pending',
        },
        {
          id: '5',
          orderNumber: '#2636',
          customerName: 'Mark Clark',
          address: '195 Augusta Park, Nassau, NY',
          date: '03 Aug 2026',
          value: 39.00,
          status: 'dispatch',
        },
        {
          id: '6',
          orderNumber: '#2637',
          customerName: 'Rebekah Foster',
          address: '1445 Park Boulevard, Biola, CA',
          date: '03 Aug 2026',
          value: 67.00,
          status: 'flagged',
        },
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'idle': return 'bg-gray-100 text-gray-700';
      case 'maintenance': return 'bg-amber-100 text-amber-700';
      case 'offline': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'dispatch': return 'bg-blue-100 text-blue-600';
      case 'completed': return 'bg-gray-100 text-gray-600';
      case 'flagged': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
    return <Activity className="w-3 h-3" />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Unified warehouse analytics, throughput monitoring, and live order visibility.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="neu-btn px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            31 Jul 2026 → 03 Aug 2026
          </div>
          <button className="neu-circle w-12 h-12 text-gray-600 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-red-400 flex items-center justify-center text-white font-bold">
            AL
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 justify-end">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
            selectedTab === 'overview' 
              ? 'neu-btn-primary text-white' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setSelectedTab('dispatch')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
            selectedTab === 'dispatch' 
              ? 'neu-btn-primary text-white' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Dispatch
        </button>
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
            selectedTab === 'pending' 
              ? 'neu-btn-primary text-white' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending
        </button>
        <button
          onClick={() => setSelectedTab('completed')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
            selectedTab === 'completed' 
              ? 'neu-btn-primary text-white' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          Completed
        </button>
        <div className="w-px h-8 bg-gray-300 mx-2" />
        <button
          onClick={() => setSelectedTab('osl')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 border border-amber-200 transition-colors ${
            selectedTab === 'osl' 
              ? 'neu-btn-primary text-white border-blue-600' 
              : 'text-amber-600 hover:text-amber-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          OSL Operations
        </button>
        <button
          onClick={() => setSelectedTab('warehouse')}
          className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 border border-purple-200 transition-colors ${
            selectedTab === 'warehouse' 
              ? 'neu-btn-primary text-white border-blue-600' 
              : 'text-purple-600 hover:text-purple-700'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          Warehouse
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="neu-flat p-5"
          >
            <div className="text-xs text-gray-500 font-semibold mb-1">{kpi.title}</div>
            <div className="text-2xl font-bold text-gray-800">{kpi.value}</div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              {getTrendIcon(kpi.trend)}
              <span className={getTrendColor(kpi.trend)}>
                {kpi.trend === 'up' ? '+' : ''}{kpi.trendPercentage}% vs last week
              </span>
            </div>
            <div className="sparkline mt-3">
              {kpi.sparklineData.map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Throughput */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="neu-flat p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Hourly Throughput</h3>
            <span className="text-xs text-gray-500 font-semibold">Units processed</span>
          </div>
          <div className="bar-chart">
            {hourlyData.map((data) => (
              <div key={data.hour} className="bar-group">
                <div
                  className={`bar ${data.hour === 12 ? '' : 'light'}`}
                  style={{ height: `${(data.units / 95) * 100}%` }}
                />
                <span className="text-xs text-gray-500 mt-2">{data.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Regional Output Share */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="neu-flat p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Regional Output Share</h3>
            <span className="text-xs text-gray-500 font-semibold">Live allocation</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="donut" data-label="84%\nuptime" />
            <div className="w-full space-y-2">
              {regionalOutput.map((region) => (
                <div key={region.region} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-gray-700 font-semibold">{region.region}</span>
                  </div>
                  <span className="font-bold text-gray-800">{region.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fulfillment Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neu-flat p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Fulfillment Pipeline</h3>
            <span className="text-xs text-gray-500 font-semibold">Real-time workflow status</span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {productionLines.map((line, index) => (
              <div key={line.id} className="flow-step">
                <div className="step-icon">{index + 1}</div>
                <div className="text-sm font-bold text-gray-800">{line.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {line.units} units inbound
                </div>
                <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(line.status)}`}>
                  {line.status.charAt(0).toUpperCase() + line.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Stack */}
        <div className="space-y-6">
          {/* Capacity Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="neu-flat p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-800">Capacity Gauge</h3>
              <span className="text-xs text-gray-500 font-semibold">Line saturation</span>
            </div>
            <div className="gauge" />
            <div className="text-center text-2xl font-bold text-gray-800">61%</div>
            <p className="text-center text-xs text-gray-500 mt-1">Balanced load across production groups</p>
          </motion.div>

          {/* Inventory Pressure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="neu-flat p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Inventory Pressure</h3>
              <span className="text-xs text-gray-500 font-semibold">SKU health</span>
            </div>
            <div className="space-y-3">
              {[
                {sku: 'GR150-1', current: 75, max: 100},
                {sku: 'Stack A2', current: 46, max: 100},
                {sku: 'Pack SF', current: 23, max: 100},
                {sku: 'GR150-2', current: 67, max: 100},
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-700">{item.sku}</span>
                    <span className="text-gray-500">{item.current} / {item.max}</span>
                  </div>
                  <div className="track">
                    <div
                      className={`fill ${item.current < 30 ? 'danger' : ''}`}
                      style={{ width: `${item.current}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Live Work Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neu-flat overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">Live Work Orders</h3>
            <span className="text-xs text-gray-500 font-semibold">Real-time order tracking</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {workOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                    order.isHighlighted ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : ''
                  }`}
                >
                  <td className="py-4 px-6 text-sm font-medium">{order.orderNumber}</td>
                  <td className="py-4 px-6 text-sm">{order.customerName}</td>
                  <td className={`py-4 px-6 text-sm ${order.isHighlighted ? 'text-white/80' : 'text-gray-600'}`}>
                    {order.address}
                  </td>
                  <td className={`py-4 px-6 text-sm ${order.isHighlighted ? 'text-white/80' : 'text-gray-600'}`}>
                    {order.date}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold">
                    ${order.value.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`neu-pressed px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="neu-circle w-8 h-8 text-gray-600">
                      <Settings className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 p-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 01–06 of {workOrders.length} orders</p>
          <div className="flex gap-2">
            <button className="neu-btn px-3 py-1 text-sm text-gray-600" disabled>
              ‹
            </button>
            <button className="neu-btn-primary px-3 py-1 text-sm">1</button>
            <button className="neu-btn px-3 py-1 text-sm text-gray-600">2</button>
            <button className="neu-btn px-3 py-1 text-sm text-gray-600">3</button>
            <button className="neu-btn px-3 py-1 text-sm text-gray-600">4</button>
            <button className="neu-btn px-3 py-1 text-sm text-gray-600">›</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardView;
