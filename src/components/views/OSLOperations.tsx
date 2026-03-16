import { motion } from 'motion/react';
import './OSLOperations.css';
import { Order } from '../../types';


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

      <div className="card mb-16">
          <div className="card-title"><h3>OSL decision lane</h3><span className="subtle">Approve, clarify, release</span></div>
          <div className="decision-actions">
            <button className="link-btn" id="oslStartReviewBtn">Start review</button>
            <button className="link-btn" id="oslClarifyBtn">Send clarification pack</button>
            <button className="link-btn primary" id="oslApproveBtn">Approve request</button>
            <button className="ghost-btn" id="oslReleaseBtn">Release stock</button>
          </div>
          <div className="tiny-note mt-12">Best method: exception-only review with a structured clarification pack, not full rejection. Reviewer flags only the broken fields, requester amends only those fields, system preserves chain of custody, then approval locks the record.</div>
        </div>

        <div className="osl-grid">
          <div className="card osl-queue-table">
            <div className="card-title"><h3>Pending operations queue</h3><span className="subtle">Validated requests</span></div>
            <table>
              <thead><tr><th>Ref</th><th>Requester</th><th>Country</th><th>Status</th><th>Window</th><th>Action</th></tr></thead>
              <tbody>
                <tr className="selected"><td id="oslQueueRef">OR_24-001_Kenya</td><td id="oslQueueRequester">Ava Lewis</td><td>Kenya</td><td><span className="status"><span className="dot ready"></span>Ready for review</span></td><td id="oslQueueWindow">1h window</td><td><button className="link-btn primary" id="approveToStockBtn">Send to stock release</button></td></tr>
                <tr><td>OR_24-008_Uganda</td><td>Leah Morris</td><td>Uganda</td><td><span className="status"><span className="dot warn"></span>Adjustment window</span></td><td>18 min left</td><td><button className="link-btn">Monitor</button></td></tr>
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="card-title"><h3>Process timeline</h3><span className="subtle">Real-time flow</span></div>
            <div className="timeline single" id="oslTimeline">
              <div className="timeline-step done"><h4>Requester sent validated order</h4><p id="oslTimelineRef">OR_24-001_Kenya entered the OSL lane with complete mandatory fields.</p></div>
              <div className="timeline-step active"><h4>OSL review in progress</h4><p>Operations confirms requester ref, shipment method, consignee data, and item lines.</p></div>
              <div className="timeline-step"><h4>Approval & stock release</h4><p>Once approved, the stock release document is generated and request becomes locked.</p></div>
            </div>
            <div className="tiny-note mt-14">No send-back loop here. Clarifications stay inside ops review while request integrity is preserved.</div>
          </div>
        </div>

        <div className="who-form" id="stockReleaseForm">
          <div className="who-topline">
            <div className="who-logo">World Health Organization</div>
            <div className="who-title">Material stock release</div>
            <div className="who-ref" id="srRefTop">REF: SR_from_OR_24-001_Kenya</div>
       </div>

          <div className="who-grid">
            <div className="who-cell yellow"><b>From:</b><br /><span id="srFrom">AFRO Emergency Hub Nairobi, Sierra Leone Country Office</span></div>
            <div className="who-cell label right"><b>Mode of shipment:</b><br /><span id="srMode">Air freight</span></div>
            <div className="who-cell blue center"><b>Date</b><br /><span id="srDate">05-Aug-26</span></div>

            <div className="who-cell"><b>To / processing unit:</b><br />OSL warehouse release desk</div>
            <div className="who-cell label right"><b>Estimated weight (kg):</b><br /><span id="srWeight">24</span></div>
            <div className="who-cell blue"><b>Requested ref:</b><br /><span id="srRequesterRef">REQ-EM-001</span></div>

            <div className="who-cell"><b>Notify party:</b><br /><span id="srNotify">NBO hub dispatch, field logistics, warehouse control</span></div>
            <div className="who-cell label right"><b>Estimated volume (cbm):</b><br /><span id="srVolume">0.8</span></div>
            <div className="who-cell blue"><b>Conf. ready date:</b><br /><span id="srReadyDate">05-Aug-26</span></div>

            <div className="who-cell"><b>Shipping dimensions:</b><br /><span id="srDimensions">Release against approved OR_24-001. Item lines and quantity carried from approved order request.</span></div>
            <div className="who-cell label right"><b>Freight charges payable:</b><br />WHO</div>
            <div className="who-cell gray"><b>Shipping documents required:</b><br />packing list, release note, airway bill copy</div>
          </div>
          <div className="who-section-title">Released stock lines</div>
          <div className="who-items">
            <table>
              <thead>
                <tr><th>#</th><th>WHO code</th><th>WHO description</th><th>UoM</th><th>Qty</th><th>Batch</th><th>Expiry</th><th>Unit price</th><th>Total price</th><th>Comments</th></tr>
              </thead>
              <tbody id="stockReleaseBody">
                <tr><td>1</td><td>ERK-204</td><td>Emergency Response Kit</td><td>kit</td><td>2</td><td>EK-204-B1</td><td>2029-03</td><td>149.00</td><td>298.00</td><td>awaiting approval</td></tr>
              </tbody>
            </table>
          </div>
          <div className="who-signoff">
            <div className="who-sign"><span>In charge of supply</span></div>
            <div className="who-sign"><span>Control/regulatory</span></div>
            <div className="who-sign"><span>Approver</span></div>
          </div>
        </div>
    </motion.div>
  );
}

export default OSLOperations;
