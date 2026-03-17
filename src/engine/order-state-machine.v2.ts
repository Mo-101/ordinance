/**
 * HCOMS Order State Machine v2
 * Core state transition logic, guards, SLAs, and notifications
 */

export type OrderState = 
  | 'draft'
  | 'submitted'
  | 'coordination_exception'
  | 'awaiting_country_decision'
  | 'routed_to_nbi'
  | 'routed_to_dkr'
  | 'sr_generated'
  | 'under_osl_review'
  | 'stock_reserved'
  | 'stock_released'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

export type ExceptionType = 'coordination' | 'osl';

export interface StateTransition {
  from: OrderState;
  to: OrderState;
  actor: 'country' | 'coordinator' | 'osl_ops' | 'warehouse' | 'system';
  reason?: string;
  timestamp: Date;
}

export interface OrderException {
  id: string;
  orderId: string;
  type: ExceptionType;
  fieldKey?: string;
  fieldLabel?: string;
  issueType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiredAction: string;
  comment?: string;
  raisedBy: string;
  raisedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
  requesterResponse?: string;
  revisionNo: number;
}

export interface SlaTimer {
  id: string;
  orderId: string;
  stage: 'submission' | 'coordination' | 'osl_review' | 'stock_reservation' | 'dispatch' | 'delivery';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startedAt: Date;
  deadlineAt: Date;
  breached: boolean;
  breachedAt?: Date;
  escalated: boolean;
}

export interface NotificationEvent {
  id: string;
  orderId?: string;
  event: string;
  recipientType: 'country' | 'coordinator' | 'osl_ops' | 'warehouse' | 'chief' | 'system';
  recipientUserId?: string;
  channel: 'in_app' | 'email' | 'sms' | 'webhook';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  body: string;
  inAppLabel?: string;
  sentAt?: Date;
  readAt?: Date;
  delivered: boolean;
}

// STATE LABELS FOR UI
export const COUNTRY_STATUS_LABELS: Record<OrderState, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  coordination_exception: 'Coordination Exception',
  awaiting_country_decision: 'Awaiting Your Decision',
  routed_to_nbi: 'Routed to Nairobi',
  routed_to_dkr: 'Routed to Dakar',
  sr_generated: 'Stock Requisition Generated',
  under_osl_review: 'Under OSL Review',
  stock_reserved: 'Stock Reserved',
  stock_released: 'Stock Released',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

export const OSL_STATUS_LABELS: Record<OrderState, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  coordination_exception: 'Coordination Exception',
  awaiting_country_decision: 'Awaiting Country Decision',
  routed_to_nbi: 'Routed to NBI',
  routed_to_dkr: 'Routed to DKR',
  sr_generated: 'SR Generated',
  under_osl_review: 'Under Review',
  stock_reserved: 'Stock Reserved',
  stock_released: 'Stock Released',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

// STATE TRANSITION MATRIX
export const STATE_TRANSITIONS: Record<OrderState, OrderState[]> = {
  draft: ['submitted', 'cancelled'],
  submitted: ['coordination_exception', 'awaiting_country_decision', 'cancelled', 'rejected'],
  coordination_exception: ['submitted', 'awaiting_country_decision', 'cancelled', 'rejected'],
  awaiting_country_decision: ['routed_to_nbi', 'routed_to_dkr', 'cancelled', 'rejected'],
  routed_to_nbi: ['sr_generated', 'cancelled', 'rejected'],
  routed_to_dkr: ['sr_generated', 'cancelled', 'rejected'],
  sr_generated: ['under_osl_review', 'cancelled', 'rejected'],
  under_osl_review: ['stock_reserved', 'stock_released', 'cancelled', 'rejected'],
  stock_reserved: ['stock_released', 'dispatched', 'cancelled'],
  stock_released: ['dispatched', 'cancelled'],
  dispatched: ['delivered'],
  delivered: [],
  cancelled: [],
  rejected: [],
};

// GUARDS: WHO CAN TRANSITION WHERE
export function canTransition(from: OrderState, to: OrderState, actor: string): boolean {
  const allowed = STATE_TRANSITIONS[from]?.includes(to);
  if (!allowed) return false;

  // Country users
  if (actor === 'country') {
    return ['draft', 'submitted', 'coordination_exception', 'awaiting_country_decision'].includes(from) &&
           ['submitted', 'cancelled', 'routed_to_nbi', 'routed_to_dkr'].includes(to);
  }

  // Coordinators
  if (actor === 'coordinator') {
    return ['submitted', 'coordination_exception'].includes(from) &&
           ['awaiting_country_decision', 'cancelled', 'rejected'].includes(to);
  }

  // OSL Ops
  if (actor === 'osl_ops') {
    return ['sr_generated', 'under_osl_review', 'stock_reserved', 'stock_released'].includes(from) &&
           ['under_osl_review', 'stock_reserved', 'stock_released', 'dispatched', 'cancelled'].includes(to);
  }

  // Warehouse
  if (actor === 'warehouse') {
    return ['stock_reserved'].includes(from) && ['stock_released'].includes(to);
  }

  // System can do anything allowed by matrix
  return actor === 'system';
}

