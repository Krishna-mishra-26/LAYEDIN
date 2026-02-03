const express = require('express');
const router = express.Router();
const Referral = require('../models/Referral');

// @route   GET /api/referrals
// @desc    Get all active referrals
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      company, 
      search,
      visaSponsorship,
      remote
    } = req.query;

    const query = { 
      isActive: true,
      expiresAt: { $gt: new Date() }
    };

    // Filter by company
    if (company) {
      query.company = new RegExp(company, 'i');
    }

    // Search in company, roles, departments
    if (search) {
      query.$or = [
        { company: new RegExp(search, 'i') },
        { roles: { $in: [new RegExp(search, 'i')] } },
        { departments: { $in: [new RegExp(search, 'i')] } },
        { providerName: new RegExp(search, 'i') }
      ];
    }

    // Filter by visa sponsorship
    if (visaSponsorship === 'true') {
      query.visaSponsorshipAvailable = true;
    }

    // Filter by remote
    if (remote === 'true') {
      query.remoteOk = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [referrals, total] = await Promise.all([
      Referral.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-verificationToken'),
      Referral.countDocuments(query)
    ]);

    // Filter out referrals that have used all their slots
    const availableReferrals = referrals.filter(r => r.referralsUsed < r.maxReferrals);

    res.json({
      success: true,
      data: availableReferrals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/referrals/stats
// @desc    Get referral statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const [totalReferrals, totalCompanies, referralsByCompany] = await Promise.all([
      Referral.countDocuments({ isActive: true, expiresAt: { $gt: new Date() } }),
      Referral.distinct('company', { isActive: true, expiresAt: { $gt: new Date() } }),
      Referral.aggregate([
        { $match: { isActive: true, expiresAt: { $gt: new Date() } } },
        { $group: { _id: '$company', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalReferrals,
        totalCompanies: totalCompanies.length,
        topCompanies: referralsByCompany
      }
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/referrals/companies
// @desc    Get list of companies offering referrals
// @access  Public
router.get('/companies', async (req, res) => {
  try {
    const companies = await Referral.aggregate([
      { $match: { isActive: true, expiresAt: { $gt: new Date() } } },
      { $group: { 
        _id: '$company', 
        count: { $sum: 1 },
        logo: { $first: '$companyLogo' }
      }},
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/referrals/:id
// @desc    Get single referral by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .select('-verificationToken');

    if (!referral) {
      return res.status(404).json({ success: false, message: 'Referral not found' });
    }

    res.json({ success: true, data: referral });
  } catch (error) {
    console.error('Error fetching referral:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/referrals
// @desc    Create a new referral (for referral providers)
// @access  Public (no auth required - minimal friction)
router.post('/', async (req, res) => {
  try {
    const {
      providerName,
      providerEmail,
      providerLinkedin,
      company,
      companyLogo,
      position,
      departments,
      roles,
      locations,
      experienceLevels,
      remoteOk,
      visaSponsorshipAvailable,
      notes,
      maxReferrals
    } = req.body;

    // Validate required fields
    if (!providerName || !providerEmail || !company) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and company are required' 
      });
    }

    // Check if this email already has an active referral for this company
    const existing = await Referral.findOne({
      providerEmail: providerEmail.toLowerCase(),
      company: new RegExp(`^${company}$`, 'i'),
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active referral listing for this company'
      });
    }

    const referral = new Referral({
      providerName,
      providerEmail: providerEmail.toLowerCase(),
      providerLinkedin,
      company,
      companyLogo,
      position,
      departments: departments || [],
      roles: roles || [],
      locations: locations || [],
      experienceLevels: experienceLevels || [],
      remoteOk: remoteOk !== false,
      visaSponsorshipAvailable: visaSponsorshipAvailable || false,
      notes,
      maxReferrals: maxReferrals || 5
    });

    await referral.save();

    res.status(201).json({
      success: true,
      message: 'Referral created successfully! Candidates can now reach out to you.',
      data: referral
    });
  } catch (error) {
    console.error('Error creating referral:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/referrals/:id/request
// @desc    Request a referral (increment referralsUsed)
// @access  Public
router.post('/:id/request', async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({ success: false, message: 'Referral not found' });
    }

    if (!referral.isAvailable) {
      return res.status(400).json({ 
        success: false, 
        message: 'This referral is no longer available' 
      });
    }

    referral.referralsUsed += 1;
    await referral.save();

    res.json({
      success: true,
      message: 'Referral request recorded',
      data: {
        providerEmail: referral.providerEmail,
        providerLinkedin: referral.providerLinkedin,
        remaining: referral.maxReferrals - referral.referralsUsed
      }
    });
  } catch (error) {
    console.error('Error requesting referral:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/referrals/:id
// @desc    Update a referral (by email verification)
// @access  Public (requires email match)
router.put('/:id', async (req, res) => {
  try {
    const { email, ...updateData } = req.body;

    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({ success: false, message: 'Referral not found' });
    }

    // Simple email verification
    if (referral.providerEmail !== email?.toLowerCase()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Email does not match the referral provider' 
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'providerLinkedin', 'position', 'departments', 'roles', 
      'locations', 'experienceLevels', 'remoteOk', 
      'visaSponsorshipAvailable', 'notes', 'maxReferrals', 'isActive'
    ];

    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        referral[field] = updateData[field];
      }
    });

    await referral.save();

    res.json({ success: true, data: referral });
  } catch (error) {
    console.error('Error updating referral:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/referrals/:id
// @desc    Deactivate a referral (by email verification)
// @access  Public (requires email match)
router.delete('/:id', async (req, res) => {
  try {
    const { email } = req.body;

    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({ success: false, message: 'Referral not found' });
    }

    // Simple email verification
    if (referral.providerEmail !== email?.toLowerCase()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Email does not match the referral provider' 
      });
    }

    referral.isActive = false;
    await referral.save();

    res.json({ success: true, message: 'Referral deactivated successfully' });
  } catch (error) {
    console.error('Error deleting referral:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
