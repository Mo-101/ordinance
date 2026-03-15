import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';

const KpiCard = ({ label, value, trend, trendUp, data, color }: { 
  label: string, 
  value: string, 
  trend: string, 
  trendUp?: boolean,
  data: { value: number }[],
  color: string
}) => (
  <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 transition-transform hover:scale-[1.02] duration-300">
    <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1">{label}</div>
    <div className="flex items-end justify-between mb-2">
      <div className="text-2xl font-black">{value}</div>
      <div className={`flex items-center gap-1 text-[10px] font-bold ${trendUp ? 'text-emerald-500' : 'text-orange-500'}`}>
        {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#color${label.replace(/\s/g, '')})`} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const throughputData = [
  { time: '00:00', value: 38 },
  { time: '02:00', value: 52 },
  { time: '04:00', value: 44 },
  { time: '06:00', value: 57 },
  { time: '08:00', value: 76 },
  { time: '10:00', value: 95 },
  { time: '12:00', value: 80 },
  { time: '14:00', value: 42 },
  { time: '16:00', value: 81 },
  { time: '18:00', value: 83 },
  { time: '20:00', value: 82 },
  { time: '22:00', value: 84 },
];

const regionalData = [
  { name: 'North Hub', value: 42, color: '#0f5bff' },
  { name: 'East Hub', value: 27, color: '#3b82f6' },
  { name: 'South Hub', value: 19, color: '#60a5fa' },
  { name: 'Overflow', value: 12, color: '#93c5fd' },
];

function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard 
          label="Orders Processed" 
          value="2,634" 
          trend="8.4%" 
          trendUp 
          color="#10b981"
          data={[{value: 30}, {value: 45}, {value: 35}, {value: 60}, {value: 55}, {value: 80}]} 
        />
        <KpiCard 
          label="Active Lines" 
          value="12" 
          trend="2 online" 
          trendUp 
          color="#3b82f6"
          data={[{value: 10}, {value: 12}, {value: 11}, {value: 13}, {value: 12}, {value: 14}]} 
        />
        <KpiCard 
          label="On-Time Rate" 
          value="94.2%" 
          trend="1.9%" 
          trendUp 
          color="#8b5cf6"
          data={[{value: 90}, {value: 92}, {value: 91}, {value: 94}, {value: 93}, {value: 95}]} 
        />
        <KpiCard 
          label="Alerts" 
          value="07" 
          trend="2 review" 
          color="#f59e0b"
          data={[{value: 5}, {value: 8}, {value: 4}, {value: 7}, {value: 6}, {value: 9}]} 
        />
        <KpiCard 
          label="Capacity" 
          value="61%" 
          trend="4.1%" 
          trendUp 
          color="#ec4899"
          data={[{value: 50}, {value: 55}, {value: 52}, {value: 60}, {value: 58}, {value: 65}]} 
        />
        <KpiCard 
          label="Low Stock" 
          value="23" 
          trend="5 urgent" 
          color="#ef4444"
          data={[{value: 20}, {value: 25}, {value: 22}, {value: 28}, {value: 24}, {value: 30}]} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black text-gray-800">Hourly Throughput</h3>
              <p className="text-xs text-gray-400 font-bold">Units processed per time block</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-gray-500">Target</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughputData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="4" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.2" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                  filter="url(#shadow)"
                >
                  {throughputData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={index === 5 ? 1 : 0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
          <div className="mb-8">
            <h3 className="text-lg font-black text-gray-800">Regional Output</h3>
            <p className="text-xs text-gray-400 font-bold">Live allocation distribution</p>
          </div>
          
          <div className="h-[240px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontWeight: 'bold'
                  }}
                />
                <Pie
                  data={regionalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {regionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-gray-800">84%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Uptime</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {regionalData.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black text-gray-800">Live Work Orders</h3>
            <p className="text-xs text-gray-400 font-bold">Real-time processing queue</p>
          </div>
          <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">Order ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">Name</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">Value</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { id: '#2632', name: 'Brooklyn Zoe', date: '31 Jul 2026', val: '$64.00', status: 'Pending', color: 'bg-orange-400' },
                { id: '#2633', name: 'John McCormick', date: '01 Aug 2026', val: '$35.00', status: 'Dispatch', color: 'bg-emerald-400', active: true },
                { id: '#2634', name: 'Sandra Pugh', date: '02 Aug 2026', val: '$74.00', status: 'Completed', color: 'bg-gray-400' },
                { id: '#2635', name: 'Verrie Herr', date: '02 Aug 2026', val: '$82.00', status: 'Pending', color: 'bg-orange-400' }
              ].map((row, i) => (
                <tr key={i} className={`transition-all duration-200 ${row.active ? 'bg-blue-600 text-white shadow-lg scale-[1.01] z-10 relative' : 'hover:bg-gray-50/50'}`}>
                  <td className="px-6 py-4 font-bold text-sm">{row.id}</td>
                  <td className="px-6 py-4 font-bold text-sm">{row.name}</td>
                  <td className="px-6 py-4 font-bold text-sm opacity-80">{row.date}</td>
                  <td className="px-6 py-4 font-bold text-sm">{row.val}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider">
                      <div className={`w-1.5 h-1.5 rounded-full ${row.active ? 'bg-white' : row.color}`} />
                      {row.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className={`p-2 rounded-xl transition-colors ${row.active ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
