const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Profile = require('../models/Profile');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/profiles
// @desc    Get all public profiles with advanced search
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      skills,
      country,
      city,
      visaStatus,
      currentStatus,
      remotePreference,
      yearsOfExperienceMin,
      yearsOfExperienceMax,
      layoffCompany,
      industries,
      sort = 'yearsOfExperience',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;
    
    // Build query
    let queryObj = { isPublic: true };
    let searchScoreAdded = false;
    
    // Fuzzy search with typo tolerance
    if (search) {
      const searchTerm = search.trim();
      // Create regex pattern for fuzzy matching - matches partial strings case-insensitively
      const searchRegex = new RegExp(searchTerm, 'i');
      
      // Search across multiple fields with $or operator
      queryObj.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { currentTitle: searchRegex },
        { headline: searchRegex },
        { skills: searchRegex },
        { layoffCompany: searchRegex },
        { industries: searchRegex },
        { city: searchRegex }
      ];
      searchScoreAdded = true;
    }
    
    // Skills filter (match any)
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      queryObj.skills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }
    
    // Location filters
    if (country) {
      queryObj.country = new RegExp(country, 'i');
    }
    if (city) {
      queryObj.city = new RegExp(city, 'i');
    }
    
    // Visa status filter
    if (visaStatus) {
      const visaArray = visaStatus.split(',').map(v => v.trim());
      queryObj.visaStatus = { $in: visaArray };
    }
    
    // Current status filter
    if (currentStatus) {
      const statusArray = currentStatus.split(',').map(s => s.trim());
      queryObj.currentStatus = { $in: statusArray };
    }
    
    // Remote preference filter
    if (remotePreference) {
      const remoteArray = remotePreference.split(',').map(r => r.trim());
      queryObj.remotePreference = { $in: remoteArray };
    }
    
    // Years of experience filter
    if (yearsOfExperienceMin || yearsOfExperienceMax) {
      queryObj.yearsOfExperience = {};
      if (yearsOfExperienceMin) {
        queryObj.yearsOfExperience.$gte = parseInt(yearsOfExperienceMin);
      }
      if (yearsOfExperienceMax) {
        queryObj.yearsOfExperience.$lte = parseInt(yearsOfExperienceMax);
      }
    }
    
    // Layoff company filter
    if (layoffCompany) {
      queryObj.layoffCompany = new RegExp(layoffCompany, 'i');
    }
    
    // Industries filter
    if (industries) {
      const industriesArray = industries.split(',').map(i => i.trim());
      queryObj.industries = { $in: industriesArray.map(i => new RegExp(i, 'i')) };
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Sort options - no text score since we're not using text search
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    
    // Execute query
    let profilesQuery = Profile.find(queryObj);
    
    const profiles = await profilesQuery
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    // Get total count
    const total = await Profile.countDocuments(queryObj);
    
    // Transform profiles for public view
    const publicProfiles = profiles.map(profile => {
      // Filter contact info based on visibility
      if (profile.contactInfo) {
        Object.keys(profile.contactInfo).forEach(key => {
          if (!profile.contactInfo[key]?.isVisible) {
            if (profile.contactInfo[key]) {
              delete profile.contactInfo[key].value;
            }
          }
        });
      }
      
      // Hide salary if not visible
      if (profile.salaryExpectation && !profile.salaryExpectation.isVisible) {
        delete profile.salaryExpectation;
      }
      
      return profile;
    });
    
    res.json({
      success: true,
      data: publicProfiles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/profiles/search-roles
// @desc    Get unique job titles/roles matching search query
// @access  Public
router.get('/search-roles', optionalAuth, async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = { isPublic: true };
    
    if (search) {
      const searchTerm = search.trim();
      const searchRegex = new RegExp(searchTerm, 'i');
      query.$or = [
        { currentTitle: searchRegex },
        { headline: searchRegex }
      ];
    }
    
    // Get distinct titles and count occurrences
    const roles = await Profile.aggregate([
      { $match: query },
      { $group: { 
        _id: '$currentTitle', 
        count: { $sum: 1 } 
      }},
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);
    
    // Format response
    const formattedRoles = roles.map(role => ({
      title: role._id,
      count: role.count
    }));
    
    res.json({
      success: true,
      data: formattedRoles
    });
  } catch (error) {
    console.error('Search roles error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/profiles/featured
// @desc    Get featured profiles
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const profiles = await Profile.find({ isPublic: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    
    res.json({
      success: true,
      data: profiles
    });
  } catch (error) {
    console.error('Get featured profiles error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/profiles/analytics
// @desc    Get comprehensive layoff analytics for dashboard
// @access  Public
router.get('/analytics', async (req, res) => {
  try {
    // Layoffs by month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const layoffsByMonth = await Profile.aggregate([
      { $match: { isPublic: true, layoffDate: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$layoffDate' },
            month: { $month: '$layoffDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format layoffs by month with month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const layoffTrend = layoffsByMonth.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      layoffs: item.count
    }));

    // Layoffs by company (top 10)
    const layoffsByCompany = await Profile.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$layoffCompany', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Layoffs by country (top 10)
    const layoffsByCountry = await Profile.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Gender distribution - Only Male & Female
    const genderDistribution = await Profile.aggregate([
      { $match: { isPublic: true, gender: { $in: ['Male', 'Female'] } } },
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Experience level distribution
    const experienceDistribution = await Profile.aggregate([
      { $match: { isPublic: true, yearsOfExperience: { $exists: true } } },
      {
        $bucket: {
          groupBy: '$yearsOfExperience',
          boundaries: [0, 2, 5, 10, 15, 50],
          default: 'Other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    const expLabels = {
      0: '0-2 years',
      2: '2-5 years',
      5: '5-10 years',
      10: '10-15 years',
      15: '15+ years'
    };

    const formattedExpDist = experienceDistribution
      .filter(item => item._id !== 'Other')
      .map(item => ({
        level: expLabels[item._id] || `${item._id}+ years`,
        count: item.count
      }));

    // Current status distribution
    const statusDistribution = await Profile.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$currentStatus', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Layoff reasons distribution
    const reasonsDistribution = await Profile.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$layoffReason', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Remote preference distribution
    const remoteDistribution = await Profile.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$remotePreference', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Top skills
    const topSkills = await Profile.aggregate([
      { $match: { isPublic: true } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // Summary stats
    const totalProfiles = await Profile.countDocuments({ isPublic: true });
    const activelyLooking = await Profile.countDocuments({ 
      isPublic: true, 
      currentStatus: 'Actively Looking' 
    });
    const companies = await Profile.distinct('layoffCompany', { isPublic: true });
    const countries = await Profile.distinct('country', { isPublic: true });

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await Profile.countDocuments({
      isPublic: true,
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalProfiles,
          activelyLooking,
          totalCompanies: companies.length,
          totalCountries: countries.length,
          recentRegistrations
        },
        layoffTrend,
        layoffsByCompany: layoffsByCompany.map(item => ({
          company: item._id || 'Unknown',
          count: item.count
        })),
        layoffsByCountry: layoffsByCountry.map(item => ({
          country: item._id || 'Unknown',
          count: item.count
        })),
        genderDistribution: genderDistribution.map(item => ({
          gender: item._id || 'Not specified',
          count: item.count
        })),
        experienceDistribution: formattedExpDist,
        statusDistribution: statusDistribution.map(item => ({
          status: item._id,
          count: item.count
        })),
        reasonsDistribution: reasonsDistribution.map(item => ({
          reason: item._id,
          count: item.count
        })),
        remoteDistribution: remoteDistribution.map(item => ({
          preference: item._id,
          count: item.count
        })),
        topSkills: topSkills.map(item => ({
          skill: item._id,
          count: item.count
        }))
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/profiles/stats
// @desc    Get platform statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalProfiles = await Profile.countDocuments({ isPublic: true });
    const activelyLooking = await Profile.countDocuments({ 
      isPublic: true, 
      currentStatus: 'Actively Looking' 
    });
    
    // Get unique companies
    const companies = await Profile.distinct('layoffCompany');
    
    // Get top skills
    const skillsAgg = await Profile.aggregate([
      { $match: { isPublic: true } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get top countries
    const countriesAgg = await Profile.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      data: {
        totalProfiles,
        activelyLooking,
        totalCompanies: companies.length,
        topSkills: skillsAgg,
        topCountries: countriesAgg
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/profiles/filters
// @desc    Get available filter options
// @access  Public
router.get('/filters', async (req, res) => {
  try {
    const [companies, countries, skills, industries] = await Promise.all([
      Profile.distinct('layoffCompany', { isPublic: true }),
      Profile.distinct('country', { isPublic: true }),
      Profile.aggregate([
        { $match: { isPublic: true } },
        { $unwind: '$skills' },
        { $group: { _id: '$skills' } },
        { $sort: { _id: 1 } },
        { $limit: 100 }
      ]),
      Profile.distinct('industries', { isPublic: true })
    ]);
    
    res.json({
      success: true,
      data: {
        companies: companies.filter(Boolean).sort(),
        countries: countries.filter(Boolean).sort(),
        skills: skills.map(s => s._id).filter(Boolean),
        industries: industries.filter(Boolean).sort(),
        visaStatuses: [
          'Citizen', 'Permanent Resident', 'Work Permit', 'Work Visa', 
          'Student Visa', 'Dependent Visa', 'Need Sponsorship', 'No Restrictions', 'Not Applicable'
        ],
        currentStatuses: [
          'Actively Looking', 'Open to Opportunities', 
          'Employed', 'Freelancing', 'Taking a Break'
        ],
        remotePreferences: ['Remote Only', 'Hybrid', 'On-site', 'Flexible']
      }
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/profiles/:id
// @desc    Get single profile by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).lean();
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }
    
    if (!profile.isPublic) {
      // Only allow owner to see private profile
      if (!req.user || req.user._id.toString() !== profile.user.toString()) {
        return res.status(404).json({ 
          success: false, 
          message: 'Profile not found' 
        });
      }
    }
    
    // Increment view count and track viewer (if not viewing own profile)
    if (!req.user || req.user._id.toString() !== profile.user.toString()) {
      // Add viewer to profileViewers array (avoid duplicates by checking if already viewed today)
      if (req.user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        await Profile.findByIdAndUpdate(
          req.params.id,
          {
            $inc: { profileViews: 1 },
            $addToSet: {
              profileViewers: {
                userId: req.user._id,
                viewedAt: new Date()
              }
            }
          }
        );
      } else {
        await Profile.findByIdAndUpdate(req.params.id, { 
          $inc: { profileViews: 1 } 
        });
      }
    }
    
    // Filter contact info for public view
    if (!req.user || req.user._id.toString() !== profile.user.toString()) {
      if (profile.contactInfo) {
        Object.keys(profile.contactInfo).forEach(key => {
          if (!profile.contactInfo[key]?.isVisible) {
            if (profile.contactInfo[key]) {
              delete profile.contactInfo[key].value;
            }
          }
        });
      }
      
      if (profile.salaryExpectation && !profile.salaryExpectation.isVisible) {
        delete profile.salaryExpectation;
      }
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/profiles
// @desc    Create profile
// @access  Private
router.post('/', protect, [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('layoffCompany').trim().notEmpty().withMessage('Layoff company is required'),
  body('layoffDate').isISO8601().withMessage('Valid layoff date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Profile already exists. Use PUT to update.' 
      });
    }
    
    // Create profile
    const profileData = {
      ...req.body,
      user: req.user._id
    };
    
    const profile = await Profile.create(profileData);
    
    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/profiles
// @desc    Update profile
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }
    
    // Update profile
    const updateData = { ...req.body };
    delete updateData.user; // Prevent changing user
    delete updateData.profileViews; // Prevent manipulating views
    
    profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/profiles
// @desc    Delete profile
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.user._id });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/profiles/:id/viewers
// @desc    Get list of users who viewed the profile
// @access  Private (only profile owner)
router.get('/:id/viewers', protect, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
      .populate('profileViewers.userId', 'email')
      .populate({
        path: 'profileViewers.userId',
        select: 'email'
      });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }
    
    // Check if user is the profile owner
    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to view profile viewers' 
      });
    }
    
    // Get profile info of viewers
    const User = require('../models/User');
    const viewersWithProfiles = await Promise.all(
      (profile.profileViewers || []).map(async (viewer) => {
        const viewerProfile = await Profile.findOne({ user: viewer.userId }).select('firstName lastName profilePhoto currentTitle');
        return {
          userId: viewer.userId._id,
          userEmail: viewer.userId.email,
          viewedAt: viewer.viewedAt,
          firstName: viewerProfile?.firstName,
          lastName: viewerProfile?.lastName,
          profilePhoto: viewerProfile?.profilePhoto,
          currentTitle: viewerProfile?.currentTitle
        };
      })
    );
    
    res.json({
      success: true,
      data: {
        viewCount: profile.profileViews,
        viewers: viewersWithProfiles.sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
      }
    });
  } catch (error) {
    console.error('Get profile viewers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
