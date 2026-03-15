import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminAPI, countriesAPI, warehouseAPI } from '../services/api';
import { formatDateTime } from '../utils/helpers';
import WarehouseManagement from './WarehouseManagement';
import ClearOrdersModal from './modals/ClearOrdersModal';
import Loading from './Loading';
import '../styles/AdminView.css';

// OSL Admin Level labels
const OSL_LEVELS = [
  { value: 0, label: 'Level 0 - Super Admin (Full privileges)' },
  { value: 1, label: 'Level 1 - Admin (No fulfillment qty adjust)' },
  { value: 2, label: 'Level 2 - Viewer (View & download only)' }
];

function AdminView() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [logPagination, setLogPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearOrdersModal, setShowClearOrdersModal] = useState(false);
  const [clearOrdersMode, setClearOrdersMode] = useState<'country' | 'all'>('country');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [newUser, setNewUser] = useState({ email: '', name: '', role: '', country: '', oslAdminLevel: 0, warehouseId: '' });

  // Fetch users
  const fetchUsers = async (page = 1, overrides: any = {}) => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getUsers({
        search: overrides.search !== undefined ? overrides.search : (searchTerm || undefined),
        role: overrides.role !== undefined ? overrides.role : (roleFilter || undefined),
        isActive: overrides.isActive !== undefined ? overrides.isActive : (statusFilter === '' ? undefined : statusFilter === 'active'),
        page,
        limit: pagination.limit
      });
      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch activity logs
  const fetchActivityLogs = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getActivityLogs({ page, limit: logPagination.limit });
      if (response.success) {
        setActivityLogs(response.data.logs);
        setLogPagination(response.data.pagination);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch activity logs');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      if (response.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await countriesAPI.getAll();
      if (response.success) {
        setCountries(response.data.countries);
      }
    } catch (err) {
      console.error('Failed to fetch countries:', err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await warehouseAPI.getAll();
      if (response.success) {
        setWarehouses(response.data.warehouses);
      }
    } catch (err) {
      console.error('Failed to fetch warehouses:', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchCountries();
    fetchWarehouses();
  }, []);

  // Fetch when tab changes
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'activity') {
      fetchActivityLogs();
    }
  }, [activeTab]);

  // Handle search
  const handleSearch = () => {
    fetchUsers(1);
  };

  // Handle create user
  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.role) {
      toast.error('Email, name, and role are required');
      return;
    }

    if (newUser.role === 'Country Office' && !newUser.country) {
      toast.error('Country is required for Country Office users');
      return;
    }

    if (newUser.role === 'OSL Team' && !newUser.warehouseId) {
      toast.error('Warehouse is required for OSL Team users');
      return;
    }

    try {
      const userData: any = {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        country: newUser.country
      };

      if (newUser.role === 'OSL Team') {
        userData.oslAdminLevel = parseInt(newUser.oslAdminLevel.toString()) || 0;
        userData.warehouseId = parseInt(newUser.warehouseId);
      }

      const response = await adminAPI.createUser(userData);
      if (response.success) {
        toast.success(`User created! Temp password: ${response.data.tempPassword}`, { duration: 10000 });
        setShowCreateModal(false);
        setNewUser({ email: '', name: '', role: '', country: '', oslAdminLevel: 0, warehouseId: '' });
        fetchUsers();
        fetchStats();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create user');
    }
  };

  // Handle update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const userData: any = {
        name: selectedUser.name,
        role: selectedUser.role,
        country: selectedUser.country,
        isActive: selectedUser.is_active
      };

      if (selectedUser.role === 'OSL Team') {
        userData.oslAdminLevel = parseInt(selectedUser.osl_admin_level?.toString() || '0');
        userData.warehouseId = selectedUser.warehouse_id ? parseInt(selectedUser.warehouse_id.toString()) : null;
      }

      const response = await adminAPI.updateUser(selectedUser.id, userData);
      if (response.success) {
        toast.success('User updated successfully');
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user');
    }
  };

  // Handle reset password
  const handleResetPassword = async (userId: any) => {
    if (!window.confirm('Reset password for this user? They will receive an email with a temporary password.')) {
      return;
    }

    try {
      const response = await adminAPI.resetPassword(userId);
      if (response.success) {
        toast.success(`Password reset! New temp password: ${response.data.tempPassword}`, { duration: 10000 });
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    }
  };

  // Handle toggle user status
  const handleToggleStatus = async (user: any) => {
    const action = user.is_active ? 'deactivate' : 'activate';
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} this user?`)) {
      return;
    }

    try {
      if (user.is_active) {
        await adminAPI.deactivateUser(user.id);
      } else {
        await adminAPI.activateUser(user.id);
      }
      toast.success(`User ${action}d successfully`);
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} user`);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!deletePassword) {
      toast.error('Password confirmation is required');
      return;
    }

    try {
      const response = await adminAPI.deleteUser(selectedUser.id, {
        confirmPassword: deletePassword,
        reason: deleteReason
      });
      if (response.success) {
        toast.success('User deleted successfully');
        setShowDeleteModal(false);
        setSelectedUser(null);
        setDeletePassword('');
        setDeleteReason('');
        fetchUsers();
        fetchStats();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  // Handle quick role change
  const handleQuickRoleChange = async (userId: any, currentRole: string, newRole: string) => {
    if (currentRole === newRole) return;

    if (!window.confirm(`Change user role from "${currentRole}" to "${newRole}"? This will take effect immediately.`)) {
      return;
    }

    try {
      const userData: any = { role: newRole };

      if (newRole === 'OSL Team') {
        userData.oslAdminLevel = 0;
      }

      if (currentRole === 'Country Office' && newRole !== 'Country Office') {
        userData.country = null;
      }

      const response = await adminAPI.updateUser(userId, userData);
      if (response.success) {
        toast.success('User role updated successfully');
        fetchUsers();
        fetchStats();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user role');
    }
  };

  return (
    <div className="admin-view p-6">
      <div className="admin-header mb-6">
        <h2 className="admin-title text-2xl font-bold">System Administration</h2>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="admin-stats grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="stat-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="stat-value text-2xl font-bold">{stats.total_users}</div>
            <div className="stat-label text-xs text-gray-500 uppercase font-bold">Total Users</div>
          </div>
          <div className="stat-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="stat-value text-2xl font-bold">{stats.active_users}</div>
            <div className="stat-label text-xs text-gray-500 uppercase font-bold">Active Users</div>
          </div>
          <div className="stat-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="stat-value text-2xl font-bold">{stats.country_office_users}</div>
            <div className="stat-label text-xs text-gray-500 uppercase font-bold">Country Office</div>
          </div>
          <div className="stat-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="stat-value text-2xl font-bold">{stats.lab_users}</div>
            <div className="stat-label text-xs text-gray-500 uppercase font-bold">Lab Team</div>
          </div>
          <div className="stat-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="stat-value text-2xl font-bold">{stats.osl_users}</div>
            <div className="stat-label text-xs text-gray-500 uppercase font-bold">OSL Team</div>
          </div>
          <div className="stat-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="stat-value text-2xl font-bold">{stats.active_last_week}</div>
            <div className="stat-label text-xs text-gray-500 uppercase font-bold">Active (7 days)</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs flex gap-4 border-b border-gray-200 mb-6">
        <button
          className={`admin-tab pb-3 px-2 font-bold text-sm transition-colors ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
        <button
          className={`admin-tab pb-3 px-2 font-bold text-sm transition-colors ${activeTab === 'warehouses' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('warehouses')}
        >
          🏢 Warehouse Management
        </button>
        <button
          className={`admin-tab pb-3 px-2 font-bold text-sm transition-colors ${activeTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('orders')}
        >
          🗑️ Order Management
        </button>
        <button
          className={`admin-tab pb-3 px-2 font-bold text-sm transition-colors ${activeTab === 'activity' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('activity')}
        >
          📋 Activity Logs
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-content">
          {/* Filters */}
          <div className="admin-filters flex flex-wrap gap-4 mb-6 items-center">
            <div className="search-box relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="search-input w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { 
                const newRole = e.target.value;
                setRoleFilter(newRole); 
                fetchUsers(1, { role: newRole || undefined }); 
              }}
              className="filter-select px-4 py-2 bg-white border border-gray-200 rounded-lg"
            >
              <option value="">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="OSL Team">OSL Team</option>
              <option value="Laboratory Team">Laboratory Team</option>
              <option value="Country Office">Country Office</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { 
                const newStatus = e.target.value;
                setStatusFilter(newStatus); 
                fetchUsers(1, { isActive: newStatus === '' ? undefined : newStatus === 'active' }); 
              }}
              className="filter-select px-4 py-2 bg-white border border-gray-200 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
              + Create User
            </button>
          </div>

          {/* Users Table */}
          <div className="admin-table-container bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <Loading />
            ) : (
              <table className="admin-table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Email</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Role</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Location</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Last Login</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${!user.is_active ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 font-bold">
                        {user.name}
                        {user.must_change_password && (
                          <span className="ml-2 text-xs text-orange-500" title="Must change password">🔑</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">{user.email}</td>
                      <td className="px-6 py-4">
                        <div className="role-cell flex items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleQuickRoleChange(user.id, user.role, e.target.value)}
                            className="role-select text-xs font-bold bg-gray-100 border-none rounded px-2 py-1"
                          >
                            <option value="Country Office">Country Office</option>
                            <option value="Laboratory Team">Laboratory Team</option>
                            <option value="OSL Team">OSL Team</option>
                            <option value="Super Admin">Super Admin</option>
                          </select>
                          {user.role === 'OSL Team' && user.osl_admin_level !== null && (
                            <span className="osl-level-badge text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black">
                              L{user.osl_admin_level}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.role === 'OSL Team' && user.warehouse_id ? (
                          <span title="Warehouse Location">
                            📦 {warehouses.find(w => w.id === user.warehouse_id)?.name || `Warehouse #${user.warehouse_id}`}
                          </span>
                        ) : (
                          user.country || '-'
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-indicator text-xs font-bold ${user.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {user.is_active ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{formatDateTime(user.last_login) || 'Never'}</td>
                      <td className="px-6 py-4">
                        <div className="action-buttons flex gap-2">
                          <button
                            onClick={() => { setSelectedUser({...user}); setShowEditModal(true); }}
                            className="p-1.5 hover:bg-gray-100 rounded"
                            title="Edit user"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="p-1.5 hover:bg-gray-100 rounded"
                            title="Reset password"
                          >
                            🔐
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="p-1.5 hover:bg-gray-100 rounded"
                            title={user.is_active ? 'Deactivate user' : 'Activate user'}
                          >
                            {user.is_active ? '🚫' : '✅'}
                          </button>
                          <button
                            onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                            className="p-1.5 hover:bg-red-50 rounded text-red-600"
                            title="Delete user permanently"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="pagination-info font-bold text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === 'activity' && (
        <div className="admin-content">
          <div className="admin-table-container bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <Loading />
            ) : (
              <table className="admin-table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Timestamp</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">User</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Action</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Entity</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Details</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activityLogs.map(log => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 text-xs text-gray-500">{formatDateTime(log.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="log-user flex flex-col">
                          <span className="font-bold text-sm">{log.user_name || 'System'}</span>
                          <span className="text-xs text-gray-400">{log.user_email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{log.entity_type ? `${log.entity_type} #${log.entity_id}` : '-'}</td>
                      <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details) : '-'}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">{log.ip_address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Warehouse Management Tab */}
      {activeTab === 'warehouses' && (
        <div className="admin-content">
          <WarehouseManagement />
        </div>
      )}

      {/* Order Management Tab */}
      {activeTab === 'orders' && (
        <div className="admin-content p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="order-management-header mb-6">
            <h3 className="text-xl font-bold">Order History Management</h3>
            <p className="text-gray-500">
              Select specific orders to delete or clear orders by country/all records.
            </p>
          </div>

          <div className="warning-section p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-4 mb-8">
            <div className="warning-icon text-2xl">⚠️</div>
            <div className="warning-content">
              <h4 className="font-bold text-orange-800">Critical Action</h4>
              <p className="text-sm text-orange-700">Deleting orders will permanently remove them and all related data. This cannot be undone.</p>
            </div>
          </div>

          <div className="order-management-actions flex gap-4 mb-8">
            <button
              onClick={() => {
                setClearOrdersMode('country');
                setShowClearOrdersModal(true);
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              🗑️ Clear by Country
            </button>
            <button
              onClick={() => {
                if (window.confirm('⚠️ WARNING: This will delete ALL orders from ALL countries!\n\nAre you absolutely sure?')) {
                  setClearOrdersMode('all');
                  setShowClearOrdersModal(true);
                }
              }}
              className="px-6 py-3 bg-red-800 text-white rounded-xl font-bold hover:bg-red-900 transition-colors"
            >
              💣 Clear All Orders
            </button>
          </div>

          <div className="info-section text-sm text-gray-600">
            <h4 className="font-bold mb-2">Deletion Options:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Clear by Country:</strong> Delete all orders for a specific country (with optional date range)</li>
              <li><strong>Clear All Orders:</strong> Nuclear option - deletes ALL orders from ALL countries</li>
            </ul>
            <p className="mt-4 italic">
              <strong>Note:</strong> All deletions are logged and require your password confirmation.
            </p>
          </div>
        </div>
      )}

      {/* Clear Orders Modal */}
      {showClearOrdersModal && (
        <ClearOrdersModal
          mode={clearOrdersMode}
          onClose={() => setShowClearOrdersModal(false)}
          onSuccess={() => {
            toast.success('Order history cleared successfully');
          }}
        />
      )}
    </div>
  );
}

export default AdminView;
