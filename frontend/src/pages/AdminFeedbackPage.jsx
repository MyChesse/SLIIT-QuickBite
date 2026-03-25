import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/api.js';

const AdminFeedbackPage = () => {
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

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading feedback...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin - Feedback Management</h1>

      {/* Summary Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Total Feedback</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{total}</p>
        </div>
        <div style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Average Rating</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{averageRating}</p>
        </div>
        <div style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Feedback Types</h3>
          {Object.entries(feedbackTypes).map(([type, count]) => (
            <div key={type} style={{ fontSize: '14px', marginBottom: '2px' }}>
              {type}: {count}
            </div>
          ))}
        </div>
      </div>

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
            <label style={{ display: 'block', marginBottom: '5px' }}>Feedback Type</label>
            <select
              name="feedbackType"
              value={filters.feedbackType}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
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
            <label style={{ display: 'block', marginBottom: '5px' }}>Rating</label>
            <select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
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
            <label style={{ display: 'block', marginBottom: '5px' }}>User Type</label>
            <select
              name="userType"
              value={filters.userType}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="">All Users</option>
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {/* Feedback List */}
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderBottom: '1px solid #ddd' }}>
          <h3>Feedback List ({filteredFeedback.length} items)</h3>
        </div>
        
        {filteredFeedback.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No feedback found matching the current filters.
          </div>
        ) : (
          <div>
            {filteredFeedback.map((feedback) => (
              <div key={feedback._id} style={{
                padding: '15px',
                borderBottom: '1px solid #eee',
                backgroundColor: 'white'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '20px'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {feedback.name} - {feedback.userType}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                      Email: {feedback.email}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                      <strong>Type:</strong> {feedback.feedbackType} | 
                      <strong style={{ marginLeft: '10px' }}>Rating:</strong> 
                      <span style={{
                        marginLeft: '5px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: feedback.rating >= 4 ? '#28a745' : 
                                        feedback.rating >= 3 ? '#ffc107' : '#dc3545',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {feedback.rating}
                      </span>
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                      <strong>Message:</strong>
                      <p style={{ marginTop: '5px', lineHeight: '1.5' }}>{feedback.message}</p>
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      Submitted: {new Date(feedback.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDelete(feedback._id)}
                      style={{
                        padding: '8px 12px',
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
