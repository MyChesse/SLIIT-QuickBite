import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Feedback API calls
export const feedbackAPI = {
  // Submit feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  // Get all feedback (admin)
  getAllFeedback: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/feedback?${params}`);
    return response.data;
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },

  // Get feedback by email (user)
  getFeedbackByEmail: async (email) => {
    const response = await api.get(`/feedback/email/${email}`);
    return response.data;
  },

  // Delete feedback (admin)
  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  }
};

// Complaint API calls
export const complaintAPI = {
  // Submit complaint
  submitComplaint: async (complaintData, photoFile) => {
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(complaintData).forEach(key => {
      formData.append(key, complaintData[key]);
    });

    // Add photo if provided
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    const response = await api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get all complaints (admin)
  getAllComplaints: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/complaints?${params}`);
    return response.data;
  },

  // Get complaint by ID (admin)
  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  // Track complaint by complaintId (user)
  trackComplaint: async (complaintId) => {
    const response = await api.get(`/complaints/track/${complaintId}`);
    return response.data;
  },

  // Get complaints by email (user)
  getComplaintsByEmail: async (email) => {
    const response = await api.get(`/complaints/email/${email}`);
    return response.data;
  },

  // Update complaint status (admin)
  updateComplaintStatus: async (id, status) => {
    const response = await api.put(`/complaints/${id}/status`, { status });
    return response.data;
  },

  // Reply to complaint (admin)
  replyToComplaint: async (id, adminReply) => {
    const response = await api.put(`/complaints/${id}/reply`, { adminReply });
    return response.data;
  },

  // Delete complaint (admin)
  deleteComplaint: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  }
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
