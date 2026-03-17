const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminAPI = {
  getUsers: async (params: any) => {
    await mockDelay(500);
    return {
      success: true,
      data: {
        users: [
          { id: 1, name: 'Admin User', email: 'admin@who.int', role: 'Super Admin', is_active: true, last_login: new Date().toISOString() },
          { id: 2, name: 'OSL User', email: 'osl@who.int', role: 'OSL Team', is_active: true, last_login: new Date().toISOString(), osl_admin_level: 0, warehouse_id: 1 },
          { id: 3, name: 'Lab User', email: 'lab@who.int', role: 'Laboratory Team', is_active: true, last_login: new Date().toISOString() },
          { id: 4, name: 'Nigeria User', email: 'nigeria@who.int', role: 'Country Office', is_active: true, last_login: new Date().toISOString(), country: 'Nigeria' },
        ],
        pagination: { page: 1, limit: 20, total: 4, totalPages: 1 }
      }
    };
  },
  getActivityLogs: async (params: any) => {
    await mockDelay(500);
    return {
      success: true,
      data: {
        logs: [
          { id: 1, created_at: new Date().toISOString(), user_name: 'Admin User', user_email: 'admin@who.int', action: 'login', details: { ip: '127.0.0.1' } },
        ],
        pagination: { page: 1, limit: 50, total: 1, totalPages: 1 }
      }
    };
  },
  getStats: async () => {
    await mockDelay(300);
    return {
      success: true,
      data: {
        stats: {
          total_users: 4,
          active_users: 4,
          country_office_users: 1,
          lab_users: 1,
          osl_users: 1,
          active_last_week: 4
        }
      }
    };
  },
  createUser: async (data: any) => {
    await mockDelay(500);
    return { success: true, data: { tempPassword: 'temp-password-123' } };
  },
  updateUser: async (id: any, data: any) => {
    await mockDelay(500);
    return { success: true };
  },
  resetPassword: async (id: any) => {
    await mockDelay(500);
    return { success: true, data: { tempPassword: 'new-temp-password-456' } };
  },
  deactivateUser: async (id: any) => {
    await mockDelay(500);
    return { success: true };
  },
  activateUser: async (id: any) => {
    await mockDelay(500);
    return { success: true };
  },
  deleteUser: async (id: any, data: any) => {
    await mockDelay(500);
    return { success: true };
  }
};

export const countriesAPI = {
  getAll: async () => {
    await mockDelay(300);
    return {
      success: true,
      data: {
        countries: [
          { id: 1, name: 'Nigeria' },
          { id: 2, name: 'Kenya' },
          { id: 3, name: 'Ghana' },
          { id: 4, name: 'South Africa' },
        ]
      }
    };
  }
};

export const warehouseAPI = {
  getAll: async () => {
    await mockDelay(300);
    return {
      success: true,
      data: {
        warehouses: [
          { id: 1, code: 'WH-01', name: 'Main Warehouse', location: 'Dubai, UAE', capacity_used: 65, staff_count: 24 },
          { id: 2, code: 'WH-02', name: 'Regional Hub', location: 'Accra, Ghana', capacity_used: 42, staff_count: 12 },
        ]
      }
    };
  },
  getInventory: async (id: number) => {
    await mockDelay(400);
    return {
      success: true,
      data: {
        inventory: [
          { sku: 'KIT-001', product_name: 'IEHK 2017 Basic Unit', quantity: 45, unit: 'kit', reorder_point: 50 },
          { sku: 'KIT-002', product_name: 'IEHK 2017 Supplementary', quantity: 12, unit: 'kit', reorder_point: 10 },
          { sku: 'PPE-001', product_name: 'N95 Respirator Mask', quantity: 2500, unit: 'box', reorder_point: 1000 },
          { sku: 'PPE-002', product_name: 'Nitrile Gloves', quantity: 800, unit: 'box', reorder_point: 1000 },
        ]
      }
    };
  }
};

