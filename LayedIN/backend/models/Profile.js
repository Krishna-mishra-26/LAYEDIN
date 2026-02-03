const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  description: String,
  location: String,
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time'
  }
});

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true
  },
  degree: String,
  field: String,
  startDate: Date,
  endDate: Date,
  grade: String
});

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Basic Info
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  headline: {
    type: String,
    maxlength: 200
  },
  bio: {
    type: String,
    maxlength: 2000
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  resumeUrl: {
    type: String,
    required: true
  },
  
  // Professional Info
  currentTitle: String,
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 50
  },
  skills: [{
    type: String,
    trim: true
  }],
  industries: [{
    type: String,
    trim: true
  }],
  
  // Layoff Info
  layoffCompany: {
    type: String,
    required: true
  },
  layoffDate: {
    type: Date,
    required: true
  },
  layoffReason: {
    type: String,
    default: 'Restructuring'
  },
  
  // Work Status
  currentStatus: {
    type: String,
    enum: ['Actively Looking', 'Open to Opportunities', 'Employed', 'Freelancing', 'Taking a Break'],
    default: 'Actively Looking'
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  preferredRoles: [String],
  lookingFor: [String],  // Target roles the user is looking for
  preferredLocations: [String],
  remotePreference: {
    type: String,
    enum: ['Remote Only', 'Hybrid', 'On-site', 'Flexible'],
    default: 'Flexible'
  },
  salaryExpectation: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  
  // Location & Visa
  country: {
    type: String,
    required: true
  },
  city: String,
  state: String,
  visaStatus: {
    type: String,
    enum: ['Citizen', 'Permanent Resident', 'Work Permit', 'Work Visa', 'Student Visa', 'Dependent Visa', 'Need Sponsorship', 'No Restrictions', 'Not Applicable'],
    default: 'Not Applicable'
  },
  willingToRelocate: {
    type: Boolean,
    default: false
  },
  
  // Contact Info & Privacy
  contactInfo: {
    email: {
      value: String,
      isVisible: {
        type: Boolean,
        default: true
      }
    },
    phone: {
      value: String,
      isVisible: {
        type: Boolean,
        default: false
      }
    },
    linkedin: {
      value: String,
      isVisible: {
        type: Boolean,
        default: true
      }
    },
    github: {
      value: String,
      isVisible: {
        type: Boolean,
        default: true
      }
    },
    portfolio: {
      value: String,
      isVisible: {
        type: Boolean,
        default: true
      }
    },
    twitter: {
      value: String,
      isVisible: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Experience & Education
  experience: [experienceSchema],
  education: [educationSchema],
  
  // Visibility Settings
  isPublic: {
    type: Boolean,
    default: true
  },
  showContactInfo: {
    type: Boolean,
    default: true
  },
  
  // Stats
  profileViews: {
    type: Number,
    default: 0
  },
  profileViewers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationBadges: [{
    type: String,
    enum: ['Email Verified', 'LinkedIn Verified', 'Company Verified']
  }],
  
  // Featured
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for search
profileSchema.index({ firstName: 'text', lastName: 'text', headline: 'text', bio: 'text', skills: 'text', currentTitle: 'text' });
profileSchema.index({ country: 1, city: 1 });
profileSchema.index({ skills: 1 });
profileSchema.index({ currentStatus: 1 });
profileSchema.index({ visaStatus: 1 });
profileSchema.index({ layoffCompany: 1 });
profileSchema.index({ createdAt: -1 });
profileSchema.index({ isPublic: 1 });

// Virtual for full name
profileSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to get public profile
profileSchema.methods.toPublicJSON = function() {
  const profile = this.toObject();
  
  // Filter contact info based on visibility
  if (profile.contactInfo) {
    Object.keys(profile.contactInfo).forEach(key => {
      if (!profile.contactInfo[key].isVisible) {
        delete profile.contactInfo[key].value;
      }
    });
  }
  
  // Hide salary if not visible
  if (profile.salaryExpectation && !profile.salaryExpectation.isVisible) {
    delete profile.salaryExpectation;
  }
  
  return profile;
};

module.exports = mongoose.model('Profile', profileSchema);
