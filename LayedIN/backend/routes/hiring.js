const express = require('express');
const { body, validationResult } = require('express-validator');
const HiringPost = require('../models/HiringPost');
const { protect, optionalAuth } = require('../middleware/auth');
const { fetchExternalJobs } = require('../utils/externalJobs');

const router = express.Router();

// @route   GET /api/hiring
// @desc    Get all active hiring posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      company,
      location,
      remoteType,
      jobType,
      experienceLevel,
      skills,
      visaSponsorship,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    
    // Build query
    let queryObj = { 
      isActive: true,
      expiresAt: { $gte: new Date() }
    };
    
    // Text search
    if (search) {
      queryObj.$text = { $search: search };
    }
    
    // Company filter
    if (company) {
      queryObj.company = new RegExp(company, 'i');
    }
    
    // Location filter
    if (location) {
      queryObj.location = new RegExp(location, 'i');
    }
    
    // Remote type filter
    if (remoteType) {
      const remoteArray = remoteType.split(',').map(r => r.trim());
      queryObj.remoteType = { $in: remoteArray };
    }
    
    // Job type filter
    if (jobType) {
      const jobTypeArray = jobType.split(',').map(j => j.trim());
      queryObj.jobType = { $in: jobTypeArray };
    }
    
    // Experience level filter
    if (experienceLevel) {
      const expArray = experienceLevel.split(',').map(e => e.trim());
      queryObj.experienceLevel = { $in: expArray };
    }
    
    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      queryObj.skills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }
    
    // Visa sponsorship filter
    if (visaSponsorship === 'true') {
      queryObj.visaSponsorship = true;
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Sort
    const sortOptions = {};
    if (search) {
      sortOptions.score = { $meta: 'textScore' };
    }
    sortOptions.isFeatured = -1; // Featured first
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    
    // Execute query
    let postsQuery = HiringPost.find(queryObj);
    
    if (search) {
      postsQuery = postsQuery.select({ score: { $meta: 'textScore' } });
    }
    
    const posts = await postsQuery
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    // Get total count
    const total = await HiringPost.countDocuments(queryObj);
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get hiring posts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/hiring/featured
// @desc    Get featured hiring posts
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const posts = await HiringPost.find({ 
      isActive: true, 
      isFeatured: true,
      expiresAt: { $gte: new Date() }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Get featured posts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/hiring/latest
// @desc    Get latest hiring posts
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    const posts = await HiringPost.find({ 
      isActive: true,
      expiresAt: { $gte: new Date() }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Get latest posts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/hiring/external/jobs
// @desc    Get jobs from external job boards
// @access  Public
router.get('/external/jobs', async (req, res) => {
  try {
    const externalJobs = await fetchExternalJobs();
    res.json({
      success: true,
      data: externalJobs,
      source: 'external'
    });
  } catch (error) {
    console.error('Error fetching external jobs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch external jobs' 
    });
  }
});

// @route   GET /api/hiring/:id
// @desc    Get single hiring post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await HiringPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hiring post not found' 
      });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get hiring post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/hiring
// @desc    Create hiring post (anyone can post)
// @access  Public (but can attach to account if logged in)
router.post('/', optionalAuth, [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('authorName').trim().notEmpty().withMessage('Your name is required'),
  body('authorEmail').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const postData = { ...req.body };
    
    // Attach to user if logged in
    if (req.user) {
      postData.author = req.user._id;
    }
    
    const post = await HiringPost.create(postData);
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Create hiring post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/hiring/:id
// @desc    Update hiring post
// @access  Private (only author)
router.put('/:id', protect, async (req, res) => {
  try {
    let post = await HiringPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hiring post not found' 
      });
    }
    
    // Check ownership
    if (post.author && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this post' 
      });
    }
    
    const updateData = { ...req.body };
    delete updateData.author;
    delete updateData.views;
    delete updateData.applications;
    
    post = await HiringPost.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Update hiring post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/hiring/:id
// @desc    Delete hiring post
// @access  Private (only author)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await HiringPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hiring post not found' 
      });
    }
    
    // Check ownership
    if (post.author && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this post' 
      });
    }
    
    await HiringPost.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Hiring post deleted successfully'
    });
  } catch (error) {
    console.error('Delete hiring post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/hiring/:id/apply
// @desc    Track application click
// @access  Public
router.post('/:id/apply', async (req, res) => {
  try {
    const post = await HiringPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { applications: 1 } },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hiring post not found' 
      });
    }
    
    res.json({
      success: true,
      data: { applicationUrl: post.applicationUrl, applicationEmail: post.applicationEmail }
    });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
