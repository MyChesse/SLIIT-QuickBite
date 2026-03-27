import React, { useState } from 'react';
import { complaintAPI } from '../services/api.js';

const ComplaintTracker = () => {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleInputChange = (e) => {
    setComplaintId(e.target.value.toUpperCase());
    setError('');
    if (searched) {
      setComplaint(null);
      setSearched(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!complaintId.trim()) {
      setError('Please enter a complaint ID');
      return;
    }

    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const response = await complaintAPI.trackComplaint(complaintId);
      setComplaint(response.data);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint not found');
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#FF7A00]/15 text-[#A93802] border border-[#FF7A00]/35';
      case 'In Review':
        return 'bg-[#0056D2]/12 text-[#0056D2] border border-[#0056D2]/30';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Rejected':
        return 'bg-[#A93802]/12 text-[#A93802] border border-[#A93802]/30';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Medium':
        return 'bg-[#FF7A00]/15 text-[#A93802] border border-[#FF7A00]/35';
      case 'High':
        return 'bg-[#A93802]/12 text-[#A93802] border border-[#A93802]/30';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <section className="rounded-3xl border border-[#0056D2]/20 bg-white/90 p-6 shadow-[0_26px_75px_-42px_rgba(0,86,210,0.52)] backdrop-blur-sm sm:p-8">
          <span className="inline-flex rounded-full border border-[#0056D2]/25 bg-[#0056D2]/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#0056D2]">
            QUICKBITE TRACKER
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            Track your complaint in real time
          </h1>
          <p className="mt-3 text-sm text-[#475569] sm:text-base">
            Enter your complaint ID to see current status, priority, timeline details, and admin response.
          </p>

          <form onSubmit={handleSearch} className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={complaintId}
                onChange={handleInputChange}
                placeholder="Enter Complaint ID (e.g., CMP-1001)"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-32 items-center justify-center rounded-2xl bg-[#0056D2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b4fb8] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>
        </section>

        {error && (
          <div className="mt-5 rounded-2xl border border-[#A93802]/30 bg-[#A93802]/10 px-4 py-3 text-sm font-medium text-[#A93802]">
            {error}
          </div>
        )}

        {complaint && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_34px_-26px_rgba(15,23,42,0.45)] sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-wide text-[#0056D2]">{complaint.complaintId}</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{complaint.subject}</h2>
                <p className="mt-1 text-sm text-[#475569]">Category: {complaint.category}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadgeClass(complaint.priority)}`}>
                  {complaint.priority} Priority
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm leading-relaxed text-slate-700">{complaint.description}</p>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-[#475569] sm:grid-cols-2">
              <p>
                <span className="font-semibold text-slate-700">Date of Issue:</span> {new Date(complaint.issueDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Submitted On:</span> {new Date(complaint.createdAt).toLocaleDateString()}
              </p>
            </div>

            {complaint.photo && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-slate-800">Attached Photo</p>
                <img
                  src={`http://localhost:5001/${complaint.photo}`}
                  alt="Complaint photo"
                  className="h-auto max-h-80 w-full rounded-2xl border border-slate-200 object-cover"
                />
              </div>
            )}

            {complaint.adminReply && (
              <div className="mt-5 rounded-2xl border border-[#0056D2]/25 bg-[#0056D2]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0056D2]">Admin Reply</p>
                <p className="mt-2 text-sm leading-relaxed text-[#1e3a8a]">{complaint.adminReply}</p>
              </div>
            )}

            {!complaint.adminReply && complaint.status !== 'Pending' && (
              <div className="mt-5 rounded-2xl border border-[#FF7A00]/30 bg-[#FF7A00]/10 p-4 text-sm text-[#A93802]">
                <em>No admin reply yet. Please check back later.</em>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ComplaintTracker;
