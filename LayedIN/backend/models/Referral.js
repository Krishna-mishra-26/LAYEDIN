const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  // Referral Provider Info (minimal)
  providerName: {
    type: String,
    required: true,
    maxlength: 100
  },
  providerEmail: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  providerLinkedin: {
    type: String,
    match: [/linkedin\.com/, 'Please provide a valid LinkedIn URL']
  },
  
  // Company Info
  company: {
    type: String,
    required: true,
    maxlength: 100
  },
  companyLogo: String,
  position: {
    type: String,
    maxlength: 100
  },
  
  // Referral Details
  departments: [{
    type: String,
    maxlength: 50
  }],
  roles: [{
    type: String,
    maxlength: 100
  }],
  locations: [{
    type: String,
    maxlength: 100
  }],
  
  // Preferences
  experienceLevels: [{
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager', 'Director', 'VP', 'C-Level']
  }],
  remoteOk: {
    type: Boolean,
    default: true
  },
  visaSponsorshipAvailable: {
    type: Boolean,
    default: false
  },
  
  // Additional Info
  notes: {
    type: String,
    maxlength: 500
  },
  maxReferrals: {
    type: Number,
    default: 5,
    min: 1,
    max: 50
  },
  referralsUsed: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  
  // Verification (optional - for future)
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String
}, {
  timestamps: true
});

// Index for search
referralSchema.index({ company: 'text', roles: 'text', departments: 'text' });
referralSchema.index({ company: 1, isActive: 1 });
referralSchema.index({ createdAt: -1 });

// Virtual for availability
referralSchema.virtual('isAvailable').get(function() {
  return this.isActive && 
         this.referralsUsed < this.maxReferrals && 
         new Date() < this.expiresAt;
});

// Ensure virtuals are included in JSON
referralSchema.set('toJSON', { virtuals: true });
referralSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Referral', referralSchema);
