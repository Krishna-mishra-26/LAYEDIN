import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CreateProfilePage from './pages/CreateProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import MessagesPage from './pages/MessagesPage';
import HiringPage from './pages/HiringPage';
import CreateHiringPostPage from './pages/CreateHiringPostPage';
import ReferralsPage from './pages/ReferralsPage';
import ProvideReferralPage from './pages/ProvideReferralPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HelpCenterPage from './pages/HelpCenterPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// SEO page titles
const pageTitles = {
  '/': 'LayedIn - Find Jobs & Hire Top Talent Affected by Tech Layoffs',
  '/hiring': 'Tech Job Openings - Remote & On-site Positions | LayedIn',
  '/jobs': 'Tech Job Openings - Remote & On-site Positions | LayedIn',
  '/referrals': 'Get Employee Referrals at Top Tech Companies | LayedIn',
  '/provide-referral': 'Offer Referrals to Help Laid-Off Professionals | LayedIn',
  '/login': 'Sign In to Your Account | LayedIn',
  '/register': 'Create Free Account - Join 50,000+ Tech Professionals | LayedIn',
  '/dashboard': 'Your Dashboard | LayedIn',
  '/messages': 'Messages | LayedIn',
  '/create-profile': 'Create Your Professional Profile | LayedIn',
  '/edit-profile': 'Edit Your Profile | LayedIn',
  '/post-job': 'Post a Job Opening for Free | LayedIn',
  '/help-center': 'Help Center - FAQs & Support | LayedOff',
  '/privacy-policy': 'Privacy Policy | LayedOff',
  '/terms-of-service': 'Terms of Service | LayedOff',
};

function App() {
  const { checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Update page title based on route
  useEffect(() => {
    const baseTitle = pageTitles[location.pathname];
    if (baseTitle) {
      document.title = baseTitle;
    } else if (location.pathname.startsWith('/profile/')) {
      document.title = 'View Profile | LayedOff';
    } else {
      document.title = 'LayedOff - Find Jobs & Hire Top Talent Affected by Tech Layoffs';
    }
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show minimal footer on profile, messages, hiring detail, dashboard pages
  const minimialFooterPaths = ['/profile/', '/messages', '/hiring/', '/dashboard', '/edit-profile', '/create-profile', '/create-hiring'];
  const isMinimalFooter = minimialFooterPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" role="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:userId" element={<MessagesPage />} />
          <Route path="/hiring" element={<HiringPage />} />
          <Route path="/jobs" element={<HiringPage />} />
          <Route path="/hiring/create" element={<CreateHiringPostPage />} />
          <Route path="/post-job" element={<CreateHiringPostPage />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="/provide-referral" element={<ProvideReferralPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Routes>
      </main>
      <Footer minimal={isMinimalFooter} />
    </div>
  );
}

export default App;
