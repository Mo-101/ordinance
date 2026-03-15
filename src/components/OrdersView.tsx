import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock } from 'lucide-react';

interface Order {
  id: string;
  ref: string;
  name: string;
  address: string;
  date: string;
  value: number;
  status: string;
  initiator: string;
  shipmentMode: string;
  pteao: string;
  consignee: string;
  notify: string;
  readyDate: string;
  weight: number;
  volume: number;
  remarks: string;
  items: any[];
}

interface OrdersViewProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: any) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
}

const WhoFormCell = ({ label, value, type = 'default', colSpan = 1, onChange }: { 
  label: string, 
  value: string, 
  type?: 'default' | 'blue' | 'yellow' | 'gray',
  colSpan?: number,
  onChange?: (val: string) => void
}) => {
  const typeClass = {
    default: 'border border-[#d9e7fb] p-3',
    blue: 'border border-[#d9e7fb] p-3 bg-[#eef6ff]',
    yellow: 'border border-[#d9e7fb] p-3 bg-[#fff9e6]',
    gray: 'border border-[#d9e7fb] p-3 bg-gray-50 text-gray-500'
  }[type];

  return (
    <div className={`${typeClass} flex flex-col`} style={{ gridColumn: `span ${colSpan}` }}>
      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">{label}</span>
      {onChange ? (
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-none p-0 focus:ring-0 font-bold text-sm w-full"
        />
      ) : (
        <span className="font-bold text-sm">{value}</span>
      )}
    </div>
  );
};

