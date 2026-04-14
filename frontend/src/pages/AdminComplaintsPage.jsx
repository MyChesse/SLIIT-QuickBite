import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { complaintAPI } from '../services/api.js';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AdminSidebar from '../components/AdminSidebar';

const AdminComplaintsPage = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: ''
  });
  const [replyModal, setReplyModal] = useState({ open: false, complaintId: '', reply: '' });
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef(null);

  const handleExportPDF = async () => {
    if (filteredComplaints.length === 0) {
      setError('No complaints to export. Adjust filters or add complaints first.');
      return;
    }

    setError('');
    setExporting(true);

    try {
      const doc = new jsPDF({ orientation: 'landscape' });
      const generatedAt = new Date().toLocaleString();
      const generatedDateForFile = new Date().toISOString().split('T')[0];

      const pending = filteredComplaints.filter((c) => c.status === 'Pending').length;
      const inReview = filteredComplaints.filter((c) => c.status === 'In Review').length;
      const resolved = filteredComplaints.filter((c) => c.status === 'Resolved').length;
      const rejected = filteredComplaints.filter((c) => c.status === 'Rejected').length;

      const activeFilters = [
        filters.category ? `Category: ${filters.category}` : null,
        filters.status ? `Status: ${filters.status}` : null,
        filters.priority ? `Priority: ${filters.priority}` : null
      ].filter(Boolean);

      doc.setFillColor(238, 244, 255);
      doc.rect(0, 0, 297, 38, 'F');

      doc.setDrawColor(0, 86, 210);
      doc.setLineWidth(0.6);
      doc.line(14, 34, 283, 34);

      doc.setFont('times', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42);
      doc.text('SLIIT QuickBite', 14, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text('Complaint Management Report', 14, 22);
      doc.text(`Generated: ${generatedAt}`, 14, 29);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 58, 138);
      doc.text('CONFIDENTIAL - INTERNAL USE ONLY', 283, 14, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Total Records: ${filteredComplaints.length}`, 283, 22, { align: 'right' });

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 40, 269, 18, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`Pending: ${pending}`, 20, 51);
      doc.text(`In Review: ${inReview}`, 78, 51);
      doc.text(`Resolved: ${resolved}`, 148, 51);
      doc.text(`Rejected: ${rejected}`, 216, 51);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const filterText = activeFilters.length > 0 ? activeFilters.join(' | ') : 'No filters applied';
      doc.text(`Filters: ${filterText}`, 14, 65);

      const rows = filteredComplaints.map((complaint) => [
        complaint.complaintId || '-',
        complaint.subject || '-',
        complaint.name || '-',
        complaint.email || '-',
        complaint.canteen || '-',
        complaint.category || '-',
        complaint.priority || '-',
        complaint.status || '-',
        complaint.issueDate ? new Date(complaint.issueDate).toLocaleDateString() : '-',
        complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : '-'
      ]);

      const startY = 70;

      autoTable(doc, {
        startY,
        head: [[
          'Complaint ID',
          'Subject',
          'Name',
          'Email',
          'Canteen',
          'Category',
          'Priority',
          'Status',
          'Issue Date',
          'Submitted'
        ]],
        body: rows,
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2.4,
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
          textColor: [30, 41, 59],
          valign: 'middle'
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 24 },
          1: { cellWidth: 46 },
          2: { cellWidth: 24 },
          3: { cellWidth: 48 },
          4: { cellWidth: 24 },
          5: { cellWidth: 22 },
          6: { cellWidth: 18 },
          7: { cellWidth: 18 },
          8: { cellWidth: 18 },
          9: { cellWidth: 18 }
        },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          const pageHeight = doc.internal.pageSize.getHeight();

          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.2);
          doc.line(14, pageHeight - 10, 283, pageHeight - 10);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text('QuickBite Admin Complaint Report', 14, pageHeight - 5.5);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, 283, pageHeight - 5.5, { align: 'right' });
        }
      });

      doc.save(`admin-complaints-report-${generatedDateForFile}.pdf`);
    } catch (err) {
      console.error('Failed to generate complaints PDF:', err);
      setError('Failed to generate PDF report. Please try again.');
    } finally {
      setExporting(false);
    }

  };

  
  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, filters]);

  const fetchComplaints = async () => {
    try {
      const response = await complaintAPI.getAllComplaints();
      setComplaints(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch complaints');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...complaints];

    if (filters.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(c => c.priority === filters.priority);
    }

    setFilteredComplaints(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await complaintAPI.updateComplaintStatus(id, newStatus);
      fetchComplaints(); // Refresh the list
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleReply = (complaint) => {
    setReplyModal({
      open: true,
      complaintId: complaint._id,
      reply: complaint.adminReply || ''
    });
  };

  const handleReplySubmit = async () => {
    try {
      await complaintAPI.replyToComplaint(replyModal.complaintId, replyModal.reply);
      setReplyModal({ open: false, complaintId: '', reply: '' });
      fetchComplaints(); // Refresh the list
    } catch (err) {
      setError('Failed to submit reply');
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

  const pendingCount = complaints.filter((item) => item.status === 'Pending').length;
  const inReviewCount = complaints.filter((item) => item.status === 'In Review').length;
  const highPriorityCount = complaints.filter((item) => item.priority === 'High').length;

  const renderSidebar = (activePage) => <AdminSidebar activePage={activePage} />;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
        <div className="flex min-h-screen">
          {renderSidebar('complaints')}
          <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl rounded-3xl border border-[#0056D2]/20 bg-white/90 p-10 text-center text-[#475569] shadow-[0_24px_60px_-38px_rgba(0,86,210,0.5)]">
              Loading complaints...
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="flex min-h-screen">
        {renderSidebar('complaints')}

        <main className="relative flex-1 overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-3xl border border-[#0056D2]/20 bg-white/90 p-6 shadow-[0_26px_75px_-42px_rgba(0,86,210,0.52)] backdrop-blur-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-[#0056D2]/25 bg-[#0056D2]/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#0056D2]">
                ADMIN DASHBOARD
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                Complaint Management Center
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[#475569] sm:text-base">
                Review complaints, update statuses, and reply to students or staff from one organized control panel.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl border border-[#0056D2]/25 bg-[#0056D2]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0056D2]">Total</p>
                <p className="mt-2 text-2xl font-bold text-[#0056D2]">{complaints.length}</p>
              </div>
              <div className="rounded-2xl border border-[#FF7A00]/35 bg-[#FF7A00]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#A93802]">Pending</p>
                <p className="mt-2 text-2xl font-bold text-[#A93802]">{pendingCount}</p>
              </div>
              <div className="rounded-2xl border border-[#A93802]/25 bg-[#A93802]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#A93802]">High Priority</p>
                <p className="mt-2 text-2xl font-bold text-[#A93802]">{highPriorityCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_20px_55px_-38px_rgba(15,23,42,0.35)] sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
            <div className="flex items-center gap-3">
              <p className="text-sm text-[#475569]">{filteredComplaints.length} showing</p>
              <button
                onClick={handleExportPDF}
                disabled={exporting || filteredComplaints.length === 0}
                className="rounded-xl bg-[#0056D2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a4cb1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exporting ? 'Generating...' : 'Export PDF'}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475569]">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
              >
                <option value="">All Categories</option>
                <option value="Food issue">Food issue</option>
                <option value="Staff behavior">Staff behavior</option>
                <option value="Delay">Delay</option>
                <option value="Hygiene">Hygiene</option>
                <option value="Wrong order">Wrong order</option>
                <option value="Payment issue">Payment issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#475569]">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#475569]">Priority</label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-[#A93802]/30 bg-[#A93802]/10 px-4 py-3 text-sm font-medium text-[#A93802]">
            {error}
          </div>
        )}

      

        <div ref={exportRef} className="mt-6 space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center text-[#475569]">
              No complaints found matching the current filters.
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <article
                key={complaint._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_-26px_rgba(15,23,42,0.45)] transition hover:shadow-[0_18px_40px_-24px_rgba(0,86,210,0.3)] sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold tracking-wide text-[#0056D2]">{complaint.complaintId}</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{complaint.subject}</h3>
                    <p className="mt-1 text-sm text-[#475569]">
                      {complaint.name} ({complaint.userType})
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadgeClass(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-[#475569] sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-slate-700">Email:</span> {complaint.email}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Category:</span> {complaint.category}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Issue Date:</span> {new Date(complaint.issueDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Submitted:</span> {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm leading-relaxed text-slate-700">{complaint.description}</p>
                </div>

                {complaint.photo && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-slate-800">Evidence Photo</p>
                    <img
                      src={`http://localhost:5001/${complaint.photo}`}
                      alt="Complaint photo"
                      className="h-auto max-h-56 w-full max-w-sm rounded-2xl border border-slate-200 object-cover"
                    />
                  </div>
                )}

                {complaint.adminReply && (
                  <div className="mt-4 rounded-2xl border border-[#0056D2]/25 bg-[#0056D2]/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#0056D2]">Admin Reply</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#1e3a8a]">{complaint.adminReply}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => handleReply(complaint)}
                    className="rounded-xl bg-[#0056D2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a4cb1]"
                  >
                    {complaint.adminReply ? 'Edit Reply' : 'Add Reply'}
                  </button>

                </div>
              </article>
            ))
          )}
        </div>
          </div>
        </main>
      </div>

      {replyModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <h3 className="text-xl font-bold text-slate-900">Admin Reply</h3>
            <p className="mt-1 text-sm text-[#475569]">Write a clear response to help the requester understand the resolution.</p>

            <textarea
              value={replyModal.reply}
              onChange={(e) => setReplyModal((prev) => ({ ...prev, reply: e.target.value }))}
              placeholder="Enter your reply..."
              rows="5"
              className="mt-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2]/20"
            />

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => setReplyModal({ open: false, complaintId: '', reply: '' })}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className="rounded-xl bg-[#FF7A00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e46e00]"
              >
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintsPage;
