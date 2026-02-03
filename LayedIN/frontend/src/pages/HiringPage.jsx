import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Search, MapPin, Building2, DollarSign, Clock, 
  Briefcase, Globe, CheckCircle, ExternalLink, Filter,
  ChevronDown, ChevronUp, X, ArrowLeft
} from 'lucide-react';
import { hiringAPI } from '../lib/api';
import { ProfileCardSkeleton } from '../components/LoadingSpinner';

export default function HiringPage() {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    remoteType: '',
    jobType: '',
    experienceLevel: '',
    visaSponsorship: ''
  });

  const itemsPerPage = 10;

  const fetchJobs = useCallback(async (currentFilters) => {
    setIsLoading(true);
    setCurrentPage(1);
    try {
      // Fetch community posts (all without pagination)
      const params = { ...currentFilters, limit: 1000 };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const response = await hiringAPI.getAll(params);
      const communityJobs = response.data.data || [];

      // Fetch external jobs
      let externalJobsList = [];
      try {
        const externalResponse = await hiringAPI.getExternalJobs();
        externalJobsList = externalResponse.data.data || [];
      } catch (error) {
        console.error('Error fetching external jobs:', error);
      }

      // Combine all jobs
      const combined = [...communityJobs, ...externalJobsList];
      setAllJobs(combined);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(filters);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      remoteType: '',
      jobType: '',
      experienceLevel: '',
      visaSponsorship: ''
    };
    setFilters(clearedFilters);
    fetchJobs(clearedFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => value && key !== 'search');

  // Paginate jobs
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedJobs = allJobs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allJobs.length / itemsPerPage);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const expLevels = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager', 'Director', 'VP', 'C-Level'];
  const remoteTypes = ['Remote', 'Hybrid', 'On-site'];

  return (
    <div className="min-h-screen py-6 sm:py-12">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
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
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              Job <span className="gradient-text">Opportunities</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
              Browse job openings from companies looking to hire talented professionals.
              All positions are open to laid-off candidates.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/post-job" className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6">
                Post a Job Opening
              </Link>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="card mb-6 sm:mb-8 p-4 sm:p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Search jobs by title, company..."
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
                className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-700 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Work Type</label>
                  <select
                    value={filters.remoteType}
                    onChange={(e) => handleFilterChange('remoteType', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All</option>
                    {remoteTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Experience Level</label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All</option>
                    {expLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Visa Sponsorship</label>
                  <select
                    value={filters.visaSponsorship}
                    onChange={(e) => handleFilterChange('visaSponsorship', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any</option>
                    <option value="true">Offers Sponsorship</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Job Posts */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 skeleton rounded-xl" />
                    <div className="flex-1">
                      <div className="h-6 w-64 skeleton mb-2" />
                      <div className="h-4 w-48 skeleton mb-3" />
                      <div className="flex gap-4">
                        <div className="h-4 w-24 skeleton" />
                        <div className="h-4 w-24 skeleton" />
                        <div className="h-4 w-24 skeleton" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* All Jobs List */}
              {displayedJobs.length > 0 && (
                <div className="space-y-4 mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-neutral-400 text-sm">
                        Showing {startIndex + 1} - {Math.min(endIndex, allJobs.length)} of {allJobs.length} jobs
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {displayedJobs.map((job, index) => {
                      const isExternal = !job._id || job.url;
                      return (
                      <motion.div
                        key={isExternal ? `${job.company}-${index}` : job._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`card-hover ${isExternal ? 'border-l-2 border-amber-500/50' : ''}`}
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Company Logo */}
                          <div className={`w-16 h-16 rounded-xl bg-neutral-700 flex items-center justify-center flex-shrink-0 overflow-hidden ${isExternal ? 'ring-1 ring-neutral-600' : ''}`}>
                            {job.companyLogo ? (
                              <img 
                                src={job.companyLogo} 
                                alt={job.company}
                                className={`w-full h-full object-${isExternal ? 'contain p-2' : 'cover'}`}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : null}
                            {!job.companyLogo || !job.companyLogo.startsWith('http') ? (
                              <Building2 size={24} className="text-neutral-400" />
                            ) : null}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                              <div>
                                <h3 className="text-xl font-semibold text-white hover:text-neutral-300 transition-colors">
                                  {job.title}
                                </h3>
                                <p className="text-neutral-400 font-medium">{job.company}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {!isExternal && job.isFeatured && (
                                  <span className="badge-primary text-xs">Featured</span>
                                )}
                                {isExternal && (
                                  <span className="badge-primary text-xs">Featured</span>
                                )}
                                {job.visaSponsorship && (
                                  <span className="badge-success text-xs flex items-center gap-1">
                                    <CheckCircle size={12} />
                                    Visa Sponsorship
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Globe size={14} />
                                {job.remoteType}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase size={14} />
                                {job.jobType}
                              </span>
                              {isExternal ? (
                                job.salary && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign size={14} />
                                    {job.salary}
                                  </span>
                                )
                              ) : (
                                job.salary?.isVisible && job.salary?.min && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign size={14} />
                                    ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                                  </span>
                                )
                              )}
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {format(new Date(isExternal ? job.postedDate : job.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>

                            <p className="text-neutral-300 text-sm mb-4 line-clamp-2">
                              {isExternal ? job.description.slice(0, 200) : job.description.replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 200)}...
                            </p>

                            {job.skills && job.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {job.skills.slice(0, 5).map((skill, i) => (
                                  <span key={i} className="px-2 py-1 bg-neutral-700/50 rounded text-xs text-neutral-300">
                                    {skill}
                                  </span>
                                ))}
                                {job.skills.length > 5 && (
                                  <span className="px-2 py-1 bg-neutral-700/50 rounded text-xs text-neutral-400">
                                    +{job.skills.length - 5} more
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                              {isExternal ? (
                                <a
                                  href={job.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-primary py-2 px-4 text-sm inline-flex items-center gap-2"
                                >
                                  Apply Now <ExternalLink size={14} />
                                </a>
                              ) : (
                                <>
                                  {job.applicationUrl && (
                                    <a
                                      href={job.applicationUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                                    >
                                      Apply Now <ExternalLink size={14} />
                                    </a>
                                  )}
                                  {job.applicationEmail && (
                                    <a
                                      href={`mailto:${job.applicationEmail}`}
                                      className="btn-secondary py-2 px-4 text-sm"
                                    >
                                      Email to Apply
                                    </a>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                    })}
                  </div>
                </div>
              )}

              {/* No Jobs Found */}
              {allJobs.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-neutral-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
                  <p className="text-neutral-400 mb-4">Try adjusting your search or filters</p>
                  <Link to="/post-job" className="btn-primary inline-flex items-center gap-2">
                    Post a Job Opening
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary py-2 px-4 disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary py-2 px-4 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