// SLA DEADLINES (hours from stage start)
export const SLA_DEADLINES_HOURS: Record<string, Record<string, number>> = {
  submission: { low: 72, medium: 48, high: 24, urgent: 12 },
  coordination: { low: 48, medium: 36, high: 24, urgent: 12 },
  osl_review: { low: 48, medium: 36, high: 24, urgent: 12 },
  stock_reservation: { low: 24, medium: 18, high: 12, urgent: 6 },
  dispatch: { low: 72, medium: 48, high: 24, urgent: 12 },
  delivery: { low: 168, medium: 120, high: 72, urgent: 48 },
};

// NOTIFICATION MATRIX
export function generateNotifications(
  event: string,
  orderId: string,
  actors: { country?: string; coordinator?: string; osl_ops?: string; warehouse?: string }
): NotificationEvent[] {
  const base = { orderId, event, delivered: false };

  switch (event) {
    case 'ORDER_CREATED':
      return [
        { ...base, id: crypto.randomUUID(), recipientType: 'country', recipientUserId: actors.country, channel: 'in_app', urgency: 'low', subject: 'Draft order created', body: 'Your draft order has been saved.', inAppLabel: 'Draft saved' },
      ];

    case 'ORDER_SUBMITTED':
      return [
        { ...base, id: crypto.randomUUID(), recipientType: 'coordinator', recipientUserId: actors.coordinator, channel: 'in_app', urgency: 'medium', subject: 'New order submitted', body: `Order ${orderId} requires coordination review.`, inAppLabel: 'New submission' },
        { ...base, id: crypto.randomUUID(), recipientType: 'country', recipientUserId: actors.country, channel: 'in_app', urgency: 'low', subject: 'Order submitted', body: 'Your order has been submitted for coordination.', inAppLabel: 'Submitted' },
      ];

    case 'COORDINATION_EXCEPTION':
      return [
        { ...base, id: crypto.randomUUID(), recipientType: 'country', recipientUserId: actors.country, channel: 'in_app', urgency: 'high', subject: 'Coordination exception raised', body: 'Your order has exceptions that need your attention.', inAppLabel: 'Action required' },
      ];

    case 'COUNTRY_ACCEPTED_OPTION':
      return [
        { ...base, id: crypto.randomUUID(), recipientType: 'osl_ops', recipientUserId: actors.osl_ops, channel: 'in_app', urgency: 'medium', subject: 'Country accepted option', body: `Country accepted sourcing option for ${orderId}.`, inAppLabel: 'Option accepted' },
      ];

    case 'SR_GENERATED':
      return [
        { ...base, id: crypto.randomUUID(), recipientType: 'osl_ops', recipientUserId: actors.osl_ops, channel: 'in_app', urgency: 'medium', subject: 'Stock Requisition generated', body: `SR generated for ${orderId}.`, inAppLabel: 'SR generated' },
      ];

    case 'STOCK_RESERVED':
      return [
        { ...base, id: crypto.randomUUID(), recipientType: 'country', recipientUserId: actors.country, channel: 'in_app', urgency: 'low', subject: 'Stock reserved', body: 'Stock has been reserved for your order.', inAppLabel: 'Stock reserved' },
        { ...base, id: crypto.randomUUID(), recipientType: 'warehouse', recipientUserId: actors.warehouse, channel: 'in_app', urgency: 'medium', subject: 'Stock reservation', body: `Stock reserved for ${orderId}.`, inAppLabel: 'Reserve stock' },
      ];

    case 'DISPATCHED':
      return [
        { ...base, id: crypto.randomUUID(), recipientType: 'country', recipientUserId: actors.country, channel: 'in_app', urgency: 'low', subject: 'Order dispatched', body: 'Your order has been dispatched.', inAppLabel: 'Dispatched' },
      ];

    case 'DELIVERED':
      return [
        { ...base, id: crypto.randomUUID(), recipientType: 'country', recipientUserId: actors.country, channel: 'in_app', urgency: 'low', subject: 'Order delivered', body: 'Your order has been delivered successfully.', inAppLabel: 'Delivered' },
      ];

    default:
      return [];
  }
}

// STATE MACHINE ENGINE
export class OrderStateMachine {
  static transition(
    current: OrderState,
    target: OrderState,
    actor: string,
    reason?: string
  ): StateTransition {
    if (!canTransition(current, target, actor)) {
      throw new Error(`Transition not allowed: ${current} → ${target} by ${actor}`);
    }

    return {
      from: current,
      to: target,
      actor: actor as any,
      reason,
      timestamp: new Date(),
    };
  }

  static startSla(orderId: string, stage: SlaTimer['stage'], priority: SlaTimer['priority']): SlaTimer {
    const hours = SLA_DEADLINES_HOURS[stage]?.[priority] ?? 48;
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + hours);

    return {
      id: crypto.randomUUID(),
      orderId,
      stage,
      priority,
      startedAt: new Date(),
      deadlineAt: deadline,
      breached: false,
      escalated: false,
    };
  }

  static raiseException(
    orderId: string,
    type: ExceptionType,
    fieldKey: string | undefined,
    fieldLabel: string | undefined,
    issueType: string,
    severity: OrderException['severity'],
    requiredAction: string,
    comment: string | undefined,
    raisedBy: string
  ): OrderException {
    return {
      id: crypto.randomUUID(),
      orderId,
      type,
      fieldKey,
      fieldLabel,
      issueType,
      severity,
      requiredAction,
      comment,
      raisedBy,
      raisedAt: new Date(),
      resolved: false,
      revisionNo: 1,
    };
  }
}
