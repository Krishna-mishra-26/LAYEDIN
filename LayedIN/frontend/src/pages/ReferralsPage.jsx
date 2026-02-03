import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Building2, Mail, Linkedin, Users, Filter, 
  ChevronDown, ChevronUp, X, Gift, Clock, Loader2, ExternalLink, FileText, ArrowLeft
} from 'lucide-react';
import { referralsAPI } from '../lib/api';
import { format } from 'date-fns';

export default function ReferralsPage() {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState({ totalReferrals: 0, totalCompanies: 0, topCompanies: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [requestModal, setRequestModal] = useState({ show: false, referral: null });
  const [requestForm, setRequestForm] = useState({
    position: '',
    yoe: '',
    jobId: '',
    jobLink: '',
    resumeLink: '',
    visaStatus: '',
    readyToRelocate: ''
  });
  const [filters, setFilters] = useState({
    search: '',
    company: ''
  });

  const fetchReferrals = useCallback(async (currentFilters, page = 1) => {
    setIsLoading(true);
    try {
      const params = { ...currentFilters, page, limit: 12 };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await referralsAPI.getAll(params);
      setReferrals(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await referralsAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchReferrals(filters);
    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReferrals(filters, 1);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchReferrals(newFilters, 1);
  };

  const clearFilters = () => {
    const clearedFilters = { search: '', company: '' };
    setFilters(clearedFilters);
    fetchReferrals(clearedFilters, 1);
  };

  const handlePageChange = (page) => {
    fetchReferrals(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => value && key !== 'search');

  const openRequestModal = (referral) => {
    setRequestModal({ show: true, referral });
    setRequestForm({
      position: '',
      yoe: '',
      jobId: '',
      jobLink: '',
      resumeLink: '',
      visaStatus: '',
      readyToRelocate: ''
    });
  };

  const closeRequestModal = () => {
    setRequestModal({ show: false, referral: null });
  };

  const handleRequestFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  const submitReferralRequest = async (e) => {
    e.preventDefault();
    const referral = requestModal.referral;
    if (!referral) return;

    // Build email body with form data
    const subject = encodeURIComponent(`Referral Request - ${referral.company}`);
    const body = encodeURIComponent(
      `Hi ${referral.providerName},\n\n` +
      `I found your referral offer on LayedIn and I'm interested in opportunities at ${referral.company}.\n\n` +
      `Here are my details:\n\n` +
      `Position: ${requestForm.position || 'N/A'}\n` +
      `Years of Experience: ${requestForm.yoe || 'N/A'}\n` +
      `JOB ID: ${requestForm.jobId || 'N/A'}\n` +
      `JOB LINK: ${requestForm.jobLink || 'N/A'}\n` +
      `Resume Link: ${requestForm.resumeLink || 'N/A'}\n` +
      `Visa Status: ${requestForm.visaStatus || 'N/A'}\n` +
      `Ready to Relocate: ${requestForm.readyToRelocate || 'N/A'}\n\n` +
      `Thank you for offering to help the community!\n\n` +
      `Best regards`
    );
    
    window.open(`mailto:${referral.providerEmail}?subject=${subject}&body=${body}`, '_blank');
    
    // Track the request
    try {
      await referralsAPI.request(referral._id);
    } catch (error) {
      console.error('Error tracking referral request:', error);
    }

    closeRequestModal();
  };

  // Check if notes have multiple lines (more than 3 lines)
  const shouldShowReadMore = (notes) => {
    if (!notes) return false;
    const lineCount = (notes.match(/\n/g) || []).length + 1;
    return lineCount > 3 || notes.length > 150;
  };

  return (
    <div className="min-h-screen py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4 sm:mb-6 cursor-pointer text-sm sm:text-base"
        >
          <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          Back to home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs sm:text-sm mb-4 sm:mb-6">
              <Gift size={14} className="sm:w-4 sm:h-4" />
              <span>Community Referrals</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              Get a <span className="gradient-text">Referral</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
              Connect with employees at top companies who are offering referrals to help 
              laid-off professionals land their next opportunity.
            </p>
            <Link 
              to="/provide-referral" 
              className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6"
            >
              <Gift size={16} className="sm:w-[18px] sm:h-[18px]" />
              Offer Referrals
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="card text-center p-4 sm:p-6">
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalReferrals}</div>
              <div className="text-xs sm:text-sm text-neutral-400">Active Referrals</div>
            </div>
            <div className="card text-center p-4 sm:p-6">
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalCompanies}</div>
              <div className="text-xs sm:text-sm text-neutral-400">Companies</div>
            </div>
            <div className="card text-center col-span-2 md:col-span-1 p-4 sm:p-6">
              <div className="text-xs sm:text-sm font-medium text-white mb-1">Top Companies</div>
              <div className="flex flex-wrap justify-center gap-1">
                {stats.topCompanies.slice(0, 3).map((c, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-neutral-700 rounded text-neutral-300">
                    {c._id}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="card mb-6 sm:mb-8 p-4 sm:p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by company, role..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input-field pl-12 text-sm sm:text-base"
                />
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto">
                Search
              </button>
            </form>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors text-sm sm:text-base"
              >
                <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Filters</span>
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <X size={12} className="sm:w-[14px] sm:h-[14px]" />
                  Clear Filters
                </button>
              )}
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-700"
              >
                <div className="max-w-xs">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={filters.company}
                    onChange={(e) => handleFilterChange('company', e.target.value)}
                    placeholder="e.g., Google"
                    className="input-field"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Referrals Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="flex gap-3 mb-4">
                    <div className="w-12 h-12 skeleton rounded-xl" />
                    <div className="flex-1">
                      <div className="h-5 w-32 skeleton mb-2" />
                      <div className="h-4 w-24 skeleton" />
                    </div>
                  </div>
                  <div className="h-4 w-full skeleton mb-2" />
                  <div className="h-4 w-3/4 skeleton" />
                </div>
              ))}
            </div>
          ) : referrals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {referrals.map((referral, index) => (
                <motion.div
                  key={referral._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="card-hover"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {referral.companyLogo ? (
                        <img 
                          src={referral.companyLogo} 
                          alt={referral.company}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Building2 size={20} className="text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{referral.company}</h3>
                      <p className="text-sm text-neutral-400 truncate">
                        {referral.providerName} {referral.position && `• ${referral.position}`}
                      </p>
                    </div>
                  </div>



                  {/* Notes with Read More */}
                  {referral.notes && (
                    <div className="mb-4">
                      <p className={`text-sm text-neutral-300 whitespace-pre-line ${!expandedNotes[referral._id] ? 'line-clamp-3' : ''}`}>
                        {referral.notes}
                      </p>
                      {shouldShowReadMore(referral.notes) && (
                        <button
                          onClick={() => setExpandedNotes(prev => ({ ...prev, [referral._id]: !prev[referral._id] }))}
                          className="text-xs text-purple-400 hover:text-purple-300 mt-1 font-medium"
                        >
                          {expandedNotes[referral._id] ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-4 border-t border-neutral-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <Clock size={12} />
                        {format(new Date(referral.createdAt), 'MMM d')}
                      </span>
                      {referral.providerLinkedin && (
                        <a
                          href={referral.providerLinkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2] hover:bg-[#004182] rounded-lg transition-colors text-white text-xs font-medium"
                        >
                          <Linkedin size={14} />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => openRequestModal(referral)}
                      className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 font-medium"
                    >
                      <Mail size={16} />
                      Request Referral
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No referrals found</h3>
              <p className="text-neutral-400 mb-4">Be the first to offer referrals for your company!</p>
              <Link to="/provide-referral" className="btn-primary inline-flex items-center gap-2">
                <Gift size={18} />
                Offer Referrals
              </Link>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary py-2 px-4 disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  let pageNum = i + 1;
                  if (pagination.pages > 5) {
                    if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-neutral-600 text-white'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="btn-secondary py-2 px-4 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>

        {/* Request Referral Modal */}
        {requestModal.show && requestModal.referral && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Request Referral</h3>
                    <p className="text-sm text-neutral-400 mt-1">
                      {requestModal.referral.company} • {requestModal.referral.providerName}
                    </p>
                  </div>
                  <button
                    onClick={closeRequestModal}
                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-neutral-400" />
                  </button>
                </div>

                <form onSubmit={submitReferralRequest} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Position *
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={requestForm.position}
                        onChange={handleRequestFormChange}
                        required
                        placeholder="e.g., Software Engineer"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Years of Experience *
                      </label>
                      <input
                        type="text"
                        name="yoe"
                        value={requestForm.yoe}
                        onChange={handleRequestFormChange}
                        required
                        placeholder="e.g., 5"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Job ID
                    </label>
                    <input
                      type="text"
                      name="jobId"
                      value={requestForm.jobId}
                      onChange={handleRequestFormChange}
                      placeholder="e.g., JOB-12345"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Job Link
                    </label>
                    <div className="relative">
                      <ExternalLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                      <input
                        type="url"
                        name="jobLink"
                        value={requestForm.jobLink}
                        onChange={handleRequestFormChange}
                        placeholder="https://careers.company.com/job/..."
                        className="input-field pl-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Resume Link
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                      <input
                        type="url"
                        name="resumeLink"
                        value={requestForm.resumeLink}
                        onChange={handleRequestFormChange}
                        placeholder="https://drive.google.com/... or PDF link"
                        className="input-field pl-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Visa Status
                    </label>
                    <select
                      name="visaStatus"
                      value={requestForm.visaStatus}
                      onChange={handleRequestFormChange}
                      className="input-field"
                    >
                      <option value="">Select work authorization</option>
                      <option value="Citizen">Citizen</option>
                      <option value="Permanent Resident">Permanent Resident</option>
                      <option value="Work Permit">Work Permit</option>
                      <option value="Work Visa">Work Visa</option>
                      <option value="Student Visa">Student Visa</option>
                      <option value="Dependent Visa">Dependent Visa</option>
                      <option value="Need Sponsorship">Need Sponsorship</option>
                      <option value="No Restrictions">No Restrictions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Ready to Relocate?
                    </label>
                    <select
                      name="readyToRelocate"
                      value={requestForm.readyToRelocate}
                      onChange={handleRequestFormChange}
                      className="input-field"
                    >
                      <option value="">Select option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Depends on location">Depends on location</option>
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={closeRequestModal}
                      className="btn-secondary flex-1 py-2.5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2"
                    >
                      <Mail size={18} />
                      Send Request
                    </button>
                  </div>
                </form>

                <p className="text-xs text-neutral-500 text-center mt-4">
                  This will open your email client with the details filled in
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
