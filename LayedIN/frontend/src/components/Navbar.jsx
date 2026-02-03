import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, User, MessageSquare, Briefcase, LogOut, 
  ChevronDown, Plus, LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, profile, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-dark" role="banner">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" aria-label="LayedIn Home">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-black font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold text-white">LayedIn</span>
          </Link>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden ring-1 ring-neutral-700">
                    {profile?.profilePhoto ? (
                      <img src={profile.profilePhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>
                  <span className="font-medium">{profile?.firstName || user?.email?.split('@')[0]}</span>
                  <ChevronDown size={16} />
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-neutral-950 rounded-lg shadow-xl border border-neutral-800 py-2 overflow-hidden"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                      >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                      </Link>
                      {profile ? (
                        <Link
                          to={`/profile/${profile._id}`}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                        >
                          <User size={18} />
                          <span>View Profile</span>
                        </Link>
                      ) : (
                        <Link
                          to="/create-profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                        >
                          <Plus size={18} />
                          <span>Create Profile</span>
                        </Link>
                      )}
                      <Link
                        to="/messages"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                      >
                        <MessageSquare size={18} />
                        <span>Messages</span>
                      </Link>
                      <hr className="my-2 border-neutral-800" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-neutral-900 hover:text-red-300 transition-colors w-full"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Create Profile
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-neutral-400 hover:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-neutral-800"
            >
              <div className="flex flex-col space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors py-3 px-3 rounded-lg"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    {profile ? (
                      <Link
                        to={`/profile/${profile._id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors py-3 px-3 rounded-lg"
                      >
                        <User size={18} />
                        View Profile
                      </Link>
                    ) : (
                      <Link
                        to="/create-profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors py-3 px-3 rounded-lg"
                      >
                        <Plus size={18} />
                        Create Profile
                      </Link>
                    )}
                    <Link
                      to="/messages"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors py-3 px-3 rounded-lg"
                    >
                      <MessageSquare size={18} />
                      Messages
                    </Link>
                    <Link
                      to="/referrals"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors py-3 px-3 rounded-lg"
                    >
                      <Briefcase size={18} />
                      Referrals
                    </Link>
                    <Link
                      to="/jobs"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors py-3 px-3 rounded-lg"
                    >
                      <Briefcase size={18} />
                      Jobs
                    </Link>
                    <hr className="border-neutral-800 my-2" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-neutral-900 transition-colors py-3 px-3 rounded-lg text-left w-full"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors py-3 px-3 rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn-primary text-center py-3"
                    >
                      Create Profile
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
