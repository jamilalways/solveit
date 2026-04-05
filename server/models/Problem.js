import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  budget: {
    min: Number,
    max: Number,
    exact: Number,
  },
  deadline: {
    type: Date,
    required: true,
  },
  attachments: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['Open', 'Assigned', 'In Progress', 'Completed', 'Disputed'],
    default: 'Open',
  },
  selectedBidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
  }
}, { timestamps: true });

export default mongoose.model('Problem', problemSchema);
