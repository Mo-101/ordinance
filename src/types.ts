export type OrderStatus = 'draft' | 'submitted' | 'approved' | 'completed' | 'flagged' | 'shipped' | 'forwarded to osl';

// HCOMS Engine Types
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
export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'webhook';
export type NotificationRecipientType = 'country' | 'coordinator' | 'osl_ops' | 'warehouse' | 'chief' | 'system';
export type SlaStage = 'submission' | 'coordination' | 'osl_review' | 'stock_reservation' | 'dispatch' | 'delivery';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

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
  stage: SlaStage;
  priority: PriorityLevel;
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
  recipientType: NotificationRecipientType;
  recipientUserId?: string;
  channel: NotificationChannel;
  urgency: PriorityLevel;
  subject: string;
  body: string;
  inAppLabel?: string;
  sentAt?: Date;
  readAt?: Date;
  delivered: boolean;
}

export interface SourcingOption {
  id: string;
  orderId: string;
  optionNumber: number;
  negotiationCycle: number;
  sourcingMode: 'direct' | 'consolidated' | 'split' | 'backorder';
  primaryHub: 'NBI' | 'DKR';
  secondaryHub?: 'NBI' | 'DKR';
  goodsCostUsd: number;
  transportCostUsd: number;
  totalEstimatedCostUsd: number;
  countryTransportLiability: string;
  paymentTermsNote: string;
  estimatedDeliveryDays: number;
  coverageConfidence: 'high' | 'medium' | 'low';
  coordinatorSummary: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'expired';
  proposedBy: string;
  proposedAt: Date;
  respondedAt?: Date;
  respondedBy?: string;
  rejectionReason?: string;
  internalFlags: Record<string, any>;
  lines: SourcingOptionLine[];
}

export interface SourcingOptionLine {
  id: string;
  optionId: string;
  lineId: string;
  skuCode: string;
  requestedQty: number;
  proposedQty: number;
  backorderQty: number;
  sourceHub: 'NBI' | 'DKR';
  fulfillmentType: 'full' | 'partial' | 'backorder';
  fefoLotReference?: string;
  etaDays: number;
  unitCostUsd: number;
  lineGoodsCostUsd: number;
}

export interface CountryOptionResponse {
  id: string;
  orderId: string;
  optionId: string;
  response: 'accept' | 'reject' | 'request_alternative';
  respondedBy: string;
  respondedAt: Date;
  rejectionReason?: string;
  alternativeRequestNotes?: string;
  acceptedTransportCost?: number;
}

export interface InventoryLot {
  id: string;
  warehouseId: string;
  skuCode: string;
  lotNumber: string;
  expiryDate: Date;
  physicalQty: number;
  reservedQty: number;
  quarantineQty: number;
  unitCostUsd: number;
  createdAt: Date;
}

export interface CountryProfile {
  iso3: string;
  name: string;
  region: string;
  assignedHub: 'NBI' | 'DKR';
  transportLiabilityDefault: string;
  permissions: Record<OrderState, {
    canView: boolean;
    canEdit: boolean;
    canCancel: boolean;
    canRespondToOptions: boolean;
    canAddAttachments: boolean;
    canComment: boolean;
    visibleFields: string[];
    hiddenFields: string[];
    readOnlyFields: string[];
    requiredActions?: string[];
  }>;
  defaultCurrency: 'USD' | 'local';
  approvalRequiredForStates: OrderState[];
  autoAcceptLowValueOptions: boolean;
  lowValueThresholdUsd: number;
}

export interface InventoryAssessment {
  skuCode: string;
  totalRequested: number;
  availableByHub: {
    hub: 'NBI' | 'DKR';
    availableQty: number;
  }[];
  shortageQty: number;
  canCoverFully: boolean;
  recommendedSourcing: {
    mode: SourcingOption['sourcingMode'];
    primaryHub: 'NBI' | 'DKR';
    secondaryHub?: 'NBI' | 'DKR';
    reason: string;
  };
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryLabel: string;
  price: number;
  stock: number;
  stockCount: number;
  useCase: string;
  shelfLife: string;
  shape: 'kit' | 'mask' | 'glove';
  description: string;
  usage: string;
  dosage: string;
  included: string;
  storage: string;
  list: string[];
  image: string;
  contents: string[];
  weight: string;
  dimensions: string;
  features: string[];
}

export interface Order {
  id: string;
  ref: string;
  name: string;
  address: string;
  date: string;
  value: number;
  status: OrderStatus;
  initiator: string;
  shipmentMode: string;
  pteao: string;
  consignee: string;
  notify: string;
  readyDate: string;
  weight: number;
  volume: number;
  remarks: string;
  createdAt?: number;
  items: { product: Product, qty: number }[];
}
