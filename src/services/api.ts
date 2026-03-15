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
