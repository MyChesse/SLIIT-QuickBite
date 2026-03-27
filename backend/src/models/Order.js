import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({

  studentName: {
    type: String,
    required: true
  },

  studentId: {
    type: String,
    required: true
  },

  items: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],

  total: {
    type: Number,
    required: true,
    min: 0
  },

  pickupDate: {
    type: String,
    required: true
  },

  pickupTime: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: [
      'Pending',
      'Accepted',
      'Ready',
      'Completed',
      'Cancelled'
    ],
    default: 'Pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model('Order', OrderSchema);