/**
 * Country Decision Rules & Permissions
 * Defines what countries can see/do at each order state
 */

import { OrderState } from './order-state-machine.v2';

export interface CountryPermission {
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
}

export interface CountryProfile {
  iso3: string;
  name: string;
  region: string;
  assignedHub: 'NBI' | 'DKR';
  transportLiabilityDefault: string;
  permissions: Record<OrderState, CountryPermission>;
  defaultCurrency: 'USD' | 'local';
  approvalRequiredForStates: OrderState[];
  autoAcceptLowValueOptions: boolean; // auto-accept if total < threshold
  lowValueThresholdUsd: number;
}

export const COUNTRY_PERMISSIONS_MATRIX: Record<OrderState, CountryPermission> = {
  draft: {
    canView: true,
    canEdit: true,
    canCancel: true,
    canRespondToOptions: false,
    canAddAttachments: true,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd'],
    hiddenFields: [],
    readOnlyFields: [],
  },

  submitted: {
    canView: true,
    canEdit: false,
    canCancel: true,
    canRespondToOptions: false,
    canAddAttachments: true,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd'],
    hiddenFields: [],
    readOnlyFields: ['order_number', 'pteao', 'lines'],
  },

  coordination_exception: {
    canView: true,
    canEdit: true,
    canCancel: true,
    canRespondToOptions: false,
    canAddAttachments: true,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd', 'exceptions'],
    hiddenFields: [],
    readOnlyFields: ['order_number', 'pteao', 'lines'],
    requiredActions: ['Resolve exceptions to proceed'],
  },

  awaiting_country_decision: {
    canView: true,
    canEdit: false,
    canCancel: true,
    canRespondToOptions: true,
    canAddAttachments: true,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd', 'sourcing_options'],
    hiddenFields: [],
    readOnlyFields: ['order_number', 'pteao', 'lines', 'sourcing_options'],
    requiredActions: ['Accept or reject sourcing options'],
  },

  routed_to_nbi: {
    canView: true,
    canEdit: false,
    canCancel: false,
    canRespondToOptions: false,
    canAddAttachments: true,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd', 'routed_to_hub'],
    hiddenFields: ['internal_flags', 'coordinator_notes'],
    readOnlyFields: ['order_number', 'pteao', 'lines', 'routed_to_hub'],
  },

  routed_to_dkr: {
    canView: true,
    canEdit: false,
    canCancel: false,
    canRespondToOptions: false,
    canAddAttachments: true,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd', 'routed_to_hub'],
    hiddenFields: ['internal_flags', 'coordinator_notes'],
    readOnlyFields: ['order_number', 'pteao', 'lines', 'routed_to_hub'],
  },

  sr_generated: {
    canView: true,
    canEdit: false,
    canCancel: false,
    canRespondToOptions: false,
    canAddAttachments: false,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd', 'sr_nbi_generated', 'sr_dkr_generated'],
    hiddenFields: ['internal_flags', 'coordinator_notes'],
    readOnlyFields: ['order_number', 'pteao', 'lines', 'sr_nbi_generated', 'sr_dkr_generated'],
  },

  under_osl_review: {
    canView: true,
    canEdit: false,
    canCancel: false,
    canRespondToOptions: false,
    canAddAttachments: false,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd'],
    hiddenFields: ['internal_flags', 'coordinator_notes', 'warehouse_notes'],
    readOnlyFields: ['order_number', 'pteao', 'lines'],
  },

  stock_reserved: {
    canView: true,
    canEdit: false,
    canCancel: false,
    canRespondToOptions: false,
    canAddAttachments: false,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd'],
    hiddenFields: ['internal_flags', 'coordinator_notes', 'warehouse_notes'],
    readOnlyFields: ['order_number', 'pteao', 'lines'],
  },

  stock_released: {
    canView: true,
    canEdit: false,
    canCancel: false,
    canRespondToOptions: false,
    canAddAttachments: false,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd'],
    hiddenFields: ['internal_flags', 'coordinator_notes', 'warehouse_notes'],
    readOnlyFields: ['order_number', 'pteao', 'lines'],
  },

  dispatched: {
    canView: true,
    canEdit: false,
    canCancel: false,
    canRespondToOptions: false,
    canAddAttachments: false,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd', 'carrier', 'awb_number'],
    hiddenFields: ['internal_flags', 'coordinator_notes', 'warehouse_notes'],
    readOnlyFields: ['order_number', 'pteao', 'lines', 'carrier', 'awb_number'],
  },

  delivered: {
    canView: true,
    canEdit: false,
    canCancel: false,
    canRespondToOptions: false,
    canAddAttachments: false,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd', 'carrier', 'awb_number'],
    hiddenFields: ['internal_flags', 'coordinator_notes', 'warehouse_notes'],
    readOnlyFields: ['order_number', 'pteao', 'lines', 'carrier', 'awb_number'],
  },

  cancelled: {
    canView: true,
    canEdit: false,
    canCancel: false,
    canRespondToOptions: false,
    canAddAttachments: false,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd', 'hold_reason', 'rejection_reason'],
    hiddenFields: ['internal_flags', 'coordinator_notes', 'warehouse_notes'],
    readOnlyFields: ['order_number', 'pteao', 'lines', 'hold_reason', 'rejection_reason'],
  },

  rejected: {
    canView: true,
    canEdit: false,
    canCancel: false,
    canRespondToOptions: false,
    canAddAttachments: false,
    canComment: true,
    visibleFields: ['order_number', 'pteao', 'consignee', 'notify_party', 'ready_date', 'lines', 'total_estimated_cost_usd', 'hold_reason', 'rejection_reason'],
    hiddenFields: ['internal_flags', 'coordinator_notes', 'warehouse_notes'],
    readOnlyFields: ['order_number', 'pteao', 'lines', 'hold_reason', 'rejection_reason'],
  },
};

