import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages/:userId
// @access  Private
// Get all messages between current user and :userId
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/messages
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, content, problemId } = req.body;
    
    // In a real app, you'd verify if the two users have an active bid/problem together.
    
    const message = new Message({
      senderId: req.user.id,
      receiverId,
      problemId,
      content,
      isRead: false
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