// HCOMS Coordinator API
export const coordinatorAPI = {
  assessInventory: async (orderLines: { skuCode: string; requestedQty: number }[]) => {
    await mockDelay(800);
    return {
      success: true,
      data: {
        assessments: orderLines.map(line => ({
          skuCode: line.skuCode,
          totalRequested: line.requestedQty,
          availableByHub: [
            { hub: 'NBI', availableQty: Math.floor(Math.random() * 200) + 50 },
            { hub: 'DKR', availableQty: Math.floor(Math.random() * 150) + 30 },
          ],
          shortageQty: Math.max(0, line.requestedQty - 300),
          canCoverFully: line.requestedQty <= 300,
          recommendedSourcing: {
            mode: line.requestedQty <= 200 ? 'direct' : 'split',
            primaryHub: 'NBI',
            secondaryHub: line.requestedQty > 200 ? 'DKR' : undefined,
            reason: line.requestedQty <= 200 ? 'Full quantity available at NBI' : 'Split across hubs for full coverage',
          },
        })),
      },
    };
  },

  buildSourcingOptions: async (orderId: string, assessments: any[]) => {
    await mockDelay(1000);
    return {
      success: true,
      data: {
        options: [
          {
            id: crypto.randomUUID(),
            orderId,
            optionNumber: 1,
            negotiationCycle: 1,
            sourcingMode: 'direct',
            primaryHub: 'NBI',
            goodsCostUsd: 1250.00,
            transportCostUsd: 85.00,
            totalEstimatedCostUsd: 1335.00,
            countryTransportLiability: 'USD 95',
            paymentTermsNote: 'Standard WHO payment terms: 30 days net',
            estimatedDeliveryDays: 7,
            coverageConfidence: 'high',
            coordinatorSummary: 'Direct shipment from NBI with full availability.',
            status: 'proposed',
            proposedBy: 'coordinator',
            proposedAt: new Date(),
            internalFlags: {},
            lines: assessments.map(a => ({
              id: crypto.randomUUID(),
              optionId: '',
              lineId: crypto.randomUUID(),
              skuCode: a.skuCode,
              requestedQty: a.totalRequested,
              proposedQty: Math.min(a.totalRequested, 200),
              backorderQty: Math.max(0, a.totalRequested - 200),
              sourceHub: 'NBI',
              fulfillmentType: a.totalRequested <= 200 ? 'full' : 'partial',
              fefoLotReference: `LOT-${Date.now()}`,
              etaDays: 7,
              unitCostUsd: 25.50,
              lineGoodsCostUsd: 0,
            })),
          },
          {
            id: crypto.randomUUID(),
            orderId,
            optionNumber: 2,
            negotiationCycle: 1,
            sourcingMode: 'split',
            primaryHub: 'NBI',
            secondaryHub: 'DKR',
            goodsCostUsd: 1180.00,
            transportCostUsd: 120.00,
            totalEstimatedCostUsd: 1300.00,
            countryTransportLiability: 'USD 95',
            paymentTermsNote: 'Standard WHO payment terms: 30 days net',
            estimatedDeliveryDays: 10,
            coverageConfidence: 'medium',
            coordinatorSummary: 'Split shipment across NBI and DKR to maximize availability.',
            status: 'proposed',
            proposedBy: 'coordinator',
            proposedAt: new Date(),
            internalFlags: {},
            lines: assessments.map(a => ({
              id: crypto.randomUUID(),
              optionId: '',
              lineId: crypto.randomUUID(),
              skuCode: a.skuCode,
              requestedQty: a.totalRequested,
              proposedQty: a.totalRequested,
              backorderQty: 0,
              sourceHub: 'NBI',
              fulfillmentType: 'partial',
              fefoLotReference: `LOT-${Date.now()}-2`,
              etaDays: 10,
              unitCostUsd: 24.00,
              lineGoodsCostUsd: 0,
            })),
          },
        ],
      },
    };
  },

  routeOrder: async (orderId: string, optionId: string) => {
    await mockDelay(600);
    return {
      success: true,
      data: {
        routedToHub: 'NBI',
        routedAt: new Date(),
        nextSteps: ['Generate Stock Requisition', 'Reserve inventory', 'Prepare dispatch'],
      },
    };
  },
};