// COUNTRY PROFILES (demo: 5 countries)
export const DEMO_COUNTRY_PROFILES: CountryProfile[] = [
  {
    iso3: 'NGA',
    name: 'Nigeria',
    region: 'West Africa',
    assignedHub: 'DKR',
    transportLiabilityDefault: 'USD 120',
    permissions: COUNTRY_PERMISSIONS_MATRIX,
    defaultCurrency: 'USD',
    approvalRequiredForStates: ['awaiting_country_decision'],
    autoAcceptLowValueOptions: true,
    lowValueThresholdUsd: 5000,
  },
  {
    iso3: 'KEN',
    name: 'Kenya',
    region: 'East Africa',
    assignedHub: 'NBI',
    transportLiabilityDefault: 'USD 95',
    permissions: COUNTRY_PERMISSIONS_MATRIX,
    defaultCurrency: 'USD',
    approvalRequiredForStates: ['awaiting_country_decision'],
    autoAcceptLowValueOptions: false,
    lowValueThresholdUsd: 2000,
  },
  {
    iso3: 'GHA',
    name: 'Ghana',
    region: 'West Africa',
    assignedHub: 'DKR',
    transportLiabilityDefault: 'USD 85',
    permissions: COUNTRY_PERMISSIONS_MATRIX,
    defaultCurrency: 'USD',
    approvalRequiredForStates: ['awaiting_country_decision'],
    autoAcceptLowValueOptions: true,
    lowValueThresholdUsd: 3500,
  },
  {
    iso3: 'ETH',
    name: 'Ethiopia',
    region: 'East Africa',
    assignedHub: 'NBI',
    transportLiabilityDefault: 'USD 110',
    permissions: COUNTRY_PERMISSIONS_MATRIX,
    defaultCurrency: 'USD',
    approvalRequiredForStates: ['awaiting_country_decision'],
    autoAcceptLowValueOptions: false,
    lowValueThresholdUsd: 2500,
  },
  {
    iso3: 'ZAF',
    name: 'South Africa',
    region: 'Southern Africa',
    assignedHub: 'DKR',
    transportLiabilityDefault: 'USD 130',
    permissions: COUNTRY_PERMISSIONS_MATRIX,
    defaultCurrency: 'USD',
    approvalRequiredForStates: ['awaiting_country_decision'],
    autoAcceptLowValueOptions: false,
    lowValueThresholdUsd: 8000,
  },
];

// PERMISSION ENGINE
export class CountryPermissionsEngine {
  static getProfile(iso3: string): CountryProfile | undefined {
    return DEMO_COUNTRY_PROFILES.find(c => c.iso3 === iso3);
  }

  static canView(iso3: string, state: OrderState): boolean {
    const profile = this.getProfile(iso3);
    return profile?.permissions[state]?.canView ?? false;
  }

  static canEdit(iso3: string, state: OrderState): boolean {
    const profile = this.getProfile(iso3);
    return profile?.permissions[state]?.canEdit ?? false;
  }

  static canCancel(iso3: string, state: OrderState): boolean {
    const profile = this.getProfile(iso3);
    return profile?.permissions[state]?.canCancel ?? false;
  }

  static canRespondToOptions(iso3: string, state: OrderState): boolean {
    const profile = this.getProfile(iso3);
    return profile?.permissions[state]?.canRespondToOptions ?? false;
  }

  static getVisibleFields(iso3: string, state: OrderState): string[] {
    const profile = this.getProfile(iso3);
    return profile?.permissions[state]?.visibleFields ?? [];
  }

  static getRequiredActions(iso3: string, state: OrderState): string[] {
    const profile = this.getProfile(iso3);
    return profile?.permissions[state]?.requiredActions ?? [];
  }

  static shouldAutoAcceptOption(iso3: string, optionTotalUsd: number): boolean {
    const profile = this.getProfile(iso3);
    if (!profile?.autoAcceptLowValueOptions) return false;
    return optionTotalUsd <= profile.lowValueThresholdUsd;
  }
}
