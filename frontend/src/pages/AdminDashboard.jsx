import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [inviting, setInviting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'student',
    status: 'active'
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/dashboard-summary`, {
            headers: authHeaders
          }),
          axios.get(`${API_BASE_URL}/api/admin/users`, {
            headers: authHeaders,
            params: {
              search: searchTerm,
              role: roleFilter,
              status: statusFilter,
              page: currentPage,
              limit: 10
            }
          })
        ]);

        setSummary(summaryRes.data);
        setUsers(usersRes.data.users);
        setPagination(usersRes.data.pagination);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        toast.error(error.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [searchTerm, roleFilter, statusFilter, currentPage, token]);

  const summaryCards = [
    {
      title: 'TOTAL USERS',
      value: summary.totalUsers || 0,
      badge: '+12%',
      badgeColor: 'text-blue-600',
      barColor: 'bg-blue-600',
      icon: '👥'
    },
    {
      title: 'ACTIVE USERS',
      value: summary.activeUsers || 0,
      badge: 'Live',
      badgeColor: 'text-green-600',
      barColor: 'bg-green-600',
      icon: '✅'
    },
    {
      title: 'SUSPENDED USERS',
      value: summary.suspendedUsers || 0,
      badge: 'Inactive',
      badgeColor: 'text-red-600',
      barColor: 'bg-red-600',
      icon: '🚫'
    }
  ];

  const getRoleStyles = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'admin':
        return 'bg-orange-100 text-orange-700';
      case 'staff':
        return 'bg-violet-100 text-violet-700';
      case 'student':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusStyles = (status) => {
    const value = (status || 'active').toLowerCase();

    switch (value) {
      case 'active':
        return {
          dot: 'bg-blue-600',
          text: 'text-blue-600',
          label: 'Active'
        };
      case 'suspended':
        return {
          dot: 'bg-red-500',
          text: 'text-red-500',
          label: 'Suspended'
        };
      case 'inactive':
        return {
          dot: 'bg-slate-400',
          text: 'text-slate-500',
          label: 'Inactive'
        };
      default:
        return {
          dot: 'bg-emerald-500',
          text: 'text-emerald-600',
          label: status
        };
    }
  };

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/admin/users`, inviteForm, {
        headers: authHeaders
      });
      toast.success('User invited successfully');
      setShowInviteModal(false);
      setInviteForm({ name: '', email: '', password: '', role: 'student' });
      // Refresh users
      const usersRes = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: authHeaders,
        params: { search: searchTerm, role: roleFilter, status: statusFilter, page: currentPage, limit: 10 }
      });
      setUsers(usersRes.data.users);
      setPagination(usersRes.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to invite user');
    } finally {
      setInviting(false);
    }
  };

  const handleViewProfile = async (userId) => {
    setProfileLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users/${userId}`, {
        headers: authHeaders
      });
      setSelectedUser(res.data);
      setShowProfileModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load user details');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditing(true);
    try {
      await axios.put(`${API_BASE_URL}/api/admin/users/${editingUserId}`, editForm, {
        headers: authHeaders
      });
      toast.success('User updated successfully');
      setShowEditModal(false);
      // Refresh users
      const usersRes = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: authHeaders,
        params: { search: searchTerm, role: roleFilter, status: statusFilter, page: currentPage, limit: 10 }
      });
      setUsers(usersRes.data.users);
      setPagination(usersRes.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setEditing(false);
    }
  };

  const handleSuspendUser = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus === 'active' ? 'suspend' : 'activate'} this user?`)) {
      return;
    }
    
    setActionLoading(true);
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await axios.put(
        `${API_BASE_URL}/api/admin/users/${userId}`,
        { status: newStatus },
        { headers: authHeaders }
      );
      toast.success(`User ${newStatus} successfully`);
      // Refresh users
      const usersRes = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: authHeaders,
        params: { search: searchTerm, role: roleFilter, status: statusFilter, page: currentPage, limit: 10 }
      });
      setUsers(usersRes.data.users);
      setPagination(usersRes.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(false);
      setOpenMenuId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    setActionLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, {
        headers: authHeaders
      });
      toast.success('User deleted successfully');
      // Refresh users
      const usersRes = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: authHeaders,
        params: { search: searchTerm, role: roleFilter, status: statusFilter, page: currentPage, limit: 10 }
      });
      setUsers(usersRes.data.users);
      setPagination(usersRes.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(false);
      setOpenMenuId(null);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm px-8 py-8 text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4" />
          <p className="text-slate-700 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-[250px] flex-col bg-white border-r border-slate-200 px-5 py-6">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                🎓
              </div>
              <div>
                <h2 className="text-[28px] leading-none font-bold text-blue-900">
                  Admin Portal
                </h2>
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mt-1">
                  Canteen Management
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 rounded-xl bg-blue-50 text-blue-700 px-4 py-3 text-sm font-semibold">
              <span className="text-base">👥</span>
              <span>User Management</span>
            </button>

            <button
              onClick={() => navigate('/admin/complaints')}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <span className="text-base">⚠️</span>
              <span>Complaint Management</span>
            </button>

            <button
              onClick={() => navigate('/admin/feedback')}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <span className="text-base">💬</span>
              <span>Feedback Management</span>
            </button>

            <button 
              onClick={() => navigate('/admin/promotions')}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <span className="text-base">🍽️</span>
              <span>Promotion Management</span>
            </button>

            <button 
              onClick={() => navigate('/admin/inventory')}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <span className="text-base">📦</span>
              <span>Inventory</span>
            </button>

            <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
              <span className="text-base">🛒</span>
              <span>Orders</span>
            </button>

            <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
              <span className="text-base">📊</span>
              <span>Analytics</span>
            </button>
          </nav>

          <div className="mt-auto bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || 'admin@sliit.lk'}
                </p>
              </div>
            </div>

            <button className="w-full mt-4 rounded-xl bg-blue-600 text-white text-sm font-semibold py-2.5 hover:bg-blue-700 transition">
              System Status
            </button>

            <button
              onClick={handleLogout}
              className="w-full mt-2 rounded-xl bg-red-500 text-white text-sm font-semibold py-2.5 hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
          {/* Top Header */}
          <div className="bg-white border border-slate-200 rounded-[24px] px-5 py-4 shadow-sm mb-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600">
                  ☰
                </button>
                <h1 className="text-[34px] font-bold text-blue-900 tracking-tight">
                  User Management
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative w-full sm:w-[280px]">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, ID or email..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <button className="h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50">
                  ⏷
                </button>

                <button className="h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50">
                  ⇩
                </button>

                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="h-12 px-5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition"
                >
                  + Invite User
                </button>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
            {summaryCards.map((card) => (
              <div
                key={card.title}
                className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-semibold">
                      {card.title}
                    </p>

                    <div className="flex items-end gap-2 mt-4">
                      <h3 className="text-[28px] sm:text-[34px] font-bold text-slate-900 leading-none">
                        {card.value}
                      </h3>
                      <span className={`text-sm font-semibold ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl opacity-70">
                    {card.icon}
                  </div>
                </div>

                <div className="mt-6 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full w-[65%] rounded-full ${card.barColor}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="bg-[#eef4ff] border border-[#dbe7ff] rounded-[22px] px-5 py-4 mb-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-sm font-medium text-slate-600">Filter By:</span>

                <select 
                  value={roleFilter}
                  onChange={handleRoleFilter}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>

                <select 
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>

                <button 
                  onClick={clearFilters}
                  className="h-11 px-4 rounded-xl bg-white text-blue-700 text-sm font-semibold border border-slate-200 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              </div>

              <p className="text-sm text-slate-500">
                Showing {users.length} of {pagination.totalUsers || 0} users
              </p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#f4f7fd]">
                  <tr>
                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.15em] text-slate-400 font-semibold">
                      User Profile
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.15em] text-slate-400 font-semibold">
                      ID & Contact
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.15em] text-slate-400 font-semibold">
                      Role
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.15em] text-slate-400 font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] uppercase tracking-[0.15em] text-slate-400 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((item) => {
                    const statusInfo = getStatusStyles(item.status);

                    return (
                      <tr
                        key={item._id}
                        className="border-t border-slate-200 hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-700">
                              {item.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="text-[15px] font-semibold text-slate-800">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                Joined {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-slate-700">
                            {item._id?.slice(-8)?.toUpperCase()}
                          </p>
                          <p className="text-sm text-slate-500">{item.email}</p>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${getRoleStyles(
                              item.role
                            )}`}
                          >
                            {item.role}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.dot}`} />
                            <span className={`text-sm font-semibold ${statusInfo.text}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleViewProfile(item._id)}
                              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                              View Profile
                            </button>
                            <div className="relative">
                              <button 
                                onClick={() => setOpenMenuId(openMenuId === item._id ? null : item._id)}
                                className="text-slate-400 hover:text-slate-600 text-lg"
                              >
                                ⋮
                              </button>
                              
                              {/* Dropdown menu */}
                              {openMenuId === item._id && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                                  <button 
                                    onClick={() => handleEditUser(item)}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-200 font-medium"
                                  >
                                    ✏️ Edit User
                                  </button>
                                  <button 
                                    onClick={() => handleSuspendUser(item._id, item.status)}
                                    disabled={actionLoading}
                                    className="w-full text-left px-4 py-2.5 text-sm text-orange-600 hover:bg-slate-50 border-b border-slate-200 font-medium disabled:opacity-50"
                                  >
                                    {item.status === 'active' ? '🔒 Suspend User' : '🔓 Activate User'}
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUser(item._id)}
                                    disabled={actionLoading}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium disabled:opacity-50"
                                  >
                                    🗑️ Delete User
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-5 border-t border-slate-200">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹ Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next ›
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Invite New User</h2>
            <form onSubmit={handleInviteUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={inviteForm.password}
                    onChange={(e) => setInviteForm({...inviteForm, password: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {inviting ? 'Inviting...' : 'Invite User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile View Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">User Profile</h2>
                <p className="text-sm text-slate-500">Detailed account information</p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
                aria-label="Close profile modal"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Full Name</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.name || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Email</p>
                  <p className="text-sm font-semibold text-slate-800 break-all">{selectedUser.email || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Role</p>
                  <p className="text-sm font-semibold text-slate-800 capitalize">{selectedUser.role || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Status</p>
                  <p className="text-sm font-semibold text-slate-800 capitalize">{selectedUser.status || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">User ID</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.userId || selectedUser._id || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Created At</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Edit User</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {editing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {profileLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[60]">
          <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-slate-700">Loading profile...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;