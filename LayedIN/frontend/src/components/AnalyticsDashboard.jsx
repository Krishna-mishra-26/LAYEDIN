import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Line, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Building2, Globe, Briefcase, 
  UserCheck, ChevronDown, ChevronUp, BarChart3, AlertTriangle,
  Zap, Target, Clock, DollarSign, Layers, Activity, ArrowUpRight,
  ArrowDownRight, Sparkles, Calendar, Award
} from 'lucide-react';
import { profilesAPI } from '../lib/api';

// Industry data for context (real-world statistics)
const INDUSTRY_INSIGHTS = {
  totalLayoffs2024: 152000,
  totalLayoffs2025: 187000,
  totalLayoffs2026: 48000, // Year-to-date
  topAffectedSectors: ['E-commerce', 'FinTech', 'AI/ML', 'Enterprise SaaS', 'Consumer Apps'],
  averageJobSearchTime: '4.2 months',
  techRecoveryRate: '73%',
  recentHeadlines: [
    { company: 'Amazon', count: 16000, date: 'Jan 2026' },
    { company: 'Pinterest', count: '15%', date: 'Jan 2026' },
    { company: 'Meta', count: '10%', date: 'Jan 2026' },
    { company: 'Microsoft', count: 9000, date: 'Jul 2025' },
  ]
};

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await profilesAPI.getAnalytics();
        setAnalytics(response.data.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-neutral-900/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const { summary } = analytics;

  // Calculate insights
  const placementRate = summary.totalProfiles > 0 
    ? Math.round((analytics.statusDistribution.find(s => s.status === 'Employed')?.count || 0) / summary.totalProfiles * 100) 
    : 0;
  
  const activelyLookingPercent = summary.totalProfiles > 0 
    ? Math.round(summary.activelyLooking / summary.totalProfiles * 100) 
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 shadow-2xl">
          <p className="text-white font-medium text-sm mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold text-white">{entry.value?.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Hero Stats - Always Visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          {/* Main KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Total Professionals */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="relative overflow-hidden bg-neutral-950 border border-neutral-800 rounded-xl sm:rounded-2xl p-3 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-neutral-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1">Professionals</p>
                  <p className="text-xl sm:text-3xl font-bold text-white">{summary.totalProfiles.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                    <span className="text-emerald-400 text-[10px] sm:text-xs font-medium">+{summary.recentRegistrations} this week</span>
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
              </div>
            </motion.div>

            {/* Actively Looking */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="relative overflow-hidden bg-neutral-950 border border-neutral-800 rounded-xl sm:rounded-2xl p-3 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-neutral-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1">Actively Looking</p>
                  <p className="text-xl sm:text-3xl font-bold text-white">{summary.activelyLooking.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                    <span className="text-amber-400 text-[10px] sm:text-xs font-medium">{activelyLookingPercent}% of total</span>
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
              </div>
            </motion.div>

            {/* Companies */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="relative overflow-hidden bg-neutral-950 border border-neutral-800 rounded-xl sm:rounded-2xl p-3 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-neutral-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1">Companies</p>
                  <p className="text-xl sm:text-3xl font-bold text-white">{summary.totalCompanies}</p>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
                    <span className="text-purple-400 text-[10px] sm:text-xs font-medium">Tech & Fortune 500</span>
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
              </div>
            </motion.div>

            {/* Countries */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="relative overflow-hidden bg-neutral-950 border border-neutral-800 rounded-xl sm:rounded-2xl p-3 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-neutral-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1">Countries</p>
                  <p className="text-xl sm:text-3xl font-bold text-white">{summary.totalCountries}</p>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
                    <span className="text-cyan-400 text-[10px] sm:text-xs font-medium">Global reach</span>
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Industry Context Banner */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-red-500/5 border border-amber-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6"
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-medium text-xs sm:text-sm mb-1">Industry Insight</h4>
                <p className="text-neutral-400 text-[10px] sm:text-xs leading-relaxed">
                  Over <span className="text-white font-medium">387,000+ tech professionals</span> have been affected by layoffs since 2024. 
                  Major companies including Amazon (16K), Microsoft (9K), and Meta continue restructuring in 2026. 
                  Average job search duration is <span className="text-white font-medium">4.2 months</span> with a {INDUSTRY_INSIGHTS.techRecoveryRate} re-employment rate in tech.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Expand Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            className="w-full py-4 flex items-center justify-center gap-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-white font-medium hover:border-neutral-700 hover:bg-neutral-900/50 transition-all group"
          >
            <BarChart3 className="w-5 h-5 text-neutral-500" />
            <span className="text-neutral-300 text-sm">
              {isExpanded ? 'Collapse Analytics Dashboard' : 'View Detailed Analytics & Industry Insights'}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-neutral-500" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Expanded Dashboard */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-6">
                
                {/* Row 1: Trend Chart + Company Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Trend Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-white font-semibold">Registration Trend</h3>
                        <p className="text-neutral-500 text-xs mt-1">Professionals joining over the last 12 months</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-neutral-400">Registrations</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.layoffTrend}>
                          <defs>
                            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fill: '#737373', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fill: '#737373', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={40}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="layoffs" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            fill="url(#trendGradient)"
                            name="Professionals"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Top Companies List */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Top Companies</h3>
                      <span className="text-neutral-500 text-xs">By registrations</span>
                    </div>
                    <div className="space-y-3">
                      {analytics.layoffsByCompany.slice(0, 6).map((item, index) => {
                        const maxCount = analytics.layoffsByCompany[0]?.count || 1;
                        const percentage = (item.count / maxCount) * 100;
                        return (
                          <div key={item.company} className="group">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-neutral-600 text-xs font-medium w-4">{index + 1}</span>
                                <span className="text-neutral-300 text-sm truncate">{item.company}</span>
                              </div>
                              <span className="text-white text-sm font-medium">{item.count}</span>
                            </div>
                            <div className="ml-6 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, delay: index * 0.05 }}
                                className="h-full rounded-full"
                                style={{ 
                                  background: `linear-gradient(90deg, ${
                                    index === 0 ? '#3b82f6' : 
                                    index === 1 ? '#6366f1' : 
                                    index === 2 ? '#8b5cf6' : 
                                    index === 3 ? '#a855f7' : 
                                    index === 4 ? '#d946ef' : '#ec4899'
                                  }, ${
                                    index === 0 ? '#6366f1' : 
                                    index === 1 ? '#8b5cf6' : 
                                    index === 2 ? '#a855f7' : 
                                    index === 3 ? '#d946ef' : 
                                    index === 4 ? '#ec4899' : '#f43f5e'
                                  })`
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>

                {/* Row 2: Experience + Status + Countries */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Experience Distribution */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Experience Levels</h3>
                      <Briefcase className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.experienceDistribution} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                          <XAxis type="number" tick={{ fill: '#737373', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis 
                            dataKey="level" 
                            type="category" 
                            width={70}
                            tick={{ fill: '#a3a3a3', fontSize: 10 }} 
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="count" 
                            fill="#3b82f6" 
                            name="Professionals" 
                            radius={[0, 4, 4, 0]}
                            barSize={16}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Countries */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Top Countries</h3>
                      <Globe className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.layoffsByCountry.slice(0, 5)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                          <XAxis 
                            dataKey="country" 
                            tick={{ fill: '#737373', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fill: '#737373', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            width={30}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="count" 
                            name="Professionals" 
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                          >
                            {analytics.layoffsByCountry.slice(0, 5).map((entry, index) => {
                              const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];
                              return <Cell key={`cell-${index}`} fill={colors[index]} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Row 3: Gender + Skills + Reasons */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Gender Distribution - Only Male & Female */}
                  {analytics.genderDistribution.filter(g => g.gender === 'Male' || g.gender === 'Female').length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Gender Distribution</h3>
                        <Users className="w-4 h-4 text-neutral-600" />
                      </div>
                      <div className="flex items-center justify-center h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.genderDistribution.filter(g => g.gender === 'Male' || g.gender === 'Female')}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={65}
                              paddingAngle={2}
                              dataKey="count"
                              nameKey="gender"
                            >
                              {analytics.genderDistribution.filter(g => g.gender === 'Male' || g.gender === 'Female').map((entry) => {
                                const genderColors = { 'Male': '#3b82f6', 'Female': '#ec4899' };
                                return <Cell key={entry.gender} fill={genderColors[entry.gender]} />;
                              })}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3 mt-2">
                        {analytics.genderDistribution.filter(g => g.gender === 'Male' || g.gender === 'Female').map((item) => {
                          const genderColors = { 'Male': '#3b82f6', 'Female': '#ec4899' };
                          return (
                            <div key={item.gender} className="flex items-center gap-1.5">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: genderColors[item.gender] }}
                              ></div>
                              <span className="text-neutral-400 text-xs">{item.gender}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Top Skills */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">In-Demand Skills</h3>
                      <Sparkles className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analytics.topSkills.slice(0, 12).map((item, index) => (
                        <span 
                          key={item.skill}
                          className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-medium"
                          style={{ 
                            color: index < 3 ? '#3b82f6' : index < 6 ? '#8b5cf6' : '#a3a3a3'
                          }}
                        >
                          {item.skill}
                          <span className="ml-1.5 text-neutral-600">({item.count})</span>
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Remote Preference */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Work Preference</h3>
                      <Layers className="w-4 h-4 text-neutral-600" />
                    </div>
                    <div className="space-y-3">
                      {analytics.remoteDistribution.map((item, index) => {
                        const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b'];
                        const percentage = Math.round((item.count / summary.totalProfiles) * 100);
                        return (
                          <div key={item.preference}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: colors[index % colors.length] }}
                                ></div>
                                <span className="text-neutral-400 text-sm">{item.preference}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-medium">{item.count}</span>
                                <span className="text-neutral-600 text-xs">({percentage}%)</span>
                              </div>
                            </div>
                            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: colors[index % colors.length] }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>

                {/* Industry Headlines */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">Recent Industry Headlines</h3>
                      <p className="text-neutral-500 text-xs mt-1">Major layoffs impacting the tech industry</p>
                    </div>
                    <Calendar className="w-4 h-4 text-neutral-600" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {INDUSTRY_INSIGHTS.recentHeadlines.map((headline, index) => (
                      <div 
                        key={index}
                        className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 text-neutral-500" />
                          <span className="text-white font-medium text-sm">{headline.company}</span>
                        </div>
                        <p className="text-2xl font-bold text-red-400">{headline.count}</p>
                        <p className="text-neutral-500 text-xs mt-1">{headline.date}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
