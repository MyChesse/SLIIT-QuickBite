import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5001/api/admin/dashboard-summary'),
          axios.get('http://localhost:5001/api/admin/users')
        ]);

        setSummary(summaryRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      title: 'ACTIVE STUDENTS',
      value: summary.activeStudents || 0,
      badge: 'Live',
      badgeColor: 'text-orange-500',
      barColor: 'bg-orange-500',
      icon: '🎓'
    },
    {
      title: 'STAFF MEMBERS',
      value: summary.staffMembers || 0,
      badge: 'Authorized',
      badgeColor: 'text-orange-500',
      barColor: 'bg-orange-500',
      icon: '🪪'
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

            <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
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
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <button className="h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50">
                  ⏷
                </button>

                <button className="h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50">
                  ⇩
                </button>

                <button className="h-12 px-5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition">
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

                <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500">
                  <option>All Roles</option>
                </select>

                <select className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500">
                  <option>All Status</option>
                </select>

                <button className="h-11 px-4 rounded-xl bg-white text-blue-700 text-sm font-semibold border border-slate-200 hover:bg-slate-50">
                  Clear Filters
                </button>
              </div>

              <p className="text-sm text-slate-500">
                Showing {Math.min(users.length, 10)} of {summary.totalUsers || users.length} users
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
                  {users.slice(0, 5).map((item) => {
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
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                              View Profile
                            </button>
                            <button className="text-slate-400 hover:text-slate-600">
                              ⋮
                            </button>
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
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700">
                ‹ Previous
              </button>

              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-lg bg-blue-600 text-white text-sm font-semibold">
                  1
                </button>
                <button className="w-9 h-9 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
                  2
                </button>
                <button className="w-9 h-9 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
                  3
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="text-sm font-medium text-slate-600 hover:text-slate-800">
                  125
                </button>
              </div>

              <button className="text-sm font-medium text-slate-500 hover:text-slate-700">
                Next ›
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;