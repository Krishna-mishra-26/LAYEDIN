import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gift, Building2, User, Mail, Linkedin, 
  CheckCircle, Loader2, Sparkles, ArrowLeft
} from 'lucide-react';
import { referralsAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';

// Popular company logos
const companyLogos = {
  'google': 'https://www.google.com/favicon.ico',
  'meta': 'https://www.facebook.com/favicon.ico',
  'amazon': 'https://www.amazon.com/favicon.ico',
  'apple': 'https://www.apple.com/favicon.ico',
  'microsoft': 'https://www.microsoft.com/favicon.ico',
  'netflix': 'https://www.netflix.com/favicon.ico',
  'stripe': 'https://stripe.com/favicon.ico',
  'airbnb': 'https://www.airbnb.com/favicon.ico',
  'uber': 'https://www.uber.com/favicon.ico',
  'linkedin': 'https://www.linkedin.com/favicon.ico',
  'salesforce': 'https://www.salesforce.com/favicon.ico',
  'tesla': 'https://www.tesla.com/favicon.ico',
  'twitter': 'https://twitter.com/favicon.ico',
  'x': 'https://twitter.com/favicon.ico',
  'adobe': 'https://www.adobe.com/favicon.ico',
  'spotify': 'https://www.spotify.com/favicon.ico',
  'snap': 'https://www.snapchat.com/favicon.ico',
  'snapchat': 'https://www.snapchat.com/favicon.ico',
  'oracle': 'https://www.oracle.com/favicon.ico',
  'ibm': 'https://www.ibm.com/favicon.ico',
  'intel': 'https://www.intel.com/favicon.ico',
  'nvidia': 'https://www.nvidia.com/favicon.ico',
  'paypal': 'https://www.paypal.com/favicon.ico',
  'dropbox': 'https://www.dropbox.com/favicon.ico',
  'slack': 'https://slack.com/favicon.ico',
  'zoom': 'https://zoom.us/favicon.ico',
  'shopify': 'https://www.shopify.com/favicon.ico',
  'pinterest': 'https://www.pinterest.com/favicon.ico',
  'doordash': 'https://www.doordash.com/favicon.ico',
  'coinbase': 'https://www.coinbase.com/favicon.ico',
  'robinhood': 'https://robinhood.com/favicon.ico'
};

export default function ProvideReferralPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    providerName: '',
    providerEmail: '',
    providerLinkedin: '',
    company: '',
    position: '',
    notes: ''
  });

  // Auto-fill form with user's profile data
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        providerName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        providerEmail: profile.contactInfo?.email?.value || '',
        providerLinkedin: profile.contactInfo?.linkedin?.value || '',
        company: profile.layoffCompany || '',
        position: profile.currentTitle || ''
      }));
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const getCompanyLogo = (company) => {
    const normalized = company.toLowerCase().replace(/[^a-z]/g, '');
    return companyLogos[normalized] || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Add company logo if available
      const companyLogo = getCompanyLogo(formData.company);
      const submitData = {
        ...formData,
        companyLogo
      };

      await referralsAPI.create(submitData);
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/referrals');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create referral. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-neutral-400 mb-4">
            Your referral offer has been published. Candidates will be able to reach out to you via email.
          </p>
          <p className="text-sm text-neutral-500">Redirecting to referrals page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/referrals')}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 cursor-pointer text-sm sm:text-base"
        >
          <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          Back to referrals
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-6">
              <Sparkles size={16} />
              <span>Help the Community</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Offer <span className="gradient-text">Referrals</span>
            </h1>
            <p className="text-neutral-400">
              Help laid-off professionals by offering referrals to your company. 
              It only takes a minute!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Basic Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User size={20} className="text-neutral-400" />
                Your Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="providerName"
                    value={formData.providerName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="providerEmail"
                    value={formData.providerEmail}
                    onChange={handleChange}
                    required
                    placeholder="john@company.com"
                    className="input-field"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Candidates will contact you here</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  LinkedIn Profile (optional)
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="url"
                    name="providerLinkedin"
                    value={formData.providerLinkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-neutral-400" />
                Company Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    placeholder="Google"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Your Position (optional)
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Senior Engineer"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Mail size={20} className="text-neutral-400" />
                Additional Info
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Notes for candidates (optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  placeholder="Any specific requirements or preferences for candidates reaching out..."
                  className="input-field resize-none"
                />
                <p className="text-xs text-neutral-500 mt-1">{formData.notes.length}/500</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Gift size={20} />
                  Publish Referral Offer
                </>
              )}
            </button>

            <p className="text-center text-sm text-neutral-500">
              Your referral offer will be active for 30 days. You can deactivate it anytime.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
