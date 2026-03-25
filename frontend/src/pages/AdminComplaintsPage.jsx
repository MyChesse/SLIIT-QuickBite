import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../services/api.js';

const AdminComplaintsPage = () => {
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await complaintAPI.deleteComplaint(id);
        fetchComplaints(); // Refresh the list
      } catch (err) {
        setError('Failed to delete complaint');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ffc107';
      case 'In Review': return '#17a2b8';
      case 'Resolved': return '#28a745';
      case 'Rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'High': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading complaints...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin - Complaint Management</h1>

      {/* Filters */}
      <div style={{
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>Filters</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '10px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
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
            <label style={{ display: 'block', marginBottom: '5px' }}>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Priority</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {/* Complaints List */}
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderBottom: '1px solid #ddd' }}>
          <h3>Complaints List ({filteredComplaints.length} items)</h3>
        </div>
        
        {filteredComplaints.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No complaints found matching the current filters.
          </div>
        ) : (
          <div>
            {filteredComplaints.map((complaint) => (
              <div key={complaint._id} style={{
                padding: '15px',
                borderBottom: '1px solid #eee',
                backgroundColor: 'white'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{complaint.complaintId}</span>
                      <span style={{ marginLeft: '15px', color: '#666' }}>{complaint.name} - {complaint.userType}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: 'white',
                        backgroundColor: getPriorityColor(complaint.priority),
                        fontSize: '12px'
                      }}>
                        {complaint.priority}
                      </span>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: 'white',
                        backgroundColor: getStatusColor(complaint.status),
                        fontSize: '12px'
                      }}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                    Email: {complaint.email} | Category: {complaint.category}
                  </div>
                  
                  <div style={{ marginBottom: '5px' }}>
                    <strong>Subject:</strong> {complaint.subject}
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Description:</strong>
                    <p style={{ marginTop: '5px', lineHeight: '1.5' }}>{complaint.description}</p>
                  </div>

                  {complaint.photo && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Photo:</strong>
                      <img
                        src={`http://localhost:5001/${complaint.photo}`}
                        alt="Complaint photo"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '150px',
                          marginTop: '5px',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  )}

                  {complaint.adminReply && (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px',
                      backgroundColor: '#e7f3ff',
                      border: '1px solid #b3d9ff',
                      borderRadius: '4px'
                    }}>
                      <strong>Admin Reply:</strong> {complaint.adminReply}
                    </div>
                  )}

                  <div style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
                    Issue Date: {new Date(complaint.issueDate).toLocaleDateString()} | 
                    Submitted: {new Date(complaint.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  
                  <button
                    onClick={() => handleReply(complaint)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {complaint.adminReply ? 'Edit Reply' : 'Add Reply'}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(complaint._id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal.open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3>Admin Reply</h3>
            <textarea
              value={replyModal.reply}
              onChange={(e) => setReplyModal(prev => ({ ...prev, reply: e.target.value }))}
              placeholder="Enter your reply..."
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '10px',
                marginBottom: '15px'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setReplyModal({ open: false, complaintId: '', reply: '' })}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
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
