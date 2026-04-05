import express from 'express';
import Problem from '../models/Problem.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/problems
// @access  Public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const problems = await Problem.find(filter).populate('clientId', 'name avatar rating').sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/problems/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('clientId', 'name avatar rating reviewCount')
      .populate('selectedBidId');
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/problems
// @access  Private (Client only allowed to post)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Client' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only clients can post problems' });
    }

    const problem = new Problem({
      ...req.body,
      clientId: req.user.id
    });

    const createdProblem = await problem.save();
    res.status(201).json(createdProblem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/problems/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    
    // Auth checking details can be robust here
    if (problem.clientId.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Not authorized' });
    }

    problem.status = req.body.status;
    const updated = await problem.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
