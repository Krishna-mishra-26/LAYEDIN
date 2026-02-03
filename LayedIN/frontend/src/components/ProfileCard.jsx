import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Building2, Calendar, Briefcase, ExternalLink,
  Globe, Linkedin, Github, Mail, ChevronDown, FileText, Eye
} from 'lucide-react';
import { format } from 'date-fns';

export default function ProfileCard({ profile, index = 0, currentPage = 1 }) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const navigate = useNavigate();

	const handleClick = () => {
	  // Store current page before navigating
	  sessionStorage.setItem('profilesPage', currentPage.toString());
	};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card-hover group"
    >
      <Link to={`/profile/${profile._id}`} onClick={handleClick}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0 ring-1 ring-neutral-700">
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
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-neutral-300 transition-colors truncate">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm truncate">
                {profile.currentTitle || profile.headline}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-neutral-500">
                <MapPin size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span className="truncate">{profile.city ? `${profile.city}, ${profile.country}` : profile.country || 'Location not specified'}</span>
              </div>
            </div>
          </div>

          {/* Status Badge - Remote Preference */}
          {profile.remotePreference && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">
                {profile.remotePreference}
              </span>
            </div>
          )}

          {/* Info */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center gap-2 text-neutral-400">
              <Building2 size={14} className="flex-shrink-0 text-neutral-500" />
              <span className="truncate">Ex-{profile.layoffCompany}</span>
            </div>
            {profile.yearsOfExperience && (
              <div className="flex items-center gap-2 text-neutral-400">
                <Briefcase size={14} className="flex-shrink-0 text-neutral-500" />
                <span>{profile.yearsOfExperience}+ years experience</span>
              </div>
            )}
            {profile.layoffDate && (
              <div className="flex items-center gap-2 text-neutral-400">
                <Calendar size={14} className="flex-shrink-0 text-neutral-500" />
                <span>Available since {format(new Date(profile.layoffDate), 'MMM yyyy')}</span>
              </div>
            )}
            {profile.visaStatus && profile.visaStatus !== 'Not Applicable' && (
              <div className="flex items-center gap-2 text-neutral-400">
                <Globe size={14} className="flex-shrink-0 text-neutral-500" />
                <span className="text-xs">{profile.visaStatus}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.skills.slice(0, 4).map((skill, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 bg-neutral-900 rounded-lg text-xs text-neutral-300 border border-neutral-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              {profile.skills.length > 4 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAllSkills(!showAllSkills);
                  }}
                  className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  {showAllSkills ? 'Show Less' : `+${profile.skills.length - 4} more`}
                  <ChevronDown size={12} className={`transition-transform ${showAllSkills ? 'rotate-180' : ''}`} />
                </button>
              )}
              {showAllSkills && profile.skills.length > 4 && (
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-neutral-800">
                  {profile.skills.slice(4).map((skill, i) => (
                    <span 
                      key={i + 4}
                      className="px-2 py-1 bg-neutral-900 rounded-lg text-xs text-neutral-300 border border-neutral-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resume and Profile Views */}
          <div className="mb-4 flex flex-wrap gap-2">
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-900 rounded-lg text-xs text-neutral-300 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <FileText size={12} />
                Resume
              </a>
            )}
            {profile.viewCount > 0 && (
              <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-900 rounded-lg text-xs text-neutral-400 border border-neutral-800">
                <Eye size={12} />
                {profile.viewCount} views
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {profile.contactInfo?.linkedin?.isVisible && profile.contactInfo?.linkedin?.value && (
                <a 
                  href={profile.contactInfo.linkedin.value} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-neutral-600 hover:text-white transition-colors cursor-pointer"
                  title="Visit LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              )}
              {profile.contactInfo?.github?.isVisible && profile.contactInfo?.github?.value && (
                <a 
                  href={profile.contactInfo.github.value} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-neutral-600 hover:text-white transition-colors cursor-pointer"
                  title="Visit GitHub"
                >
                  <Github size={16} />
                </a>
              )}
              {profile.contactInfo?.portfolio?.isVisible && profile.contactInfo?.portfolio?.value && (
                <a 
                  href={profile.contactInfo.portfolio.value} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-neutral-600 hover:text-white transition-colors cursor-pointer"
                  title="Visit Portfolio"
                >
                  <Globe size={16} />
                </a>
              )}
              {profile.contactInfo?.email?.isVisible && profile.contactInfo?.email?.value && (
                <a 
                  href={`mailto:${profile.contactInfo.email.value}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-neutral-600 hover:text-white transition-colors cursor-pointer"
                  title="Send Email"
                >
                  <Mail size={16} />
                </a>
              )}
            </div>
            <span className="text-neutral-400 text-sm flex items-center gap-1 group-hover:gap-2 group-hover:text-white transition-all font-medium">
              View Profile <ExternalLink size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
