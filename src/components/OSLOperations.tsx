import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  ref: string;
  name: string;
  status: string;
}

interface OSLOperationsProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: any) => void;
}

function OSLOperations({ orders, onUpdateStatus }: OSLOperationsProps) {
  const submittedOrders = orders.filter(o => o.status === 'submitted');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden !p-0">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold">Pending Operations Queue</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                {submittedOrders.length} Ready for Review
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/30">
                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-gray-400 font-bold">Ref</th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-gray-400 font-bold">Requester</th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-gray-400 font-bold">Country</th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-wider text-gray-400 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submittedOrders.length > 0 ? submittedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold">{order.ref}</td>
                      <td className="px-6 py-4 font-bold">{order.name}</td>
                      <td className="px-6 py-4 font-bold">{order.ref.split('_')[2] || 'Global'}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => onUpdateStatus(order.id, 'approved')}
                          className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 shadow-md"
                        >
                          Approve & Release
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-bold italic">
                        No pending requests in queue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold">Process Timeline</h3>
            <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {[
                { title: 'Order Validated', desc: 'Requester completed mandatory fields.', status: 'done' },
                { title: 'OSL Review', desc: 'Operations confirming shipment data.', status: 'active' },
                { title: 'Stock Release', desc: 'Generating warehouse release document.', status: 'pending' }
              ].map((step, i) => (
                <div key={i} className="relative pl-8">
                  <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white shadow-sm ${step.status === 'done' ? 'bg-emerald-500' : step.status === 'active' ? 'bg-blue-500' : 'bg-gray-200'}`} />
                  <div className="text-sm font-bold">{step.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 text-blue-800 text-sm leading-relaxed">
            <div className="flex gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <p><strong>Note:</strong> Once approved, the request locks and a Material Stock Release document is generated automatically.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Release Form Preview (Mock) */}
      <div className="bg-white border-2 border-[#d9e7fb] rounded-xl overflow-hidden shadow-xl opacity-50 grayscale pointer-events-none">
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-black uppercase tracking-widest">Material Stock Release Preview</div>
        <div className="p-12 text-center font-black text-gray-300 uppercase tracking-widest text-4xl">
          Stock Release Document<br/>Generated Upon Approval
        </div>
      </div>
    </motion.div>
  );
}

export default OSLOperations;
