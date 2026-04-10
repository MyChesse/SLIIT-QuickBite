import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { feedbackAPI } from '../services/api.js';

const AdminFeedbackPage = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    feedbackType: '',
    rating: '',
    userType: ''
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [feedbackList, filters]);

  const fetchFeedback = async () => {
    try {
      const response = await feedbackAPI.getAllFeedback();
      setFeedbackList(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch feedback');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...feedbackList];

    if (filters.feedbackType) {
      filtered = filtered.filter(f => f.feedbackType === filters.feedbackType);
    }

    if (filters.rating) {
      filtered = filtered.filter(f => f.rating === parseInt(filters.rating));
    }

    if (filters.userType) {
      filtered = filtered.filter(f => f.userType === filters.userType);
    }

    setFilteredFeedback(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackAPI.deleteFeedback(id);
        fetchFeedback(); // Refresh the list
      } catch (err) {
        setError('Failed to delete feedback');
      }
    }
  };

  const getSummary = () => {
    const total = feedbackList.length;
    const averageRating = total > 0 
      ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1)
      : 0;
    
    const feedbackTypes = {};
    feedbackList.forEach(f => {
      feedbackTypes[f.feedbackType] = (feedbackTypes[f.feedbackType] || 0) + 1;
    });

    return { total, averageRating, feedbackTypes };
  };

  const { total, averageRating, feedbackTypes } = getSummary();
  const topType = Object.entries(feedbackTypes).sort((a, b) => b[1] - a[1])[0];

  const sidebarButtonClass = 'w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition';
  const sidebarActiveClass = 'w-full flex items-center gap-3 rounded-xl bg-blue-50 text-blue-700 px-4 py-3 text-sm font-semibold';

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

  const getRatingBadgeClass = (rating) => {
    if (rating >= 4) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }

    if (rating >= 3) {
      return 'bg-[#FF7A00]/15 text-[#A93802] border border-[#FF7A00]/35';
    }

    return 'bg-[#A93802]/12 text-[#A93802] border border-[#A93802]/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
        <div className="flex min-h-screen">
          {renderSidebar('feedback')}
          <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl rounded-3xl border border-[#0056D2]/20 bg-white/90 p-10 text-center text-[#475569] shadow-[0_24px_60px_-38px_rgba(0,86,210,0.5)]">
              Loading feedback...
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="flex min-h-screen">
        {renderSidebar('feedback')}

        <main className="relative flex-1 overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-3xl border border-[#0056D2]/20 bg-white/90 p-6 shadow-[0_26px_75px_-42px_rgba(0,86,210,0.52)] backdrop-blur-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-[#0056D2]/25 bg-[#0056D2]/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#0056D2]">
                ADMIN DASHBOARD
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                Feedback Management Center
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[#475569] sm:text-base">
                Track service quality, monitor user sentiment, and quickly review feedback trends with focused filters.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl border border-[#0056D2]/25 bg-[#0056D2]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0056D2]">Total</p>
                <p className="mt-2 text-2xl font-bold text-[#0056D2]">{total}</p>
              </div>
              <div className="rounded-2xl border border-[#FF7A00]/35 bg-[#FF7A00]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#A93802]">Average Rating</p>
                <p className="mt-2 text-2xl font-bold text-[#A93802]">{averageRating}</p>
              </div>
              <div className="rounded-2xl border border-[#A93802]/25 bg-[#A93802]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#A93802]">Top Type</p>
                <p className="mt-2 truncate text-lg font-bold text-[#A93802]">{topType ? `${topType[0]} (${topType[1]})` : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_20px_55px_-38px_rgba(15,23,42,0.35)] sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
            <p className="text-sm text-[#475569]">{filteredFeedback.length} showing</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475569]">Feedback Type</label>
              <select
                name="feedbackType"
                value={filters.feedbackType}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
              >
                <option value="">All Types</option>
                <option value="Food quality">Food quality</option>
                <option value="Service">Service</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Pricing">Pricing</option>
                <option value="Suggestion">Suggestion</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#475569]">Rating</label>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
              >
                <option value="">All Ratings</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#475569]">User Type</label>
              <select
                name="userType"
                value={filters.userType}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
              >
                <option value="">All Users</option>
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-[#A93802]/30 bg-[#A93802]/10 px-4 py-3 text-sm font-medium text-[#A93802]">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {filteredFeedback.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center text-[#475569]">
              No feedback found matching the current filters.
            </div>
          ) : (
            filteredFeedback.map((feedback) => (
              <article
                key={feedback._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_-26px_rgba(15,23,42,0.45)] transition hover:shadow-[0_18px_40px_-24px_rgba(0,86,210,0.3)] sm:p-6"
              >
                
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#0056D2]/25 bg-[#0056D2]/10 px-3 py-1 text-xs font-semibold text-[#0056D2]">
                    {feedback.feedbackType}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getRatingBadgeClass(feedback.rating)}`}>
                    Rating {feedback.rating}
                  </span>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm leading-relaxed text-slate-700">{feedback.message}</p>
                </div>

                <p className="mt-4 text-xs text-[#475569]">
                  Submitted: {new Date(feedback.createdAt).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
