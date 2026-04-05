import express from 'express';
import Bid from '../models/Bid.js';
import Problem from '../models/Problem.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/bids/problem/:problemId
// @access  Private
router.get('/problem/:problemId', protect, async (req, res) => {
  try {
    const bids = await Bid.find({ problemId: req.params.problemId })
      .populate('solverId', 'name avatar rating level');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/bids
// @access  Private (Solver only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Solver' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only solvers can bid' });
    }

    const { problemId, proposedPrice, deliveryTime, message } = req.body;
    
    // Check if problem is open
    const problem = await Problem.findById(problemId);
    if (!problem || problem.status !== 'Open') {
        return res.status(400).json({ message: 'Problem is no longer open for bidding' });
    }

    const bid = new Bid({
      problemId,
      solverId: req.user.id,
      proposedPrice,
      deliveryTime,
      message,
    });

    const createdBid = await bid.save();
    res.status(201).json(createdBid);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/bids/:id/accept
// @access  Private (Client only)
router.put('/:id/accept', protect, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('problemId');
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    
    const problem = bid.problemId;
    if (problem.clientId.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Only the problem owner can accept a bid' });
    }

    bid.status = 'Accepted';
    await bid.save();

    problem.status = 'Assigned';
    problem.selectedBidId = bid._id;
    await problem.save();

    res.json({ message: 'Bid accepted', bid });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
