import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, Building2, Globe, ArrowRight, 
  Sparkles, Search, MessageSquare, CheckCircle, Zap, Gift
} from 'lucide-react';
import { profilesAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import ProfileCard from '../components/ProfileCard';
import SearchFilters from '../components/SearchFilters';
import { ProfileCardSkeleton } from '../components/LoadingSpinner';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [profiles, setProfiles] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    skills: '',
    country: '',
    visaStatus: '',
    remotePreference: '',
    layoffCompany: '',
    yearsOfExperienceMin: '',
    yearsOfExperienceMax: ''
  });

  const fetchProfiles = useCallback(async (currentFilters, page = 1) => {
    setIsLoading(true);
    try {
      const params = { ...currentFilters, page, limit: 12 };
      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const response = await profilesAPI.getAll(params);
      setProfiles(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await profilesAPI.getFilters();
      setFilterOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  // Initial load and when returning to home page
  useEffect(() => {
    // Only run when we're actually on the home page
    if (location.pathname !== '/') return;
    
    // Check if returning from profile page with saved page number
    const savedPage = sessionStorage.getItem('profilesPage');
    if (savedPage) {
      const pageNum = parseInt(savedPage);
      sessionStorage.removeItem('profilesPage');
      fetchProfiles(filters, pageNum);
      // Scroll to profiles section after a short delay
      setTimeout(() => {
        const profilesSection = document.getElementById('profiles');
        if (profilesSection) {
          profilesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      fetchProfiles(filters);
    }
    fetchFilterOptions();
  }, [location.pathname]); // Re-run when pathname changes

  // Auto-refresh filter options every 60 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFilterOptions();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProfiles(newFilters, 1);
  };

  const handlePageChange = (page) => {
    fetchProfiles(filters, page);
    // Scroll to profiles section
    setTimeout(() => {
      const profilesSection = document.getElementById('profiles');
      if (profilesSection) {
        profilesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Browse Unlimited Profiles',
      description: 'Access thousands of talented professionals. Search by skills, location, experience, and more.'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Direct Messaging',
      description: 'Connect directly with candidates through our built-in messaging system.'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Free Forever',
      description: 'No hidden fees. Browse and contact talent without any charges.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Post Hiring Opportunities',
      description: 'Share job openings instantly. Reach motivated professionals actively seeking new roles.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Effects */}
        <div className="hero-gradient-1 -top-48 -left-48" />
        <div className="hero-gradient-2 top-0 right-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neutral-900 via-blue-900/30 to-neutral-900 text-transparent bg-clip-text font-medium mb-6 border border-blue-500/30 shadow-lg shadow-blue-500/20">
                <Sparkles size={16} className="text-blue-400 drop-shadow-lg" />
                <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 bg-clip-text text-transparent font-semibold drop-shadow-lg">Connecting Talent with Opportunity</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Where <span className="gradient-text">Laid-Off Talent</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Meets <span className="gradient-text">Great Companies</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-neutral-400 mb-8 max-w-2xl mx-auto px-2"
            >
              Thousands of talented professionals from top tech companies are ready for their next opportunity. 
              Browse profiles, connect directly, and hire the best — completely free.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`grid gap-3 max-w-4xl mx-auto ${isAuthenticated ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'}`}
            >
              {!isAuthenticated && (
                <Link 
                  to="/register" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="flex flex-col items-center gap-2 px-3 py-3 sm:py-2 bg-emerald-900/50 text-white border border-emerald-700/50 rounded-xl font-medium hover:bg-emerald-800/50 transition-all hover:scale-105"
                >
                  <Users size={20} className="sm:w-4 sm:h-4" />
                  <span className="text-center text-xs sm:text-xs leading-tight">Create Your Profile</span>
                </Link>
              )}
              <Link 
                to="/#profiles" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('profiles')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-2 px-3 py-3 sm:py-2 bg-blue-900/50 border border-blue-700/50 text-white rounded-xl font-medium hover:bg-blue-800/50 transition-all hover:scale-105"
              >
                <Globe size={20} className="sm:w-4 sm:h-4" />
                <span className="text-center text-xs sm:text-xs leading-tight">Browse Talents</span>
              </Link>
              <Link 
                to="/referrals" 
                className="flex flex-col items-center gap-2 px-3 py-3 sm:py-2 bg-purple-900/50 border border-purple-700/50 text-white rounded-xl font-medium hover:bg-purple-800/50 transition-all hover:scale-105"
              >
                <Gift size={20} className="sm:w-4 sm:h-4" />
                <span className="text-center text-xs sm:text-xs leading-tight">Take or Offer Referral</span>
              </Link>
              <Link 
                to="/jobs" 
                className="flex flex-col items-center gap-2 px-3 py-3 sm:py-2 bg-cyan-900/50 border border-cyan-700/50 text-white rounded-xl font-medium hover:bg-cyan-800/50 transition-all hover:scale-105"
              >
                <Search size={20} className="sm:w-4 sm:h-4" />
                <span className="text-center text-xs sm:text-xs leading-tight">View Job Openings</span>
              </Link>
              <Link 
                to="/post-job" 
                className={`flex flex-col items-center gap-2 px-3 py-3 sm:py-2 bg-amber-900/50 border border-amber-700/50 text-white rounded-xl font-medium hover:bg-amber-800/50 transition-all hover:scale-105 ${!isAuthenticated ? '' : ''}`}
              >
                <Briefcase size={20} className="sm:w-4 sm:h-4" />
                <span className="text-center text-xs sm:text-xs leading-tight">Post a Job Opening</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Features Section */}
      <section className="py-16 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 glass rounded-2xl"
              >
                <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-neutral-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-500 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="py-16" id="profiles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Discover Talented Professionals
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Browse through profiles of skilled professionals from top tech companies. 
              Use our advanced search to find the perfect candidate.
            </p>
          </div>

          {/* Search & Filters */}
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            isLoading={isLoading}
          />

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-neutral-400">
              Showing <span className="text-white font-medium">{profiles.length}</span> of{' '}
              <span className="text-white font-medium">{pagination.total}</span> profiles
            </p>
          </div>

          {/* Profile Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProfileCardSkeleton key={i} />
              ))}
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile, index) => (
                <ProfileCard key={profile._id} profile={profile} index={index} currentPage={pagination.page} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No profiles found</h3>
              <p className="text-neutral-500">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 flex-wrap">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary py-1.5 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-0.5 sm:gap-1">
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-white text-black'
                          : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
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
                className="btn-secondary py-1.5 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {isAuthenticated ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-4">
                Explore More Opportunities
              </h2>
              <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
                Discover job openings, connect with other professionals, and leverage our referral network 
                to accelerate your career growth.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link 
                  to="/jobs" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
                >
                  View Job Openings <Briefcase size={20} />
                </Link>
                <Link 
                  to="/referrals" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
                >
                  Get Referrals <Gift size={20} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Find Your Next Opportunity?
              </h2>
              <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
                Create your profile and let companies find you. It takes less than 5 minutes 
                and your profile is visible to thousands of recruiters.
              </p>
              <Link to="/register" onClick={() => window.scrollTo(0, 0)} className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                Get Started for Free <ArrowRight size={20} />
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
