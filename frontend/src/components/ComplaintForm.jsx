import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api.js';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'Student',
    canteen: 'Main Canteen',
    category: 'Food issue',
    subject: '',
    description: '',
    issueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium'
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name' && value !== '' && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    const nextValue = name === 'email' ? value.toLowerCase() : value;

    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      setError('Name can contain only letters and spaces');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (formData.email !== formData.email.toLowerCase()) {
      setError('Email must be lowercase');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.canteen?.trim()) {
      setError('Canteen selection is required');
      return false;
    }
    if (!formData.userType?.trim()) {
      setError('User Type is required');
      return false;
    }
    if (!formData.category?.trim()) {
      setError('Complaint Category is required');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.issueDate) {
      setError('Issue date is required');
      return false;
    }
    if (formData.issueDate > today) {
      setError('Issue date cannot be in the future');
      return false;
    }
    if (!formData.priority?.trim()) {
      setError('Priority Level is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await complaintAPI.submitComplaint(formData, photoFile);
      setSuccess(`Complaint submitted successfully! Your complaint ID is: ${response.data.complaintId}`);
      // Redirect back to support page after a short delay
      setTimeout(() => {
        navigate('/support');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">File a Complaint</h2>
        <p className="text-gray-600">Report issues or problems that need immediate attention.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              pattern="[A-Za-z ]+"
              title="Name can contain only letters and spaces"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:sring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type <span className="text-red-500">*</span></label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            >
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Category <span className="text-red-500">*</span></label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            >
              <option value="Food issue">Food Issue</option>
              <option value="Staff behavior">Staff Behavior</option>
              <option value="Delay">Service Delay</option>
              <option value="Hygiene">Hygiene</option>
              <option value="Wrong order">Wrong Order</option>
              <option value="Payment issue">Payment Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Canteen <span className="text-red-500">*</span></label>
          <select
            name="canteen"
            value={formData.canteen}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
          >
            <option value="Main Canteen">Main Canteen • Basement Building</option>
            <option value="Hostel Canteen">Hostel Canteen • Hostel Block</option>
            <option value="Mini Canteen">Mini Canteen • Faculty Area</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Brief summary of your complaint"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
            placeholder="Please provide detailed information about the issue..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Issue <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              required
              max={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level <span className="text-red-500">*</span></label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Photo (Optional)</label>
          <div className="relative">
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {photoFile && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              📎 Selected: {photoFile.name}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 hover:scale-105 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? 'Submitting Complaint...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
