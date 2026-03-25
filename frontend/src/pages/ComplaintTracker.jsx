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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#ffc107';
      case 'In Review':
        return '#17a2b8';
      case 'Resolved':
        return '#28a745';
      case 'Rejected':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return '#28a745';
      case 'Medium':
        return '#ffc107';
      case 'High':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Track Complaint</h1>
      <p>Enter your complaint ID to check the status of your complaint.</p>

      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={complaintId}
              onChange={handleInputChange}
              placeholder="Enter Complaint ID (e.g., CMP-1001)"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          color: 'red',
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {complaint && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Complaint Details</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>Complaint ID:</strong> {complaint.complaintId}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Subject:</strong> {complaint.subject}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Category:</strong> {complaint.category}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Priority:</strong> 
            <span style={{
              marginLeft: '10px',
              padding: '4px 8px',
              borderRadius: '4px',
              color: 'white',
              backgroundColor: getPriorityColor(complaint.priority),
              fontSize: '14px'
            }}>
              {complaint.priority}
            </span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Status:</strong> 
            <span style={{
              marginLeft: '10px',
              padding: '4px 8px',
              borderRadius: '4px',
              color: 'white',
              backgroundColor: getStatusColor(complaint.status),
              fontSize: '14px'
            }}>
              {complaint.status}
            </span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Description:</strong>
            <p style={{ marginTop: '5px', lineHeight: '1.5' }}>{complaint.description}</p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Date of Issue:</strong> {new Date(complaint.issueDate).toLocaleDateString()}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Submitted On:</strong> {new Date(complaint.createdAt).toLocaleDateString()}
          </div>

          {complaint.photo && (
            <div style={{ marginBottom: '15px' }}>
              <strong>Photo:</strong>
              <div style={{ marginTop: '10px' }}>
                <img
                  src={`http://localhost:5001/${complaint.photo}`}
                  alt="Complaint photo"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          )}

          {complaint.adminReply && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#e7f3ff',
              border: '1px solid #b3d9ff',
              borderRadius: '4px'
            }}>
              <strong>Admin Reply:</strong>
              <p style={{ marginTop: '5px', lineHeight: '1.5' }}>{complaint.adminReply}</p>
            </div>
          )}

          {!complaint.adminReply && complaint.status !== 'Pending' && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px'
            }}>
              <em>No admin reply yet. Please check back later.</em>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintTracker;
