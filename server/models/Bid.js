import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  solverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  proposedPrice: {
    type: Number,
    required: true,
  },
  deliveryTime: {
    type: Number, // in days
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  }
}, { timestamps: true });

export default mongoose.model('Bid', bidSchema);
