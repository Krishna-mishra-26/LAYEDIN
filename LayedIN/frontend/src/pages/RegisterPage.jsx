import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password);
      toast.success('Account created! Let\'s create your profile.');
      navigate('/create-profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'Create your professional profile',
    'Get discovered by top companies',
    'Connect with recruiters directly',
    'Access job opportunities',
    'Free forever'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4 register-page">
      <style>{`
        .register-page .input-field {
          padding-left: 1rem !important;
        }
      `}</style>
      <div className="hero-gradient-1 top-0 left-0" />
      <div className="hero-gradient-2 bottom-0 right-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left - Features */}
          <div className="hidden lg:flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Join LayedIn
            </h1>
            <p className="text-neutral-400 mb-8">
              Create your profile and connect with companies looking for talented professionals like you.
            </p>
            
            <ul className="space-y-4">
              {features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-neutral-300">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right - Form */}
          <div>
            <div className="text-center mb-6 sm:mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center space-x-2 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-neutral-900/50">
                  <span className="text-black font-bold text-xl sm:text-2xl">L</span>
                </div>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-neutral-400 text-sm sm:text-base">Start your journey today</p>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="text-center mb-6 hidden lg:block">
                <Link to="/" className="inline-flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-neutral-900/50">
                    <span className="text-black font-bold text-xl">L</span>
                  </div>
                </Link>
                <h2 className="text-2xl font-bold text-white">Create Account</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="form-label">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pr-12"
                      placeholder="you@example.com"
                      required
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pr-20"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-neutral-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <Lock className="text-neutral-500" size={18} />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">At least 6 characters</p>
                </div>

                <div>
                  <label className="form-label">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-neutral-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-white hover:text-neutral-300 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-neutral-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-neutral-400 hover:text-white">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-neutral-400 hover:text-white">Privacy Policy</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