// HCOMS Orders API
export const ordersAPI = {
  respondToOption: async (orderId: string, optionId: string, response: 'accept' | 'reject' | 'request_alternative', data?: any) => {
    await mockDelay(500);
    return {
      success: true,
      data: {
        response,
        respondedAt: new Date(),
        nextStatus: response === 'accept' ? 'routed_to_nbi' : 'awaiting_country_decision',
        autoAccepted: data?.autoAccepted || false,
      },
    };
  },

  transition: async (orderId: string, toStatus: string, actor: string, reason?: string) => {
    await mockDelay(400);
    return {
      success: true,
      data: {
        fromStatus: 'submitted',
        toStatus,
        actor,
        reason,
        timestamp: new Date(),
        notificationsGenerated: ['country', 'coordinator'],
      },
    };
  },

  getExceptions: async (orderId: string) => {
    await mockDelay(300);
    return {
      success: true,
      data: {
        exceptions: [
          {
            id: crypto.randomUUID(),
            orderId,
            type: 'coordination',
            fieldKey: 'consignee',
            fieldLabel: 'Consignee',
            issueType: 'missing_info',
            severity: 'medium',
            requiredAction: 'Please provide consignee details',
            comment: 'Consignee field is required for international shipments',
            raisedBy: 'coordinator',
            raisedAt: new Date(),
            resolved: false,
            revisionNo: 1,
          },
        ],
      },
    };
  },

  resolveException: async (exceptionId: string, response: string) => {
    await mockDelay(300);
    return {
      success: true,
      data: {
        resolved: true,
        resolvedAt: new Date(),
        requesterResponse: response,
      },
    };
  },
};

// HCOMS Inventory API
export const inventoryAPI = {
  getLots: async (skuCode?: string, hub?: string) => {
    await mockDelay(400);
    return {
      success: true,
      data: {
        lots: [
          {
            id: crypto.randomUUID(),
            warehouseId: hub === 'DKR' ? 'wh-dkr-001' : 'wh-nbi-001',
            skuCode: skuCode || 'ERK-204',
            lotNumber: `LOT-${Date.now()}`,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            physicalQty: 150,
            reservedQty: 20,
            quarantineQty: 0,
            unitCostUsd: 149.00,
            createdAt: new Date(),
          },
        ],
      },
    };
  },

  reserveStock: async (orderId: string, reservations: { skuCode: string; qty: number; hub: string }[]) => {
    await mockDelay(600);
    return {
      success: true,
      data: {
        reservations: reservations.map(r => ({
          ...r,
          lotNumber: `LOT-${Date.now()}`,
          reservedAt: new Date(),
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        })),
      },
    };
  },

  releaseStock: async (orderId: string) => {
    await mockDelay(400);
    return {
      success: true,
      data: {
        releasedAt: new Date(),
        readyForDispatch: true,
      },
    };
  },
};

// HCOMS Country Profiles API
export const countryProfilesAPI = {
  getAll: async () => {
    await mockDelay(300);
    return {
      success: true,
      data: {
        profiles: [
          {
            iso3: 'NGA',
            name: 'Nigeria',
            region: 'West Africa',
            assignedHub: 'DKR',
            transportLiabilityDefault: 'USD 120',
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
            defaultCurrency: 'USD',
            approvalRequiredForStates: ['awaiting_country_decision'],
            autoAcceptLowValueOptions: true,
            lowValueThresholdUsd: 3500,
          },
        ],
      },
    };
  },

  getByIso3: async (iso3: string) => {
    await mockDelay(200);
    const all = await this.getAll();
    const profile = all.data.profiles.find((p: any) => p.iso3 === iso3);
    return {
      success: !!profile,
      data: { profile },
    };
  },
};
