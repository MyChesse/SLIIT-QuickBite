import { useContext, useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { complaintAPI } from '../services/api';
import StaffSidebarLayout from '../components/StaffSidebarLayout';
import SDCanteenSelector from '../components/SDCanteenSelector';
import { SDCanteenContext } from '../context/SDCanteenContext';

const StaffCanteenComplaintsPage = () => {
  const { selectedCanteenId, canteens } = useContext(SDCanteenContext);
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [replyModal, setReplyModal] = useState({ open: false, complaintId: '', reply: '' });

  const getCanteenKey = (name) => {
    const value = (name || '').trim().toLowerCase();

    if (!value) {
      return '';
    }

    if (value.includes('hostel') || value.includes('basement')) {
      return 'hostel';
    }

    if (value.includes('mini') || value.includes('anohana') || value.includes('faculty')) {
      return 'mini';
    }

    if (value.includes('main') || value.includes('new')) {
      return 'main';
    }

    if (value === 'new canteen') {
      return 'main';
    }

    if (value === 'basement canteen') {
      return 'hostel';
    }

    if (value === 'anohana canteen') {
      return 'mini';
    }

    return value;
  };

  const currentCanteen = useMemo(
    () => canteens.find((canteen) => canteen._id?.toString() === selectedCanteenId?.toString()),
    [canteens, selectedCanteenId]
  );

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await complaintAPI.getAllComplaints();
      const complaints = Array.isArray(response?.data) ? response.data : [];
      setAllComplaints(complaints);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    if (!currentCanteen) {
      return [];
    }

    const selectedKey = getCanteenKey(currentCanteen.name);

    return allComplaints.filter((complaint) => {
      return getCanteenKey(complaint.canteen) === selectedKey;
    });
  }, [allComplaints, currentCanteen]);

  const waitingForCurrentCanteen = Boolean(selectedCanteenId) && !currentCanteen;

  const handleStatusChange = async (id, newStatus) => {
    try {
      await complaintAPI.updateComplaintStatus(id, newStatus);
      await fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update complaint status');
    }
  };

  const handleOpenReply = (complaint) => {
    setReplyModal({
      open: true,
      complaintId: complaint._id,
      reply: complaint.adminReply || ''
    });
  };

  const handleReplySubmit = async () => {
    if (!replyModal.reply.trim()) {
      setError('Reply message is required');
      return;
    }

    try {
      await complaintAPI.replyToComplaint(replyModal.complaintId, replyModal.reply);
      setReplyModal({ open: false, complaintId: '', reply: '' });
      await fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save reply');
    }
  };

  const handleExportPdf = () => {
    if (!currentCanteen) {
      setError('Select a current canteen before exporting PDF');
      return;
    }

    if (filteredComplaints.length === 0) {
      setError(`No complaints found for ${currentCanteen.name} to export`);
      return;
    }

    try {
      setExporting(true);
      setError('');

      const doc = new jsPDF({ orientation: 'landscape' });
      const generatedAt = new Date().toLocaleString();
      const title = `${currentCanteen.name} Complaints Report`;
      const fileSafeCanteenName = currentCanteen.name.replace(/\s+/g, '-').toLowerCase();

      doc.setFontSize(18);
      doc.text(title, 14, 18);

      doc.setFontSize(10);
      doc.text(`Generated at: ${generatedAt}`, 14, 26);
      doc.text(`Total complaints: ${filteredComplaints.length}`, 14, 32);

      const rows = filteredComplaints.map((complaint) => [
        complaint.complaintId || '-',
        complaint.subject || '-',
        complaint.name || '-',
        complaint.category || '-',
        complaint.priority || '-',
        complaint.status || '-',
        complaint.issueDate ? new Date(complaint.issueDate).toLocaleDateString() : '-',
        complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : '-'
      ]);

      autoTable(doc, {
        startY: 38,
        head: [['Complaint ID', 'Subject', 'Name', 'Category', 'Priority', 'Status', 'Issue Date', 'Submitted']],
        body: rows,
        styles: {
          fontSize: 9,
          cellPadding: 2.5
        },
        headStyles: {
          fillColor: [37, 99, 235]
        },
        columnStyles: {
          1: { cellWidth: 55 },
          2: { cellWidth: 34 }
        }
      });

      doc.save(`${fileSafeCanteenName}-complaints-report.pdf`);
    } catch (err) {
      setError('Failed to generate PDF');
    } finally {
      setExporting(false);
    }
  };

  return (
    <StaffSidebarLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Staff Portal</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Canteen Complaints</h1>
              <p className="mt-2 text-sm text-slate-600">
                Showing complaints only for the currently selected canteen.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <SDCanteenSelector />
              <button
                onClick={handleExportPdf}
                disabled={loading || exporting || waitingForCurrentCanteen || filteredComplaints.length === 0}
                className="h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 text-sm font-bold tracking-wide text-white shadow-[0_14px_30px_-16px_rgba(5,150,105,0.85)] transition duration-200 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exporting ? 'Generating PDF...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!selectedCanteenId && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Select a current canteen to view its complaints.
          </div>
        )}

        {waitingForCurrentCanteen && !loading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-600">
            Loading current canteen details...
          </div>
        )}

        {selectedCanteenId && !loading && !waitingForCurrentCanteen && filteredComplaints.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-600">
            No complaints found for {currentCanteen?.name || 'the selected canteen'}.
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-600">
            Loading complaints...
          </div>
        )}

        {selectedCanteenId && !loading && !waitingForCurrentCanteen && filteredComplaints.length > 0 && (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <article
                key={complaint._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-blue-600">{complaint.complaintId}</p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">{complaint.subject}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {complaint.name} • {complaint.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {complaint.category}
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {complaint.status}
                    </span>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      {complaint.priority}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-700">{complaint.description}</p>

                <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-slate-800">Issue Date:</span>{' '}
                    {complaint.issueDate ? new Date(complaint.issueDate).toLocaleDateString() : '-'}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Submitted:</span>{' '}
                    {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : '-'}
                  </p>
                </div>

                {complaint.adminReply && (
                  <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Admin Reply</p>
                    <p className="mt-1 text-sm text-blue-900">{complaint.adminReply}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                    className="h-14 min-w-[220px] rounded-2xl border border-slate-300/80 bg-gradient-to-b from-white to-slate-50 px-5 text-sm font-semibold text-slate-800 shadow-[0_8px_22px_-18px_rgba(15,23,42,0.55)] outline-none transition duration-200 hover:border-blue-300 hover:shadow-[0_12px_28px_-18px_rgba(37,99,235,0.45)] focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => handleOpenReply(complaint)}
                    className="h-14 min-w-[220px] rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-8 text-sm font-bold tracking-wide text-white shadow-[0_14px_30px_-16px_rgba(29,78,216,0.9)] transition duration-200 hover:-translate-y-0.5 hover:from-blue-800 hover:to-blue-700 hover:shadow-[0_18px_32px_-14px_rgba(29,78,216,0.95)] focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    Edit Reply
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {replyModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Edit Reply</h3>
            <p className="mt-1 text-sm text-slate-600">Update the reply for this complaint.</p>

            <textarea
              value={replyModal.reply}
              onChange={(e) => setReplyModal((prev) => ({ ...prev, reply: e.target.value }))}
              rows="5"
              className="mt-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Type your reply..."
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setReplyModal({ open: false, complaintId: '', reply: '' })}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Save Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </StaffSidebarLayout>
  );
};

export default StaffCanteenComplaintsPage;
