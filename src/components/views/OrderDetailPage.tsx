import React from 'react';
import {
  Activity,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import './OSLOperations.css';

const OrderDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#f5f7fb] text-[#1c2333]">
      <aside className="w-64 min-h-screen p-6 flex flex-col gap-2 fixed left-0 top-0 h-full overflow-y-auto" style={{ backgroundColor: '#005eb8', zIndex: 50 }}>
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-white block">MedSupply</span>
              <span className="text-xs text-white/60">Professional</span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <a className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors" href="#">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a className="sidebar-active flex items-center gap-3 px-4 py-3 text-gray-800 font-semibold relative" href="#">
            <ShoppingCart className="w-5 h-5" style={{ color: '#005eb8' }} />
            <span>Orders</span>
            <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#005eb8', color: 'white' }}>48</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors" href="#">
            <Package className="w-5 h-5" />
            <span className="font-medium">Products</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors" href="#">
            <Users className="w-5 h-5" />
            <span className="font-medium">Customers</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors" href="#">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Prescriptions</span>
          </a>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/20">
          <a className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors" href="#">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-red-300 transition-colors" href="#">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-4 md:p-8 overflow-auto bg-[#f5f7fb]">
        <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Request</h1>
            <p className="text-gray-500 mt-1">WHO Emergency Material Request Form - Official Document</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 rounded-full bg-white shadow-md text-gray-700 font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-red-400 flex items-center justify-center text-white font-bold">
              AL
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Request Status</h3>
              <span className="text-sm text-gray-500">Order #OR-24-001</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="status-pill">Draft validated</span>
              <span className="status-pill">1h adjustment window</span>
              <span className="status-pill">Awaiting OSL review</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Checkout Summary</h3>
              <span className="text-sm text-gray-500">Current request</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Cart items</span><strong className="text-gray-800">1 line</strong></div>
              <div className="flex justify-between"><span className="text-gray-600">Units</span><strong className="text-gray-800">2</strong></div>
              <div className="flex justify-between"><span className="text-gray-600">Estimated value</span><strong className="text-gray-800">$310</strong></div>
              <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-gray-800 font-bold">Route</span><strong className="text-gray-800">Order Request → OSL Operations</strong></div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 timeline">
            <div className="timeline-step done">
              <h4>Checkout completed</h4>
              <p>Items transferred from product catalog into a draft order request.</p>
            </div>
            <div className="timeline-step active">
              <h4>Requester adjustment window</h4>
              <p>1 hour window for edits, PTEAO, shipment data, and requester references.</p>
            </div>
            <div className="timeline-step">
              <h4>OSL Operations review</h4>
              <p>Operations validates and routes approved requests to stock release.</p>
            </div>
            <div className="timeline-step">
              <h4>Stock release</h4>
              <p>Warehouse release is generated after approval.</p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto mb-6">
          <div className="lock-note">
            <b>Workflow Guardrail</b><br />
            Mandatory fields must validate before submit. After submission, the request stays editable for 1 hour. Once OSL Operations approves it, the request locks and only stock release can proceed.
          </div>
        </section>

        <section className="max-w-7xl mx-auto mb-8">
          <div className="who-form">
            <div className="who-topline">
              <div className="who-logo">World Health Organization</div>
              <div className="who-title">Emergency</div>
              <div className="who-ref">REF: OR_24-001_Kenya</div>
            </div>

            <div className="who-grid">
              <div className="who-cell yellow"><b>From (initiator):</b><br /><span>OSL Emergency Response Unit</span></div>
              <div className="who-cell label right"><b>Mode of shipment:</b><br /><span>Air freight</span></div>
              <div className="who-cell blue center"><b>PTEAO</b><br /><span>Pending input</span></div>

              <div className="who-cell yellow"><b>Consignee address:</b><br /><span>World Health Organization<br />Office of the WHO Representative<br />Kenya Response Desk</span></div>
              <div className="who-cell label right"><b>Nb of lines:</b><br /><span>1</span></div>
              <div className="who-cell blue"><b>Estimated total cost:</b><br /><span>USD 310.00</span></div>

              <div className="who-cell gray"><b>To (processing unit):</b><br />OSL Operations Desk</div>
              <div className="who-cell label right"><b>Estimated goods cost:</b><br /><span>USD 298.00</span></div>
              <div className="who-cell blue"><b>Requester ref:</b><br /><span>REQ-EM-001</span></div>

              <div className="who-cell"><b>Notify party:</b><br /><span>osl.emergency@who.int<br />ava.lewis@who.int<br />wro.logistics@who.int</span></div>
              <div className="who-cell label right"><b>Requested ready on:</b><br /><span>05-Aug-26</span></div>
              <div className="who-cell blue"><b>Confirmed ready date:</b><br />Pending OSL</div>

              <div className="who-cell"><b>Shipping dimensions:</b><br /><span>Auto-generated from selected item and quantity.</span></div>
              <div className="who-cell label right"><b>Estimated weight (kg):</b><br /><span>24</span></div>
              <div className="who-cell blue"><b>Confirmed weight:</b><br />Pending OSL</div>

              <div className="who-cell"><b>Remarks:</b><br /><span>Draft created from checkout. Awaiting requester validation and submit.</span></div>
              <div className="who-cell label right"><b>Estimated volume (cbm):</b><br /><span>0.8</span></div>
              <div className="who-cell blue"><b>Confirmed volume:</b><br />Pending OSL</div>
            </div>

            <div className="who-section-title">Order request line items</div>
            <div className="who-items">
              <table>
                <thead>
                  <tr><th>#</th><th>WHO code</th><th>WHO description</th><th>UoM</th><th>Quantity</th><th>Unit price USD</th><th>Total amount</th><th>Remarks</th></tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>ERK-204</td><td>Emergency Response Kit</td><td>kit</td><td>2</td><td>149.00</td><td>298.00</td><td>checkout populated</td></tr>
                </tbody>
              </table>
            </div>

            <div className="who-signoff">
              <div className="who-sign"><span>In charge of supply</span></div>
              <div className="who-sign"><span>Reviewer</span></div>
              <div className="who-sign"><span>Approver</span></div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto flex justify-between items-center mb-12">
          <button className="px-6 py-3 rounded-full bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all">Save Draft</button>
            <button className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Validate & Send
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderDetailPage;
