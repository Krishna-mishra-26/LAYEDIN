import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, Briefcase, DollarSign, 
  User, Mail, Linkedin, Globe, Plus, X, ArrowLeft, Send, CheckCircle,
  Link as LinkIcon, FileText, Image
} from 'lucide-react';
import toast from 'react-hot-toast';
import { hiringAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
const expLevels = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager', 'Director', 'VP', 'C-Level'];
const remoteTypes = ['Remote', 'Hybrid', 'On-site'];

export default function CreateHiringPostPage() {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [postMode, setPostMode] = useState('full'); // 'full' or 'quick'
  const [formData, setFormData] = useState({
    // Author info
    authorName: profile ? `${profile.firstName} ${profile.lastName}` : '',
    authorTitle: '',
    authorCompany: '',
    authorEmail: '',
    authorLinkedin: '',
    
    // Job details
    title: '',
    company: '',
    companyWebsite: '',
    companyLogo: '',
    description: '',
    
    // Job info
    jobType: 'Full-time',
    experienceLevel: 'Mid Level',
    location: '',
    remoteType: 'Remote',
    
    // Salary
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    salaryVisible: true,
    
    // Requirements
    skills: [],
    
    // Visa
    visaSponsorship: false,
    
    // Application
    applicationUrl: '',
    applicationEmail: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields based on mode
    if (!formData.title || !formData.company || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Full mode requires description
    if (postMode === 'full' && !formData.description) {
      toast.error('Please provide a job description');
      return;
    }
    
    // Quick mode requires application URL
    if (postMode === 'quick' && !formData.applicationUrl) {
      toast.error('Please provide the job URL');
      return;
    }

    if (!formData.authorName || !formData.authorEmail) {
      toast.error('Please provide your name and email');
      return;
    }

    if (postMode === 'full' && !formData.applicationUrl && !formData.applicationEmail) {
      toast.error('Please provide either an application URL or email');
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        // Set default description for quick mode if empty
        description: formData.description || `${formData.title} position at ${formData.company}. Click Apply to view full details and apply.`,
        salary: {
          min: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
          max: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
          currency: formData.salaryCurrency,
          isVisible: formData.salaryVisible
        }
      };
      
      // Remove salary fields from root
      delete submitData.salaryMin;
      delete submitData.salaryMax;
      delete submitData.salaryCurrency;
      delete submitData.salaryVisible;
      
      // Include companyLogo if provided
      if (!submitData.companyLogo) {
        delete submitData.companyLogo;
      }

      await hiringAPI.create(submitData);
      toast.success('Job posted successfully!');
      navigate('/hiring');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/hiring"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back to Jobs
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Post a Job Opening</h1>
            <p className="text-neutral-400">
              Share your job opening with thousands of talented professionals
            </p>
          </div>

          {/* Post Mode Toggle */}
          <div className="card mb-6">
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setPostMode('full')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  postMode === 'full'
                    ? 'bg-white text-black'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <FileText size={18} />
                Full Job Details
              </button>
              <button
                type="button"
                onClick={() => setPostMode('quick')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  postMode === 'quick'
                    ? 'bg-white text-black'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <LinkIcon size={18} />
                Quick Link Post
              </button>
            </div>
            <p className="text-center text-neutral-500 text-sm mt-3">
              {postMode === 'full' 
                ? 'Create a detailed job posting with all information on our platform'
                : 'Quickly share a job link with basic details - redirects to external site'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Post Mode */}
            {postMode === 'quick' && (
              <>
                {/* Quick Post - Basic Info */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <LinkIcon className="text-neutral-400" size={24} />
                    Quick Job Link
                  </h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      External Job URL *
                    </label>
                    <input
                      type="url"
                      name="applicationUrl"
                      value={formData.applicationUrl}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://careers.company.com/job/12345"
                      required
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Link to the job posting on your company's careers page or job board
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Senior Software Engineer"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Acme Inc."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="San Francisco, CA or Remote"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Work Type
                      </label>
                      <select
                        name="remoteType"
                        value={formData.remoteType}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {remoteTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Company Logo URL (optional)
                      </label>
                      <input
                        type="url"
                        name="companyLogo"
                        value={formData.companyLogo}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="https://company.com/logo.png"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Job Type
                      </label>
                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {jobTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Brief Description (optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="input-field"
                      rows={3}
                      placeholder="Brief overview of the role..."
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="visaSponsorship"
                      checked={formData.visaSponsorship}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-neutral-600 text-neutral-500 focus:ring-neutral-500"
                    />
                    <span className="text-neutral-300">Offers visa sponsorship</span>
                  </label>
                </div>

                {/* Quick Post - Your Info */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <User className="text-neutral-400" size={24} />
                    Your Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="authorName"
                        value={formData.authorName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="authorEmail"
                        value={formData.authorEmail}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Full Post Mode */}
            {postMode === 'full' && (
              <>
            {/* Your Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="text-neutral-400" size={24} />
                Your Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="authorEmail"
                    value={formData.authorEmail}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="john@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Your Title
                  </label>
                  <input
                    type="text"
                    name="authorTitle"
                    value={formData.authorTitle}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Hiring Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    LinkedIn (optional)
                  </label>
                  <input
                    type="url"
                    name="authorLinkedin"
                    value={formData.authorLinkedin}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Briefcase className="text-neutral-400" size={24} />
                Job Details
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Acme Inc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Image size={16} className="text-neutral-400" />
                    Company Logo URL (optional)
                  </span>
                </label>
                <input
                  type="url"
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://company.com/logo.png"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Direct link to your company logo (PNG, JPG, or SVG recommended)
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  rows={8}
                  placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity great..."
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Tip: Use **text** for bold and bullet points for lists
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {expLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Work Type
                  </label>
                  <select
                    name="remoteType"
                    value={formData.remoteType}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {remoteTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="San Francisco, CA or Remote - US"
                  required
                />
              </div>

              {/* Skills */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Required Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="input-field flex-1"
                    placeholder="Add a skill (e.g., React, Python)"
                  />
                  <button type="button" onClick={addSkill} className="btn-secondary">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-500/20 text-neutral-300 rounded-lg text-sm"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Visa Sponsorship */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="visaSponsorship"
                  checked={formData.visaSponsorship}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-neutral-600 text-neutral-500 focus:ring-neutral-500"
                />
                <span className="text-neutral-300 flex items-center gap-2">
                  <CheckCircle size={18} className="text-neutral-400" />
                  This position offers visa sponsorship
                </span>
              </label>
            </div>

            {/* Compensation */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <DollarSign className="text-neutral-400" size={24} />
                Compensation (Optional)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Min Salary
                  </label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="100000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Max Salary
                  </label>
                  <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="150000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Currency
                  </label>
                  <select
                    name="salaryCurrency"
                    value={formData.salaryCurrency}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="salaryVisible"
                  checked={formData.salaryVisible}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-neutral-600 text-neutral-500 focus:ring-neutral-500"
                />
                <span className="text-neutral-300">Show salary on job posting</span>
              </label>
            </div>

            {/* Application */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Globe className="text-neutral-400" size={24} />
                How to Apply
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Application URL
                </label>
                <input
                  type="url"
                  name="applicationUrl"
                  value={formData.applicationUrl}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://company.com/careers/apply"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Application Email
                </label>
                <input
                  type="email"
                  name="applicationEmail"
                  value={formData.applicationEmail}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="careers@company.com"
                />
              </div>

              <p className="text-sm text-neutral-500">
                Provide at least one way for candidates to apply
              </p>
            </div>
              </>
            )}

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Link to="/hiring" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> Post Job
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
