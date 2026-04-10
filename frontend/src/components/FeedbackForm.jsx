import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { feedbackAPI } from "../services/api.js";

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "Student",
    canteen: "Canteen 3",
    feedbackType: "Food quality",
    message: "",
    rating: 5,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && value !== "" && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    const nextValue = name === "email" ? value.toLowerCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      setError("Name can contain only letters and spaces");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (formData.email !== formData.email.toLowerCase()) {
      setError("Email must be lowercase");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!formData.canteen.trim()) {
      setError("Canteen selection is required");
      return false;
    }
    if (!formData.message.trim()) {
      setError("Message is required");
      return false;
    }
    if (formData.message.trim().length < 30) {
      setError("Message must be at least 30 characters");
      return false;
    }
    if (formData.rating < 1 || formData.rating > 5) {
      setError("Rating must be between 1 and 5");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await feedbackAPI.submitFeedback(formData);
      setSuccess("Feedback submitted successfully!");
      // Redirect back to support page after a short delay
      setTimeout(() => {
        navigate("/support");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Share Your Feedback
        </h2>
        <p className="text-gray-600">
          Help us improve canteen services with your ideas.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-100">
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          Overall Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-4xl transition-transform duration-150 hover:scale-110 focus:outline-none"
              style={{
                color:
                  (hoverRating || formData.rating) >= star
                    ? "#fbbf24"
                    : "#d1d5db",
              }}
            >
              ★
            </button>
          ))}
          <span className="ml-3 text-lg font-medium text-gray-600">
            {formData.rating}.0 / 5
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              pattern="[A-Za-z ]+"
              title="Name can contain only letters and spaces"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Category <span className="text-red-500">*</span>
            </label>
            <select
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            >
              <option value="Food quality">Food Quality</option>
              <option value="Service">Service</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Pricing">Pricing</option>
              <option value="Suggestion">Suggestion</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Canteen <span className="text-red-500">*</span>
          </label>
          <select
            name="canteen"
            value={formData.canteen}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
          >
            <option value="Choose the Canteen">Choose the Canteen</option>
            <option value="ABC">ABC</option>
            <option value="BCD">BCD</option>
            <option value="STU">STU</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            minLength={30}
            rows="5"
            title="Message must be at least 30 characters"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
            placeholder="Please share your detailed feedback here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl"
          }`}
        >
          {loading ? "Submitting Feedback..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
