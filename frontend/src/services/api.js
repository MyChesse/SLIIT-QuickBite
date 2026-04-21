import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "unknown-url";

    if (status === 401) {
      localStorage.removeItem("token");
    }

    if (status) {
      console.error(`API Error ${status} at ${url}`);
    } else {
      console.error(`API Error at ${url}`);
    }
    return Promise.reject(error);
  },
);

export const feedbackAPI = {
  submitFeedback: async (feedbackData) => {
    const response = await api.post("/feedback", feedbackData);
    return response.data;
  },
  getAllFeedback: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/feedback?${params}`);
    return response.data;
  },
  getFeedbackById: async (id) => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },
  getFeedbackByEmail: async (email) => {
    const response = await api.get(`/feedback/email/${email}`);
    return response.data;
  },
  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  },
};

export const complaintAPI = {
  submitComplaint: async (complaintData, photoFile) => {
    const formData = new FormData();
    Object.keys(complaintData).forEach((key) => {
      formData.append(key, complaintData[key]);
    });
    if (photoFile) {
      formData.append("photo", photoFile);
    }
    const response = await api.post("/complaints", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getAllComplaints: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/complaints?${params}`);
    return response.data;
  },
  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },
  trackComplaint: async (complaintId) => {
    const response = await api.get(`/complaints/track/${complaintId}`);
    return response.data;
  },
  getComplaintsByEmail: async (email) => {
    const response = await api.get(`/complaints/email/${email}`);
    return response.data;
  },
  updateComplaintStatus: async (id, status) => {
    const response = await api.put(`/complaints/${id}/status`, { status });
    return response.data;
  },
  replyToComplaint: async (id, adminReply) => {
    const response = await api.put(`/complaints/${id}/reply`, { adminReply });
    return response.data;
  },
  deleteComplaint: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },
};

export const healthCheck = async () => {
  const response = await api.get("/health");
  return response.data;
};

export default api;
