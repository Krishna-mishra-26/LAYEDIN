const mongoose = require('mongoose');

const hiringPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  authorName: {
    type: String,
    required: true
  },
  authorTitle: String,
  authorCompany: String,
  authorEmail: {
    type: String,
    required: true
  },
  authorLinkedin: String,
  
  // Job Details
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  company: {
    type: String,
    required: true
  },
  companyLogo: String,
  companyWebsite: String,
  
  description: {
    type: String,
    required: true,
    maxlength: 10000
  },
  
  // Job Info
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time'
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager', 'Director', 'VP', 'C-Level'],
    default: 'Mid Level'
  },
  
  // Location
  location: {
    type: String,
    required: true
  },
  remoteType: {
    type: String,
    enum: ['Remote', 'Hybrid', 'On-site'],
    default: 'Remote'
  },
  
  // Compensation
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  
  // Requirements
  skills: [String],
  requirements: [String],
  benefits: [String],
  
  // Visa
  visaSponsorship: {
    type: Boolean,
    default: false
  },
  
  // Application
  applicationUrl: String,
  applicationEmail: String,
  applicationDeadline: Date,
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Stats
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  
  // Tags
  tags: [String],
  
  // Expiry
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
  }
}, {
  timestamps: true
});

// Indexes
hiringPostSchema.index({ title: 'text', description: 'text', company: 'text', skills: 'text' });
hiringPostSchema.index({ isActive: 1, createdAt: -1 });
hiringPostSchema.index({ company: 1 });
hiringPostSchema.index({ location: 1 });
hiringPostSchema.index({ skills: 1 });
hiringPostSchema.index({ remoteType: 1 });
hiringPostSchema.index({ visaSponsorship: 1 });

module.exports = mongoose.model('HiringPost', hiringPostSchema);
