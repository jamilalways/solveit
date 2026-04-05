import express from 'express';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/transactions/wallet
// @access  Private
router.get('/wallet', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ clientId: req.user.id }, { solverId: req.user.id }]
    }).sort({ createdAt: -1 });
    
    const user = await User.findById(req.user.id).select('walletBalance');

    res.json({ balance: user.walletBalance, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/transactions/deposit
// @access  Private (Client)
// Mock deposit for testing
router.post('/deposit', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const user = await User.findById(req.user.id);
    user.walletBalance += amount;
    await user.save();

    const transaction = new Transaction({
      clientId: req.user.id,
      amount,
      status: 'Completed',
      type: 'Deposit'
    });
    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
