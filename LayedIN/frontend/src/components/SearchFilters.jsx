import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, ChevronDown, ChevronUp,
  MapPin, Building2, Globe, ChevronRight, User, Briefcase
} from 'lucide-react';
import { profilesAPI } from '../lib/api';

export default function SearchFilters({ filters, onFilterChange, filterOptions, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) && 
          searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSearchSuggestions = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchSuggestions([]);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const response = await profilesAPI.searchRoles({ search: query });
      setSearchSuggestions(response.data.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSearchSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    const newFilters = { ...localFilters, search: searchValue };
    setLocalFilters(newFilters);

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce search suggestions (500ms delay)
    if (searchValue.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        fetchSearchSuggestions(searchValue);
      }, 500);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (role) => {
    const newFilters = { ...localFilters, search: role.title };
    setLocalFilters(newFilters);
    setShowSuggestions(false);
    onFilterChange(newFilters);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onFilterChange(localFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSkillToggle = (skill) => {
    const currentSkills = localFilters.skills ? localFilters.skills.split(',').filter(Boolean) : [];
    let newSkills;
    if (currentSkills.includes(skill)) {
      newSkills = currentSkills.filter(s => s !== skill);
    } else {
      newSkills = [...currentSkills, skill];
    }
    handleFilterChange('skills', newSkills.join(','));
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      skills: '',
      country: '',
      visaStatus: '',
      remotePreference: '',
      layoffCompany: '',
      yearsOfExperienceMin: '',
      yearsOfExperienceMax: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.entries(localFilters).some(([key, value]) => value && key !== 'search');

  return (
    <div className="card mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500" size={20} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, skills, title or company..."
            value={localFilters.search || ''}
            onChange={handleSearchChange}
            onFocus={() => localFilters.search && setShowSuggestions(true)}
            className="input-field pl-12 text-base"
          />
          
          {/* Search Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && localFilters.search && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
              >
                {suggestionsLoading ? (
                  <div className="px-4 py-6 text-center text-neutral-400">
                    <p>Loading profiles...</p>
                  </div>
                ) : searchSuggestions.length > 0 ? (
                  <div className="py-2">
                    {searchSuggestions.map((role, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(role)}
                        className="w-full px-4 py-3 hover:bg-neutral-800 transition-colors text-left flex items-center gap-3 border-b border-neutral-800 last:border-b-0"
                      >
                        <Briefcase size={18} className="text-neutral-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {role.title}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {role.count} professional{role.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-neutral-500">
                    <p>No roles found matching "{localFilters.search}"</p>
                    <p className="text-xs mt-2">Try searching for a job title or role</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isLoading}>
          Search
        </button>
      </form>

      {/* Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <Filter size={18} />
          <span>Advanced Filters</span>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-neutral-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Country */}
              <div>
                <label className="form-label">
                  <MapPin size={14} className="inline mr-1 text-neutral-500" />
                  Country
                </label>
                <select
                  value={localFilters.country || ''}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Countries</option>
                  {filterOptions?.countries?.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Layoff Company */}
              <div>
                <label className="form-label">
                  <Building2 size={14} className="inline mr-1 text-neutral-500" />
                  Previous Company
                </label>
                <select
                  value={localFilters.layoffCompany || ''}
                  onChange={(e) => handleFilterChange('layoffCompany', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Companies</option>
                  {filterOptions?.companies?.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              {/* Remote Preference */}
              <div>
                <label className="form-label">
                  <Globe size={14} className="inline mr-1 text-neutral-500" />
                  Remote Preference
                </label>
                <select
                  value={localFilters.remotePreference || ''}
                  onChange={(e) => handleFilterChange('remotePreference', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any</option>
                  {filterOptions?.remotePreferences?.map(pref => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>

              {/* Visa Status */}
              <div>
                <label className="form-label">
                  Current Visa Status
                </label>
                <select
                  value={localFilters.visaStatus || ''}
                  onChange={(e) => handleFilterChange('visaStatus', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Visa Types</option>
                  {filterOptions?.visaStatuses?.map(visa => (
                    <option key={visa} value={visa}>{visa}</option>
                  ))}
                </select>
              </div>

              {/* Experience Range */}
              <div>
                <label className="form-label">
                  Min Years Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={localFilters.yearsOfExperienceMin || ''}
                  onChange={(e) => handleFilterChange('yearsOfExperienceMin', e.target.value)}
                  className="input-field"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="form-label">
                  Max Years Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={localFilters.yearsOfExperienceMax || ''}
                  onChange={(e) => handleFilterChange('yearsOfExperienceMax', e.target.value)}
                  className="input-field"
                  placeholder="50"
                />
              </div>
            </div>

            {/* Skills */}
            {filterOptions?.skills && filterOptions.skills.length > 0 && (
              <div>
                <label className="form-label mb-3">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.skills.slice(0, 15).map(skill => {
                    const isSelected = localFilters.skills?.split(',').includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-white text-black'
                            : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
                {filterOptions.skills.length > 15 && (
                  <button
                    onClick={() => setShowMoreSkills(!showMoreSkills)}
                    className="mt-3 text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    {showMoreSkills ? 'Show Less' : `Show All (${filterOptions.skills.length} skills)`}
                    <ChevronRight size={14} className={`transition-transform ${showMoreSkills ? 'rotate-90' : ''}`} />
                  </button>
                )}
                {showMoreSkills && filterOptions.skills.length > 15 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-neutral-800">
                    {filterOptions.skills.slice(15).map(skill => {
                      const isSelected = localFilters.skills?.split(',').includes(skill);
                      return (
                        <button
                          key={skill}
                          onClick={() => handleSkillToggle(skill)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-white text-black'
                              : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
