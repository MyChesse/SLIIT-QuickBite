import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: false,
    unique: true,
    trim: true
  },
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
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food issue', 'Staff behavior', 'Delay', 'Hygiene', 'Wrong order', 'Payment issue', 'Other']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required']
  },
  photo: {
    type: String,
    default: null
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  adminReply: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Generate complaint ID before saving
complaintSchema.pre('save', async function(next) {
  if (this.isNew && !this.complaintId) {
    const lastComplaint = await this.constructor.findOne().sort('-complaintId').exec();
    let lastNumber = 0;
    
    if (lastComplaint && lastComplaint.complaintId) {
      const lastId = lastComplaint.complaintId;
      const match = lastId.match(/CMP-(\d+)/);
      if (match) {
        lastNumber = parseInt(match[1]);
      }
    }
    
    this.complaintId = `CMP-${String(lastNumber + 1).padStart(4, '0')}`;
  }
  next();
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
