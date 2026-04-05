import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  solverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Escrow', 'Released', 'Refunded', 'Completed'],
    default: 'Escrow',
  },
  type: {
    type: String,
    enum: ['Deposit', 'Payment', 'Withdrawal'],
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
