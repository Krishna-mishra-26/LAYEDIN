import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  MapPin, Building2, Calendar, Briefcase, GraduationCap,
  Globe, Linkedin, Github, Mail, Phone, ExternalLink,
  MessageSquare, ArrowLeft, Eye, CheckCircle, Clock,
  DollarSign, Plane, FileText, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { profilesAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { PageLoader } from '../components/LoadingSpinner';

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const hasFetched = useRef(false);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewers, setViewers] = useState(null);
  const [showViewers, setShowViewers] = useState(false);
  const [isLoadingViewers, setIsLoadingViewers] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  useEffect(() => {
    // Prevent double fetch in React StrictMode (development only)
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    fetchProfile();
    // Scroll to top when profile page loads
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await profilesAPI.getById(id);
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Profile not found');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchViewers = async () => {
    if (!isOwnProfile) return;
    setIsLoadingViewers(true);
    try {
      const response = await profilesAPI.getViewers(id);
      setViewers(response.data.data);
    } catch (error) {
      console.error('Error fetching viewers:', error);
      toast.error('Could not load profile viewers');
    } finally {
      setIsLoadingViewers(false);
    }
  };

  const handleMessage = () => {
    if (!isAuthenticated) {
      toast.error('Please login to send messages');
      navigate('/login');
      return;
    }
    navigate(`/messages/${profile.user}`);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!profile) {
    return null;
  }

  const statusColors = {
    'Actively Looking': 'bg-neutral-500/20 text-white border-neutral-500/30',
    'Open to Opportunities': 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30',
    'Employed': 'bg-neutral-600/20 text-neutral-400 border-neutral-600/30',
    'Freelancing': 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30',
    'Taking a Break': 'bg-neutral-700/20 text-neutral-400 border-neutral-600/30',
  };

  const isOwnProfile = user?._id === profile.user;

  // Currency symbol helper
  const getCurrencySymbol = (currency) => {
    const symbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CNY': '¥'
    };
    return symbols[currency] || currency;
  };

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => {
            // Navigate back to home page with profiles section anchor
            navigate('/', { replace: false });
            // Scroll to profiles section after navigation
            setTimeout(() => {
              const profilesSection = document.getElementById('profiles');
              if (profilesSection) {
                profilesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4 sm:mb-6 cursor-pointer text-sm sm:text-base"
        >
          <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          Back to profiles
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Card */}
          <div className="card mb-4 sm:mb-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Photo */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0 ring-4 ring-neutral-500/20 mx-auto sm:mx-0">
                {profile.profilePhoto ? (
                  <img 
                    src={profile.profilePhoto} 
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}${profile.lastName}${profile._id}`}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-lg sm:text-xl text-neutral-400 mb-2">
                      {profile.currentTitle || profile.headline}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-neutral-500 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="sm:w-4 sm:h-4 text-neutral-400" />
                        {profile.city && `${profile.city}, `}{profile.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 size={14} className="sm:w-4 sm:h-4 text-neutral-400" />
                        Ex-{profile.layoffCompany}
                      </span>
                      {profile.yearsOfExperience && (
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} className="sm:w-4 sm:h-4 text-neutral-400" />
                          {profile.yearsOfExperience}+ years
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border bg-blue-500/20 text-blue-300 border-blue-500/30">
                      <Globe size={14} className="mr-1.5" />
                      {profile.remotePreference || 'Flexible'}
                    </span>
                    {profile.profileViews > 0 && isOwnProfile && (
                      <button
                        onClick={() => {
                          setShowViewers(!showViewers);
                          if (!viewers && !showViewers) {
                            fetchViewers();
                          }
                        }}
                        className="text-neutral-500 hover:text-white text-sm flex items-center gap-1 justify-center transition-colors"
                      >
                        <Eye size={14} />
                        {profile.profileViews} views
                      </button>
                    )}
                    {profile.profileViews > 0 && !isOwnProfile && (
                      <span className="text-neutral-500 text-sm flex items-center gap-1 justify-center">
                        <Eye size={14} />
                        {profile.profileViews} views
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mt-4 sm:mt-6">
                  {!isOwnProfile && (
                    <button onClick={handleMessage} className="btn-primary flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6">
                      <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Send Message
                    </button>
                  )}
                  {isOwnProfile && (
                    <Link to="/edit-profile" className="btn-primary flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6">
                      Edit Profile
                    </Link>
                  )}
                  
                  {/* Resume Link */}
                  {profile.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6"
                    >
                      <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Resume
                    </a>
                  )}
                  
                  {/* Contact Links */}
                  {profile.contactInfo?.linkedin?.isVisible && profile.contactInfo?.linkedin?.value && (
                    <a
                      href={profile.contactInfo.linkedin.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6"
                    >
                      <Linkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
                      LinkedIn
                    </a>
                  )}
                  {profile.contactInfo?.github?.isVisible && profile.contactInfo?.github?.value && (
                    <a
                      href={profile.contactInfo.github.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6"
                    >
                      <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
                      GitHub
                    </a>
                  )}
                  {profile.contactInfo?.portfolio?.isVisible && profile.contactInfo?.portfolio?.value && (
                    <a
                      href={profile.contactInfo.portfolio.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2 text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6"
                    >
                      <Globe size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Viewers Modal */}
          {isOwnProfile && showViewers && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card mb-6 bg-neutral-800/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye size={20} className="text-neutral-400" />
                  Who's viewed your profile
                </h3>
                <button
                  onClick={() => setShowViewers(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {isLoadingViewers ? (
                <p className="text-neutral-400 text-center py-4">Loading viewers...</p>
              ) : viewers && viewers.viewers && viewers.viewers.length > 0 ? (
                <div className="space-y-3">
                  {viewers.viewers.map((viewer) => (
                    <Link
                      key={viewer.userId}
                      to={`/profile/${viewer.userId}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {viewer.profilePhoto ? (
                          <img src={viewer.profilePhoto} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${viewer.firstName}${viewer.lastName}${viewer.userId}`}
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {viewer.firstName} {viewer.lastName}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">
                          {viewer.currentTitle || 'Profile not complete'}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {format(new Date(viewer.viewedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400 text-center py-4">No profile views yet</p>
              )}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {profile.bio && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                  <p className="text-neutral-400 whitespace-pre-line">{profile.bio}</p>
                </div>
              )}

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.slice(0, showAllSkills ? profile.skills.length : 6).map((skill, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1.5 bg-neutral-500/10 text-neutral-300 rounded-lg text-sm font-medium border border-neutral-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {profile.skills.length > 6 && (
                    <button
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      {showAllSkills ? 'Show less' : `+${profile.skills.length - 6} more skills`}
                    </button>
                  )}
                </div>
              )}

              {/* Experience */}
              {profile.experience && profile.experience.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-white mb-4">Experience</h2>
                  <div className="space-y-6">
                    {profile.experience.map((exp, i) => {
                      // Calculate duration
                      const startDate = new Date(exp.startDate);
                      const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate);
                      const diffMs = endDate - startDate;
                      const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));
                      const years = Math.floor(diffMonths / 12);
                      const months = diffMonths % 12;
                      let duration = '';
                      if (years > 0) duration += `${years} yr${years > 1 ? 's' : ''} `;
                      if (months > 0) duration += `${months} mo${months > 1 ? 's' : ''}`;
                      if (!duration) duration = '< 1 mo';
                      
                      return (
                      <div key={i} className="relative pl-6 border-l-2 border-neutral-500/30">
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-neutral-400" />
                        <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                        <p className="text-neutral-300 font-medium">{exp.company}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {format(new Date(exp.startDate), 'MMM yyyy')} - {' '}
                            {exp.isCurrent ? 'Present' : format(new Date(exp.endDate), 'MMM yyyy')}
                            <span className="text-neutral-400 ml-1">· {duration}</span>
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {exp.location}
                            </span>
                          )}
                          {exp.employmentType && (
                            <span className="badge-secondary text-xs">
                              {exp.employmentType}
                            </span>
                          )}
                        </div>
                        {exp.description && (
                          <div className="text-neutral-400 mt-2 space-y-1">
                            {exp.description.split(/(?<=[.])\s*(?=–|-)/).map((line, idx) => (
                              <p key={idx} className="leading-relaxed">
                                {line.trim()}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                    })}
                  </div>
                </div>
              )}

              {/* Education */}
              {profile.education && profile.education.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-white mb-4">Education</h2>
                  <div className="space-y-4">
                    {profile.education.map((edu, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center flex-shrink-0">
                          <GraduationCap size={24} className="text-neutral-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{edu.institution}</h3>
                          <p className="text-neutral-400">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </p>
                          {edu.startDate && (
                            <p className="text-sm text-neutral-500">
                              {format(new Date(edu.startDate), 'yyyy')} - {' '}
                              {edu.endDate ? format(new Date(edu.endDate), 'yyyy') : 'Present'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {profile.contactInfo?.email?.isVisible && profile.contactInfo?.email?.value && (
                    <a
                      href={`mailto:${profile.contactInfo.email.value}`}
                      className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"
                    >
                      <Mail size={18} className="text-neutral-400" />
                      <span className="truncate">{profile.contactInfo.email.value}</span>
                    </a>
                  )}
                  {profile.contactInfo?.phone?.isVisible && profile.contactInfo?.phone?.value && (
                    <a
                      href={`tel:${profile.contactInfo.phone.value}`}
                      className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"
                    >
                      <Phone size={18} className="text-neutral-400" />
                      <span>{profile.contactInfo.phone.value}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Preferences */}
              <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
                <div className="space-y-4">
                  {profile.gender && (
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Gender</p>
                      <p className="text-neutral-300 flex items-center gap-2">
                        <User size={16} className="text-neutral-400" />
                        {profile.gender}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Remote Preference</p>
                    <p className="text-neutral-300 flex items-center gap-2">
                      <Globe size={16} className="text-neutral-400" />
                      {profile.remotePreference || 'Flexible'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Visa Status</p>
                    <p className="text-neutral-300 flex items-center gap-2">
                      <Plane size={16} className="text-neutral-400" />
                      {profile.visaStatus || 'Not specified'}
                    </p>
                  </div>

                  {profile.willingToRelocate && (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <CheckCircle size={16} />
                      <span>Willing to relocate - YES</span>
                    </div>
                  )}

                  {profile.availableFrom && (
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Available From</p>
                      <p className="text-neutral-300 flex items-center gap-2">
                        <Clock size={16} className="text-neutral-400" />
                        {format(new Date(profile.availableFrom), 'MMMM yyyy')}
                      </p>
                    </div>
                  )}

                  {profile.salaryExpectation?.isVisible && profile.salaryExpectation?.min && (
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">Salary Expectation</p>
                      <p className="text-neutral-300 flex items-center gap-2">
                        <DollarSign size={16} className="text-neutral-400" />
                        {getCurrencySymbol(profile.salaryExpectation.currency)}{profile.salaryExpectation.min.toLocaleString()} - {getCurrencySymbol(profile.salaryExpectation.currency)}{profile.salaryExpectation.max?.toLocaleString() || 'N/A'} {profile.salaryExpectation.currency}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preferred Roles / Looking For */}
              {((profile.preferredRoles && profile.preferredRoles.length > 0) || (profile.lookingFor && profile.lookingFor.length > 0)) && (
                <div className="card">
                  <h2 className="text-lg font-semibold text-white mb-4">Looking For</h2>
                  <div className="flex flex-wrap gap-2">
                    {(profile.lookingFor || profile.preferredRoles).map((role, i) => (
                      <span key={i} className="badge-secondary text-xs">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Locations */}
              {profile.preferredLocations && profile.preferredLocations.length > 0 && (
                <div className="card">
                  <h2 className="text-lg font-semibold text-white mb-4">Preferred Locations</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredLocations.map((location, i) => (
                      <span key={i} className="badge-secondary text-xs flex items-center gap-1">
                        <MapPin size={12} />
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Layoff Info */}
              <div className="card bg-neutral-800/50">
                <h2 className="text-lg font-semibold text-white mb-4">Layoff Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500">Company</p>
                    <p className="text-neutral-300">{profile.layoffCompany}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Date</p>
                    <p className="text-neutral-300">
                      {format(new Date(profile.layoffDate), 'MMMM yyyy')}
                    </p>
                  </div>
                  {profile.layoffReason && (
                    <div>
                      <p className="text-sm text-neutral-500">Reason</p>
                      <p className="text-neutral-300">{profile.layoffReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
