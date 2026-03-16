import React, { useMemo, useState } from 'react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
  selectedOrderId?: string | null;
  setSelectedOrderId?: (id: string | null) => void;
}

type Tab = 'all' | 'dispatch' | 'pending' | 'complete';

const statusToTab: Record<string, Tab> = {
  approved: 'dispatch',
  submitted: 'pending',
  draft: 'pending',
  completed: 'complete',
};

const friendlyStatus = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('draft')) return 'Draft';
  if (s.includes('submit')) return 'Submitted';
  if (s.includes('approve')) return 'Approved';
  if (s.includes('complete')) return 'Completed';
  return status;
};

const statusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('draft') || s.includes('pending')) return '#f59e0b';
  if (s.includes('submit')) return '#6366f1';
  if (s.includes('approve')) return '#16a34a';
  if (s.includes('complete')) return '#0ea5e9';
  return '#94a3b8';
};

const statusDotClass = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('draft') || s.includes('pending')) return 'bg-amber-500';
  if (s.includes('submit')) return 'bg-indigo-500';
  if (s.includes('approve')) return 'bg-emerald-500';
  if (s.includes('complete')) return 'bg-sky-500';
  return 'bg-slate-400';
};

function OrdersView({ orders, onUpdateStatus, selectedOrderId, setSelectedOrderId }: OrdersViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter((o) => {
      const tab = statusToTab[o.status?.toLowerCase()] || 'pending';
      return tab === activeTab;
    });
  }, [orders, activeTab]);

  const selected = useMemo(() => {
    if (!filteredOrders.length) return null;
    const found = filteredOrders.find((o) => o.id === selectedOrderId);
    return found || filteredOrders[0];
  }, [filteredOrders, selectedOrderId]);

  const handleSelect = (id: string) => {
    setSelectedOrderId?.(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">Manage requests, drafts, approvals, and releases.</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'dispatch', 'pending', 'complete'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'dispatch' ? 'Dispatch' : tab === 'pending' ? 'Pending' : 'Complete'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="text-sm font-bold text-slate-700">Orders List</div>
              <div className="text-xs text-slate-500">{filteredOrders.length} record(s)</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] tracking-wide">
                  <tr>
                    <th className="px-4 py-3">Ref</th>
                    <th className="px-4 py-3">Requester</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className={selected?.id === order.id ? 'bg-blue-50/60' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3 font-bold text-slate-800">{order.ref || order.id}</td>
                      <td className="px-4 py-3 text-slate-700">{order.name}</td>
                      <td className="px-4 py-3 text-slate-600">{order.date}</td>
                      <td className="px-4 py-3 text-slate-800">${order.value?.toFixed?.(2) || '0.00'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold" aria-label={`Status ${friendlyStatus(order.status)}`}>
                          <span className={`h-2.5 w-2.5 rounded-full ${statusDotClass(order.status)}`} />
                          {friendlyStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSelect(order.id)}
                          className="text-blue-600 font-bold text-sm hover:underline"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-slate-400 font-medium">No orders in this view.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase font-bold text-slate-400">Selected Order</div>
                <div className="text-lg font-black text-slate-900">{selected?.ref || selected?.id || '—'}</div>
              </div>
              {selected && (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                  <span className={`h-2.5 w-2.5 rounded-full ${statusDotClass(selected.status)}`} />
                  {friendlyStatus(selected.status)}
                </span>
              )}
            </div>

            {selected ? (
              <div className="space-y-3 text-sm text-slate-700">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs uppercase font-bold text-slate-400">Requester</div>
                    <div className="font-semibold text-slate-900">{selected.name}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-slate-400">Consignee</div>
                    <div className="text-slate-800">{selected.consignee || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-slate-400">Shipment Mode</div>
                    <div className="text-slate-800">{selected.shipmentMode || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-slate-400">Notify</div>
                    <div className="text-slate-800">{selected.notify || 'N/A'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase font-bold text-slate-400">Remarks</div>
                  <div className="text-slate-700 leading-relaxed">{selected.remarks || 'No remarks'}</div>
                </div>

                <div>
                  <div className="text-xs uppercase font-bold text-slate-400 mb-2">Items</div>
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                        <tr>
                          <th className="px-3 py-2 text-left">Item</th>
                          <th className="px-3 py-2 text-left">SKU</th>
                          <th className="px-3 py-2 text-center">Qty</th>
                          <th className="px-3 py-2 text-right">Price</th>
                          <th className="px-3 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {selected.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 font-semibold">{item.product.name}</td>
                            <td className="px-3 py-2 text-slate-500">{item.product.sku}</td>
                            <td className="px-3 py-2 text-center">{item.qty}</td>
                            <td className="px-3 py-2 text-right">${item.product.price.toFixed(2)}</td>
                            <td className="px-3 py-2 text-right">${(item.qty * item.product.price).toFixed(2)}</td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={5} className="px-3 py-3 text-center text-slate-400">No items</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => selected && onUpdateStatus(selected.id, 'approved' as Order['status'])}
                    className="flex-1 rounded-xl bg-emerald-600 text-white font-bold py-2 text-sm hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => selected && onUpdateStatus(selected.id, 'draft' as Order['status'])}
                    className="flex-1 rounded-xl bg-amber-500 text-white font-bold py-2 text-sm hover:bg-amber-600"
                  >
                    Send Back
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500">Select an order to view details.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersView;