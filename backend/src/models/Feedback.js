import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: ['Student', 'Staff']
  },
  canteen: {
    type: String,
    required: [true, 'Canteen is required'],
    trim: true
  },
  feedbackType: {
    type: String,
    required: [true, 'Feedback type is required'],
    enum: ['Food quality', 'Service', 'Cleanliness', 'Pricing', 'Suggestion']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
