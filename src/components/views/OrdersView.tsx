import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Order, OrderState } from '../../types';
import { ordersAPI } from '../../services/api';
import CoordinatorPanel from '../CoordinatorPanel';
import SourcingOptionsModal from '../SourcingOptionsModal';
import toast from 'react-hot-toast';
import { OrderStateMachine } from '../../engine/order-state-machine.v2';
import '../../styles/OrdersView.css';

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

const statusDotclassName = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('draft') || s.includes('pending')) return 'bg-amber-500';
  if (s.includes('submit')) return 'bg-indigo-500';
  if (s.includes('approve')) return 'bg-emerald-500';
  if (s.includes('complete')) return 'bg-sky-500';
  return 'bg-slate-400';
};

function OrdersView({ orders, onUpdateStatus, selectedOrderId, setSelectedOrderId }: OrdersViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [showCoordinator, setShowCoordinator] = useState(false);
  const [showSourcingModal, setShowSourcingModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleStateTransition = async (orderId: string, toState: OrderState, actor: string, reason?: string) => {
    setIsTransitioning(true);
    try {
      const transition = OrderStateMachine.transition(
        selected?.status as OrderState || 'draft',
        toState,
        actor,
        reason
      );
      
      const response = await ordersAPI.transition(orderId, toState, actor, reason);
      if (response.success) {
        toast.success(`Order ${transition.from} → ${transition.to}`);
        onUpdateStatus(orderId, toState as Order['status']);
      }
    } catch (error: any) {
      toast.error(error.message || 'Transition failed');
    } finally {
      setIsTransitioning(false);
    }
  };

  const getAvailableActions = (order: Order) => {
    const currentStatus = order.status as OrderState;
    const actions: { label: string; state: OrderState; actor: string; color: string }[] = [];

    // Country actions
    if (currentStatus === 'draft') {
      actions.push({ label: 'Submit', state: 'submitted', actor: 'country', color: 'blue' });
    }
    if (currentStatus === 'submitted') {
      actions.push({ label: 'Cancel', state: 'cancelled', actor: 'country', color: 'red' });
    }
    if (currentStatus === 'awaiting_country_decision') {
      actions.push({ label: 'View Options', state: 'awaiting_country_decision', actor: 'country', color: 'purple' });
    }

    // Coordinator actions
    if (currentStatus === 'submitted') {
      actions.push({ label: 'Coordinate', state: 'coordination_exception', actor: 'coordinator', color: 'yellow' });
    }

    // OSL actions
    if (currentStatus === 'under_osl_review') {
      actions.push({ label: 'Reserve Stock', state: 'stock_reserved', actor: 'osl_ops', color: 'green' });
    }
    if (currentStatus === 'stock_reserved') {
      actions.push({ label: 'Release Stock', state: 'stock_released', actor: 'osl_ops', color: 'blue' });
    }
    if (currentStatus === 'stock_released') {
      actions.push({ label: 'Dispatch', state: 'dispatched', actor: 'osl_ops', color: 'purple' });
    }

    return actions;
  };

  return (
    <div className="orders-view-container">
      <div className="orders-header-section">
        <div className="orders-header-title">
          <h1>Order Request</h1>
          <p>Submit and manage emergency supply requests.</p>
        </div>
        <div className="orders-header-actions">
          <button className="orders-tab-btn active">New Request</button>
          <button className="orders-tab-btn">Submitted</button>
          <button className="orders-tab-btn">In Review</button>
          <button className="orders-tab-btn">Approved</button>
        </div>
      </div>

      <div className="order-request-form">
        {/* WHO Header */}
        <div className="who-header">
          <div className="who-logo-section">
            <div className="who-logo">WHO</div>
            <div className="who-org">World Health Organization</div>
          </div>
          <div className="who-title-section">
            <div className="who-title">Emergency</div>
            <div className="who-subtitle">ORDINARY REQUEST</div>
          </div>
          <div className="who-ref-section">
            <div className="who-ref-label">REF:</div>
            <div className="who-ref-value">OR_24-001_Kenya</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions-header">
          <div className="countdown-timer">
            <span className="timer-icon">⏰</span>
            <span className="timer-text">01:00:00</span>
          </div>
          <div className="header-buttons">
            <button className="header-btn secondary">Back to orders</button>
            <button className="header-btn secondary">Save draft</button>
            <button className="header-btn primary">Validate & send</button>
          </div>
        </div>

        {/* Workflow Notice */}
        <div className="workflow-notice">
          <div className="notice-title">
            <strong>Workflow guardrail</strong>
          </div>
          <div className="notice-text">
            Mandatory fields must validate before submit. After submission, the request stays editable for 1 hour. Once OSL Operations approves it, the request locks and only stock release can proceed.
          </div>
        </div>

        {/* Request Status */}
        <div className="request-status-section">
          <h3 className="section-heading">Request status</h3>
          <div className="status-info">
            <div className="status-ref">Order #OR-24-001</div>
            <div className="status-pills">
              <span className="status-pill draft">Draft validated</span>
              <span className="status-pill window">1h adjustment window</span>
              <span className="status-pill pending">Awaiting OSL review</span>
            </div>
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="checkout-summary-section">
          <h3 className="section-heading">Checkout summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Cart items</span>
              <span className="summary-value">1 line</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Units</span>
              <span className="summary-value">2</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Estimated value</span>
              <span className="summary-value">$310</span>
            </div>
            <div className="summary-item total">
              <span className="summary-label">Route</span>
              <span className="summary-value">Order Request → OSL Operations</span>
            </div>
          </div>
        </div>

        {/* WHO Form Grid */}
        <div className="who-form-grid">
          <div className="form-row">
            <div className="form-cell yellow">
              <label className="form-label">From (initiator):</label>
              <input className="form-input" defaultValue="OSL Emergency Response Unit" />
            </div>
            <div className="form-cell label">
              <label className="form-label">Mode of shipment:</label>
              <input className="form-input" defaultValue="Air freight" />
            </div>
            <div className="form-cell blue">
              <label className="form-label">PTEAO</label>
              <input className="form-input" placeholder="Enter PTEAO" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-cell yellow">
              <label className="form-label">Consignee address:</label>
              <textarea className="form-textarea" defaultValue={`World Health Organization
Office of the WHO Representative
Kenya Response Desk`} />
            </div>
            <div className="form-cell label">
              <label className="form-label">Nb of lines:</label>
              <div className="form-value">1</div>
            </div>
            <div className="form-cell blue">
              <label className="form-label">Estimated total cost:</label>
              <div className="form-value">USD 310.00</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-cell gray">
              <label className="form-label">To (processing unit):</label>
              <div className="form-value">OSL Operations Desk</div>
            </div>
            <div className="form-cell label">
              <label className="form-label">Estimated goods cost:</label>
              <div className="form-value">USD 298.00</div>
            </div>
            <div className="form-cell blue">
              <label className="form-label">Requester ref:</label>
              <input className="form-input" defaultValue="REQ-EM-001" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-cell">
              <label className="form-label">Notify party:</label>
              <textarea className="form-textarea" defaultValue={`osl.emergency@who.int
ava.lewis@who.int
wro.logistics@who.int`} />
            </div>
            <div className="form-cell label">
              <label className="form-label">Requested ready on:</label>
              <input className="form-input" defaultValue="05-Aug-26" />
            </div>
            <div className="form-cell blue">
              <label className="form-label">Confirmed ready date:</label>
              <div className="form-value">Pending OSL</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-cell">
              <label className="form-label">Shipping dimensions:</label>
              <textarea className="form-textarea" defaultValue="Auto-generated from selected item and quantity." />
            </div>
            <div className="form-cell label">
              <label className="form-label">Estimated weight (kg):</label>
              <div className="form-value">24</div>
            </div>
            <div className="form-cell blue">
              <label className="form-label">Confirmed weight:</label>
              <div className="form-value">Pending OSL</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-cell">
              <label className="form-label">Remarks:</label>
              <textarea className="form-textarea" defaultValue="Draft created from checkout. Awaiting requester validation and submit." />
            </div>
            <div className="form-cell label">
              <label className="form-label">Estimated volume (cbm):</label>
              <div className="form-value">0.8</div>
            </div>
            <div className="form-cell blue">
              <label className="form-label">Confirmed volume:</label>
              <div className="form-value">Pending OSL</div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h3 className="section-heading">Order request line items</h3>
          <div className="items-table-container">
            <table className="items-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>WHO code</th>
                  <th>WHO description</th>
                  <th>UoM</th>
                  <th>Quantity</th>
                  <th>Unit price USD</th>
                  <th>Total amount</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>ERK-204</td>
                  <td>Emergency Response Kit</td>
                  <td>kit</td>
                  <td>2</td>
                  <td>149.00</td>
                  <td>298.00</td>
                  <td>checkout populated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mini KPI Grid */}
        <div className="mini-kpi-grid">
          <div className="mini-kpi">
            <span className="kpi-label">Cart lines</span>
            <span className="kpi-value">1</span>
          </div>
          <div className="mini-kpi">
            <span className="kpi-label">Editable until</span>
            <span className="kpi-value">01:00:00</span>
          </div>
          <div className="mini-kpi">
            <span className="kpi-label">Current state</span>
            <span className="kpi-value">Draft</span>
          </div>
        </div>

        {/* WHO Sign-off */}
        <div className="who-signoff-section">
          <div className="signoff-labels">
            <span className="signoff-label">In charge of supply</span>
            <span className="signoff-label">Reviewer</span>
            <span className="signoff-label">Approver</span>
          </div>
          <div className="signoff-lines">
            <div className="signoff-line"></div>
            <div className="signoff-line"></div>
            <div className="signoff-line"></div>
          </div>
        </div>

        {/* Navigation */}
        <div className="form-navigation">
          <button className="nav-btn">Back to dashboard</button>
          <button className="nav-btn">Open requests</button>
          <button className="nav-btn primary">Add more products</button>
        </div>
      </div>

      {/* Modals */}
      {showCoordinator && selected && (
        <CoordinatorPanel
          orderId={selected.id}
          onClose={() => setShowCoordinator(false)}
        />
      )}

      {showSourcingModal && selected && (
        <SourcingOptionsModal
          isOpen={showSourcingModal}
          onClose={() => setShowSourcingModal(false)}
          orderId={selected.id}
          orderNumber={selected.ref || selected.id}
          options={[]} // Would be populated from API
          onResponse={() => setShowSourcingModal(false)}
        />
      )}
    </div>
  );
};

export default OrdersView;
