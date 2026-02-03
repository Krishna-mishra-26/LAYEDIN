import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Briefcase, MessageCircle, Eye, Edit, Plus,
  TrendingUp, Users, Building2, ArrowRight, Clock, Trash2, Gift
} from 'lucide-react';
import toast from 'react-hot-toast';
import { profilesAPI, hiringAPI, messagesAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profileViews: 0,
    totalMessages: 0,
    unreadMessages: 0,
    postedJobs: 0
  });
  const [myJobs, setMyJobs] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated]);

  // Refresh dashboard when user ID changes
  useEffect(() => {
    if (user?._id) {
      loadDashboardData();
    }
  }, [user?._id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Use profile from auth store (already has profileViews)
      // If profile has an _id, fetch fresh data for accurate view count
      let profileViews = profile?.profileViews || 0;
      
      if (profile?._id) {
        try {
          const profileResponse = await profilesAPI.getById(profile._id);
          const currentProfile = profileResponse.data.data;
          profileViews = currentProfile?.profileViews || 0;
        } catch (err) {
          // Use cached profile data if API fails
          console.log('Using cached profile data');
        }
      }
      
      // Load conversations
      const convResponse = await messagesAPI.getConversations();
      const conversations = convResponse.data.data || [];
      // Filter out archived conversations
      const activeConversations = conversations.filter(conv => !conv.isArchived);
      setRecentConversations(activeConversations.slice(0, 5));
      
      // Calculate unread
      const unread = activeConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
      
      // Load my hiring posts
      const jobsResponse = await hiringAPI.getAll({ limit: 100 });
      const allJobs = jobsResponse.data.data || [];
      const myPostedJobs = allJobs.filter(job => 
        job.author === user?._id || job.authorEmail === user?.email
      );
      setMyJobs(myPostedJobs.slice(0, 5));
      
      setStats({
        profileViews: profileViews,
        totalMessages: activeConversations.length,
        unreadMessages: unread,
        postedJobs: myPostedJobs.length
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setStats({
        profileViews: profile?.profileViews || 0,
        totalMessages: 0,
        unreadMessages: 0,
        postedJobs: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      await hiringAPI.delete(jobId);
      toast.success('Job posting deleted');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to delete job posting');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const statCards = [
    {
      icon: Eye,
      label: 'Profile Views',
      value: stats.profileViews,
      color: 'text-neutral-300',
      bgColor: 'bg-neutral-800'
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      value: stats.totalMessages,
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : null,
      color: 'text-neutral-300',
      bgColor: 'bg-neutral-800',
      link: '/messages'
    },
    {
      icon: Briefcase,
      label: 'Posted Jobs',
      value: stats.postedJobs,
      color: 'text-neutral-400',
      bgColor: 'bg-neutral-800',
      link: '/hiring'
    },
    {
      icon: TrendingUp,
      label: 'Profile Completion',
      value: profile ? '100%' : '0%',
      color: 'text-neutral-300',
      bgColor: 'bg-neutral-800'
    }
  ];

  return (
    <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome back, {profile?.firstName || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base">
            Here's what's happening with your profile and activities
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link || '#'}
                className={`card block hover:border-neutral-700 transition-all p-3 sm:p-6 ${
                  stat.link ? 'cursor-pointer' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={stat.color} size={20} />
                  </div>
                  {stat.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      {stat.badge}
                    </span>
                  )}
                </div>
                <div className="mt-3 sm:mt-4">
                  <p className="text-xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-neutral-400 text-xs sm:text-sm">{stat.label}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {!profile ? (
            <Link
              to="/create-profile"
              className="card bg-neutral-950 border-neutral-700 hover:border-neutral-600 transition-all group p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-neutral-800 rounded-xl group-hover:bg-neutral-700 transition-colors">
                  <User className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white">Create Your Profile</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm">Share your experience</p>
                </div>
                <ArrowRight className="text-neutral-400 flex-shrink-0" size={18} />
              </div>
            </Link>
          ) : (
            <Link
              to="/edit-profile"
              className="card hover:border-neutral-700 transition-all group p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-neutral-800 rounded-xl group-hover:bg-neutral-700 transition-colors">
                  <Edit className="text-neutral-300 group-hover:text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white">Edit Profile</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm">Update your info</p>
                </div>
                <ArrowRight className="text-neutral-400 group-hover:text-white flex-shrink-0" size={18} />
              </div>
            </Link>
          )}

          <Link
            to="/hiring/create"
            className="card hover:border-neutral-700 transition-all group p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-neutral-800 rounded-xl group-hover:bg-neutral-700 transition-colors">
                <Plus className="text-neutral-300 group-hover:text-white" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white">Post a Job</h3>
                <p className="text-neutral-400 text-xs sm:text-sm">Share an opportunity</p>
              </div>
              <ArrowRight className="text-neutral-400 group-hover:text-white flex-shrink-0" size={18} />
            </div>
          </Link>

          <Link
            to="/"
            className="card hover:border-neutral-700 transition-all group p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-neutral-800 rounded-xl group-hover:bg-neutral-700 transition-colors">
                <Users className="text-neutral-300 group-hover:text-white" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white">Browse Profiles</h3>
                <p className="text-neutral-400 text-xs sm:text-sm">Connect with pros</p>
              </div>
              <ArrowRight className="text-neutral-400 group-hover:text-white flex-shrink-0" size={18} />
            </div>
          </Link>

          <Link
            to="/referrals"
            className="card hover:border-purple-700/50 border-purple-800/30 bg-purple-950/20 transition-all group p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-purple-900/50 rounded-xl group-hover:bg-purple-800/50 transition-colors">
                <Gift className="text-purple-300 group-hover:text-white" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-white">Get Referral</h3>
                <p className="text-purple-300/70 text-xs sm:text-sm">Request referrals</p>
              </div>
              <ArrowRight className="text-purple-400 group-hover:text-white flex-shrink-0" size={18} />
            </div>
          </Link>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <MessageCircle className="text-neutral-400" size={22} />
                Recent Messages
              </h2>
              <Link to="/messages" className="text-neutral-400 hover:text-white text-sm">
                View all
              </Link>
            </div>

            {recentConversations.length > 0 ? (
              <div className="space-y-3">
                {recentConversations.map((conv) => {
                  const otherUser = conv.otherUser;
                  return (
                    <Link
                      key={conv._id}
                      to="/messages"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-semibold">
                        {otherUser?.profile?.firstName?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {otherUser?.profile?.firstName} {otherUser?.profile?.lastName}
                        </p>
                        <p className="text-neutral-400 text-sm truncate">
                          {conv.lastMessage?.content || 'Start a conversation'}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-400">No messages yet</p>
                <p className="text-neutral-500 text-sm">
                  Browse profiles and start connecting
                </p>
              </div>
            )}
          </motion.div>

          {/* My Job Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Briefcase className="text-neutral-400" size={22} />
                My Job Posts
              </h2>
              <Link to="/hiring/create" className="text-neutral-400 hover:text-white text-sm">
                Post new
              </Link>
            </div>

            {myJobs.length > 0 ? (
              <div className="space-y-3">
                {myJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/30"
                  >
                    <div className="p-2 bg-neutral-800 rounded-lg">
                      <Building2 className="text-neutral-400" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{job.title}</p>
                      <p className="text-neutral-400 text-sm">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        job.status === 'active' 
                          ? 'bg-neutral-700 text-white'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {job.status}
                      </span>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-400">No job posts yet</p>
                <Link to="/hiring/create" className="text-neutral-400 hover:text-white text-sm">
                  Post your first job
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Profile Card */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 card"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-neutral-800 flex items-center justify-center text-white text-3xl font-bold">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-white font-medium">{profile.headline}</p>
                <p className="text-neutral-400 text-sm mt-1">
                  {profile.city ? `${profile.city}, ${profile.country}` : profile.country || ''}
                </p>
              </div>
              <div className="flex gap-3">
                <Link to={`/profile/${profile._id}`} className="btn-secondary">
                  <Eye size={18} /> View
                </Link>
                <Link to="/edit-profile" className="btn-primary">
                  <Edit size={18} /> Edit
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