function OrdersView({ orders, onUpdateStatus, selectedOrderId, setSelectedOrderId }: OrdersViewProps) {
  const [countdown, setCountdown] = useState(3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <AnimatePresence mode="wait">
        {!selectedOrderId ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden !p-0"
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold">All Orders</h3>
              <div className="flex gap-2">
                {['All', 'Draft', 'Submitted', 'Approved'].map(tab => (
                  <button key={tab} className={`px-4 py-1.5 rounded-full text-xs font-bold ${tab === 'All' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-100'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/30">
                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-gray-400 font-bold">Ref</th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-gray-400 font-bold">Name</th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-gray-400 font-bold">Date</th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-gray-400 font-bold">Value</th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-gray-400 font-bold">Status</th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-gray-400 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold">{order.ref}</td>
                      <td className="px-6 py-4 font-bold">{order.name}</td>
                      <td className="px-6 py-4 font-bold">{order.date}</td>
                      <td className="px-6 py-4 font-bold">${order.value.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <div className={`w-2 h-2 rounded-full ${order.status === 'draft' ? 'bg-orange-400' : order.status === 'submitted' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedOrderId(order.id)}
                          className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-100"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setSelectedOrderId(null)}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
              >
                <ArrowLeft size={16} /> Back to orders
              </button>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 font-bold text-sm">
                  <Clock size={16} />
                  Adjustment Window: {formatTime(countdown)}
                </div>
                {selectedOrder?.status === 'draft' && (
                  <button 
                    onClick={() => onUpdateStatus(selectedOrder.id, 'submitted')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100"
                  >
                    Validate & Send
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {[
                { label: 'Checkout Completed', desc: 'Items transferred from catalog.', status: 'done' },
                { label: 'Adjustment Window', desc: '1 hour window for edits.', status: 'active' },
                { label: 'OSL Review', desc: 'Operations validates request.', status: 'pending' },
                { label: 'Stock Release', desc: 'Warehouse release generated.', status: 'pending' }
              ].map((step, i) => (
                <div key={i} className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 border-l-4 ${step.status === 'done' ? 'border-emerald-500' : step.status === 'active' ? 'border-blue-500' : 'border-gray-200'}`}>
                  <div className="text-xs font-black uppercase tracking-wider text-gray-400 mb-1">{step.label}</div>
                  <div className="text-sm font-bold">{step.desc}</div>
                </div>
              ))}
            </div>

            <div className="bg-white border-2 border-[#d9e7fb] rounded-xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-3 border-b-2 border-[#d9e7fb]">
                <div className="p-4 bg-white border-r border-[#d9e7fb] flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">WHO</div>
                  <div className="text-[10px] font-black uppercase leading-tight">World Health<br/>Organization</div>
                </div>
                <div className="p-4 bg-white border-r border-[#d9e7fb] flex items-center justify-center">
                  <div className="text-2xl font-black text-rose-600 uppercase tracking-widest">Emergency</div>
                </div>
                <div className="p-4 bg-white flex flex-col justify-center items-center">
                  <div className="text-[10px] font-black text-gray-400 uppercase">Reference</div>
                  <div className="text-sm font-black">{selectedOrder?.ref}</div>
                </div>
              </div>

              <div className="grid grid-cols-3">
                <WhoFormCell label="From (Initiator)" value={selectedOrder?.initiator || ''} type="yellow" />
                <WhoFormCell label="Mode of Shipment" value={selectedOrder?.shipmentMode || ''} type="default" />
                <WhoFormCell label="PTEAO" value={selectedOrder?.pteao || 'PENDING'} type="blue" />

                <WhoFormCell label="Consignee Address" value={selectedOrder?.consignee || ''} type="yellow" colSpan={1} />
                <WhoFormCell label="Nb of Lines" value={selectedOrder?.items.length.toString() || '0'} type="default" />
                <WhoFormCell label="Estimated Total Cost" value={`USD ${selectedOrder?.value.toFixed(2)}`} type="blue" />

                <WhoFormCell label="Notify Party" value={selectedOrder?.notify || ''} type="default" />
                <WhoFormCell label="Requested Ready On" value={selectedOrder?.readyDate || ''} type="default" />
                <WhoFormCell label="Requester Ref" value={selectedOrder?.id || ''} type="blue" />
              </div>

              <div className="bg-[#11a7e8] text-white px-4 py-2 text-xs font-black uppercase tracking-widest">Order Request Line Items</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-[10px] font-black uppercase border-r border-b border-[#d9e7fb]">#</th>
                      <th className="px-4 py-2 text-[10px] font-black uppercase border-r border-b border-[#d9e7fb]">WHO Code</th>
                      <th className="px-4 py-2 text-[10px] font-black uppercase border-r border-b border-[#d9e7fb]">Description</th>
                      <th className="px-4 py-2 text-[10px] font-black uppercase border-r border-b border-[#d9e7fb]">UoM</th>
                      <th className="px-4 py-2 text-[10px] font-black uppercase border-r border-b border-[#d9e7fb]">Qty</th>
                      <th className="px-4 py-2 text-[10px] font-black uppercase border-r border-b border-[#d9e7fb]">Unit Price</th>
                      <th className="px-4 py-2 text-[10px] font-black uppercase border-b border-[#d9e7fb]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder?.items.map((item, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-xs border-r border-b border-[#d9e7fb]">{i + 1}</td>
                        <td className="px-4 py-2 text-xs border-r border-b border-[#d9e7fb] font-bold">{item.product.sku}</td>
                        <td className="px-4 py-2 text-xs border-r border-b border-[#d9e7fb] font-bold">{item.product.name}</td>
                        <td className="px-4 py-2 text-xs border-r border-b border-[#d9e7fb] uppercase">{item.product.id === 'kit' ? 'kit' : 'box'}</td>
                        <td className="px-4 py-2 text-xs border-r border-b border-[#d9e7fb] font-bold">{item.qty}</td>
                        <td className="px-4 py-2 text-xs border-r border-b border-[#d9e7fb]">${item.product.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-xs border-b border-[#d9e7fb] font-bold">${(item.qty * item.product.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-3 h-24 border-t-2 border-[#11a7e8]">
                <div className="border-r border-[#d9e7fb] p-2 flex flex-col justify-between">
                  <span className="text-[9px] font-bold italic text-amber-800">In charge of supply</span>
                  <div className="h-px bg-gray-200 w-full mb-2" />
                </div>
                <div className="border-r border-[#d9e7fb] p-2 flex flex-col justify-between">
                  <span className="text-[9px] font-bold italic text-amber-800">Reviewer</span>
                  <div className="h-px bg-gray-200 w-full mb-2" />
                </div>
                <div className="p-2 flex flex-col justify-between">
                  <span className="text-[9px] font-bold italic text-amber-800">Approver</span>
                  <div className="h-px bg-gray-200 w-full mb-2" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default OrdersView;
