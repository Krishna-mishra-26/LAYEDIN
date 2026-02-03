const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      // Exclude conversations that the user has deleted
      $or: [
        { deletedBy: { $exists: false } },
        { deletedBy: { $nin: [req.user._id] } }
      ]
    })
      .populate({
        path: 'participants',
        select: '_id email'
      })
      .populate({
        path: 'lastMessage',
        select: 'content createdAt sender isRead'
      })
      .sort({ lastMessageAt: -1 });
    
    // Get profiles for participants
    const conversationsWithProfiles = await Promise.all(
      conversations.map(async (conv) => {
        const convObj = conv.toObject();
        const otherParticipant = conv.participants.find(
          p => p._id.toString() !== req.user._id.toString()
        );
        
        if (otherParticipant) {
          const profile = await Profile.findOne({ user: otherParticipant._id })
            .select('firstName lastName profilePhoto headline currentTitle');
          convObj.otherUser = {
            ...otherParticipant.toObject(),
            profile
          };
        }
        
        convObj.unreadCount = conv.unreadCount.get(req.user._id.toString()) || 0;
        // Check if this user has archived the conversation
        convObj.isArchived = conv.archivedBy && conv.archivedBy.some(
          id => id.toString() === req.user._id.toString()
        );
        
        return convObj;
      })
    );
    
    res.json({
      success: true,
      data: conversationsWithProfiles
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/messages/conversation/:userId
// @desc    Get or create conversation with a user
// @access  Private
router.get('/conversation/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] }
    });
    
    // Create new conversation if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, userId],
        unreadCount: new Map()
      });
    }
    
    // Get messages - exclude messages deleted by current user
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ],
      // Exclude messages deleted by current user
      $and: [
        {
          $or: [
            { deletedFor: { $exists: false } },
            { deletedFor: { $nin: [req.user._id] } }
          ]
        }
      ]
    })
      .sort({ createdAt: 1 })
      .limit(100);
    
    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    // Reset unread count
    conversation.unreadCount.set(req.user._id.toString(), 0);
    await conversation.save();
    
    // Get other user's profile
    const otherProfile = await Profile.findOne({ user: userId })
      .select('firstName lastName profilePhoto headline currentTitle');
    
    res.json({
      success: true,
      data: {
        conversation,
        messages,
        otherUser: otherProfile
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, [
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('content').trim().notEmpty().withMessage('Message content is required')
    .isLength({ max: 5000 }).withMessage('Message too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { receiverId, content } = req.body;
    
    // Create message
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content
    });
    
    // Update or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] }
    });
    
    if (conversation) {
      conversation.lastMessage = message._id;
      conversation.lastMessageAt = new Date();
      const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
      conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
      await conversation.save();
    } else {
      conversation = await Conversation.create({
        participants: [req.user._id, receiverId],
        lastMessage: message._id,
        lastMessageAt: new Date(),
        unreadCount: new Map([[receiverId.toString(), 1]])
      });
    }
    
    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get total unread message count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    
    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }
    
    message.isRead = true;
    message.readAt = new Date();
    await message.save();
    
    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/messages/:id
// @desc    Edit a message (sender only, within 5 minutes shows no edited tag)
// @access  Private
router.put('/:id', protect, [
  body('content').trim().notEmpty().withMessage('Message content is required')
    .isLength({ max: 5000 }).withMessage('Message too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    
    // Only sender can edit their message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to edit this message' 
      });
    }

    const { content } = req.body;
    const now = new Date();
    const messageAge = now - new Date(message.createdAt);
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    // Update message content
    message.content = content;
    message.isEdited = true;
    message.editedAt = now;
    
    // Only show "edited" tag if message was edited after 5 minutes
    message.showEditedTag = messageAge > fiveMinutes;
    
    await message.save();
    
    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/messages/:id/message
// @desc    Delete a single message (soft delete for the user)
// @access  Private
router.delete('/:id/message', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    
    // User must be sender or receiver
    const isSender = message.sender.toString() === req.user._id.toString();
    const isReceiver = message.receiver.toString() === req.user._id.toString();
    
    if (!isSender && !isReceiver) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Initialize deletedFor if not exists
    if (!message.deletedFor) {
      message.deletedFor = [];
    }
    
    // Add user to deletedFor if not already there
    if (!message.deletedFor.some(id => id.toString() === req.user._id.toString())) {
      message.deletedFor.push(req.user._id);
    }
    
    await message.save();
    
    res.json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PATCH /api/messages/:convId/archive
// @desc    Archive a conversation for current user
// @access  Private
router.patch('/:convId/archive', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.convId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    // Check if user is participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Initialize archivedBy if not exists
    if (!conversation.archivedBy) {
      conversation.archivedBy = [];
    }
    
    // Add user to archivedBy if not already there
    if (!conversation.archivedBy.includes(req.user._id)) {
      conversation.archivedBy.push(req.user._id);
    }
    
    await conversation.save();
    
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Archive error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PATCH /api/messages/:convId/unarchive
// @desc    Unarchive a conversation for current user
// @access  Private
router.patch('/:convId/unarchive', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.convId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    // Check if user is participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Remove user from archivedBy
    if (conversation.archivedBy) {
      conversation.archivedBy = conversation.archivedBy.filter(
        id => id.toString() !== req.user._id.toString()
      );
    }
    
    await conversation.save();
    
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Unarchive error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/messages/:convId
// @desc    Delete a conversation for current user (permanently removes from their view)
// @access  Private
router.delete('/:convId', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.convId);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    // Check if user is participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Initialize deletedBy if not exists
    if (!conversation.deletedBy) {
      conversation.deletedBy = [];
    }
    
    // Add user to deletedBy if not already there
    if (!conversation.deletedBy.some(id => id.toString() === req.user._id.toString())) {
      conversation.deletedBy.push(req.user._id);
    }
    
    await conversation.save();
    
    res.json({
      success: true,
      message: 'Conversation deleted'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
