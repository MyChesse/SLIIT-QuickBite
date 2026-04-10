import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AdminInventoryPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [canteens, setCanteens] = useState([]);
  const [summary, setSummary] = useState({
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalStockValue: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    search: '',
    canteenId: 'all',
    availability: 'all',
    stock: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authHeaders = useMemo(() => (
    token ? { Authorization: `Bearer ${token}` } : {}
  ), [token]);

  const fetchInventory = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_BASE_URL}/api/admin/inventory`, {
        headers: authHeaders,
        params: {
          ...filters,
          page,
          limit: 12
        }
      });

      setItems(response.data.items || []);
      setCanteens(response.data.canteens || []);
      setSummary(response.data.summary || {});
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchInventory(1);
  }, [token, filters.search, filters.canteenId, filters.availability, filters.stock]);

  const sidebarButtonClass = 'w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition';
  const sidebarActiveClass = 'w-full flex items-center gap-3 rounded-xl bg-blue-50 text-blue-700 px-4 py-3 text-sm font-semibold';

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const renderSidebar = (activePage) => (
    <aside className="hidden lg:flex w-[250px] flex-col bg-white border-r border-slate-200 px-5 py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
            🎓
          </div>
          <div>
            <h2 className="text-[28px] leading-none font-bold text-blue-900">Admin Portal</h2>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mt-1">
              Canteen Management
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        <button onClick={() => navigate('/admin/dashboard')} className={activePage === 'users' ? sidebarActiveClass : sidebarButtonClass}>
          <span className="text-base">👥</span>
          <span>User Management</span>
        </button>

        <button onClick={() => navigate('/admin/complaints')} className={activePage === 'complaints' ? sidebarActiveClass : sidebarButtonClass}>
          <span className="text-base">⚠️</span>
          <span>Complaint Management</span>
        </button>

        <button onClick={() => navigate('/admin/feedback')} className={activePage === 'feedback' ? sidebarActiveClass : sidebarButtonClass}>
          <span className="text-base">💬</span>
          <span>Feedback Management</span>
        </button>

        <button onClick={() => navigate('/admin/promotions')} className={activePage === 'promotions' ? sidebarActiveClass : sidebarButtonClass}>
          <span className="text-base">🍽️</span>
          <span>Promotion Management</span>
        </button>

        <button onClick={() => navigate('/admin/inventory')} className={activePage === 'inventory' ? sidebarActiveClass : sidebarButtonClass}>
          <span className="text-base">📦</span>
          <span>Inventory</span>
        </button>

        <button className={sidebarButtonClass}>
          <span className="text-base">🛒</span>
          <span>Orders</span>
        </button>

        <button className={sidebarButtonClass}>
          <span className="text-base">📊</span>
          <span>Analytics</span>
        </button>
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="flex min-h-screen">
        {renderSidebar('inventory')}

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="rounded-3xl border border-[#0056D2]/20 bg-white/90 p-6 shadow-[0_26px_75px_-42px_rgba(0,86,210,0.52)] backdrop-blur-sm sm:p-8">
              <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Admin Inventory Overview</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#475569] sm:text-base">
                Monitor stock levels across all canteens, identify low-stock items, and track overall inventory value.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-[#0056D2]/25 bg-[#0056D2]/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0056D2]">Total Items</p>
                  <p className="mt-2 text-2xl font-bold text-[#0056D2]">{summary.totalItems || 0}</p>
                </div>
                <div className="rounded-2xl border border-[#FF7A00]/35 bg-[#FF7A00]/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#A93802]">Low Stock</p>
                  <p className="mt-2 text-2xl font-bold text-[#A93802]">{summary.lowStockItems || 0}</p>
                </div>
                <div className="rounded-2xl border border-[#A93802]/25 bg-[#A93802]/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#A93802]">Out Of Stock</p>
                  <p className="mt-2 text-2xl font-bold text-[#A93802]">{summary.outOfStockItems || 0}</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Stock Value</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-700">Rs. {(summary.totalStockValue || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_20px_55px_-38px_rgba(15,23,42,0.35)] sm:p-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <input
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by item or category"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
                />

                <select
                  name="canteenId"
                  value={filters.canteenId}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
                >
                  <option value="all">All Canteens</option>
                  {canteens.map((canteen) => (
                    <option key={canteen._id} value={canteen._id}>{canteen.name}</option>
                  ))}
                </select>

                <select
                  name="availability"
                  value={filters.availability}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>

                <select
                  name="stock"
                  value={filters.stock}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
                >
                  <option value="all">All Stock Levels</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-[#A93802]/30 bg-[#A93802]/10 px-4 py-3 text-sm font-medium text-[#A93802]">
                {error}
              </div>
            )}

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {loading ? (
                <div className="p-10 text-center text-slate-500">Loading inventory...</div>
              ) : items.length === 0 ? (
                <div className="p-10 text-center text-slate-500">No inventory items found for selected filters.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-[#f4f7fd]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Item</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Canteen</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const isLowStock = item.currentStock < item.lowStockThreshold;
                        return (
                          <tr key={item._id} className="border-t border-slate-100">
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{item.canteenId?.name || 'Unknown'}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{item.category}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              <span className={isLowStock ? 'font-semibold text-[#A93802]' : ''}>{item.currentStock}</span>
                              <span className="text-slate-400"> / min {item.lowStockThreshold}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">Rs. {item.price}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                {item.isAvailable ? 'Available' : 'Unavailable'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing page {pagination.currentPage || 1} of {pagination.totalPages || 1}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrev}
                  onClick={() => fetchInventory((pagination.currentPage || 1) - 1)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={!pagination.hasNext}
                  onClick={() => fetchInventory((pagination.currentPage || 1) + 1)}
                  className="rounded-xl bg-[#0056D2] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminInventoryPage;
