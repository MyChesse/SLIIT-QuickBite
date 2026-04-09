import { Feedback } from '../models/Feedback.js';
import mongoose from 'mongoose';

// Submit new feedback
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, userType, feedbackType, message, rating } = req.body;

    // Validate required fields
    if (!name || !email || !userType || !feedbackType || !message || !rating) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Create new feedback
    const feedback = new Feedback({
      name,
      email,
      userType,
      feedbackType,
      message,
      rating: parseInt(rating)
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all feedback (admin)
export const getAllFeedback = async (req, res) => {
  try {
    const { feedbackType, rating, userType } = req.query;
    
    // Build filter object
    const filter = {};
    if (feedbackType) filter.feedbackType = feedbackType;
    if (rating) filter.rating = parseInt(rating);
    if (userType) filter.userType = userType;

    const feedback = await Feedback.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Feedback retrieved successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID'
      });
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback retrieved successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete feedback (admin)
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID'
      });
    }

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get feedback by email (user)
export const getFeedbackByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const feedback = await Feedback.find({ email }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Feedback retrieved successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
