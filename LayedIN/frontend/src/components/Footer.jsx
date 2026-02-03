import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Heart, Mail, Phone } from 'lucide-react';

export default function Footer({ minimal = false }) {
  if (minimal) {
    return (
      <footer className="bg-black border-t border-neutral-900" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} LayedOff. All rights reserved.
            </p>
            <p className="text-neutral-500 text-sm flex items-center mt-2 md:mt-0">
              Made with <Heart size={14} className="mx-1 text-neutral-400" aria-hidden="true" /> for the tech community
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-black border-t border-neutral-900 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4" aria-label="LayedIn Home">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold text-white">LayedIn</span>
            </Link>
            <p className="text-neutral-400 mb-4 max-w-md">
              Connecting talented professionals affected by layoffs with companies looking to hire. 
              Free forever for browsing and contacting talent.
            </p>
            <nav className="flex space-x-4" aria-label="Social media links">
              <a href="#" className="text-neutral-600 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} aria-hidden="true" />
              </a>
              <a href="#" className="text-neutral-600 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} aria-hidden="true" />
              </a>
              <a href="#" className="text-neutral-600 hover:text-white transition-colors" aria-label="GitHub">
                <Github size={20} aria-hidden="true" />
              </a>
            </nav>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition-colors">
                  Browse Talent
                </Link>
              </li>
              <li>
                <Link to="/hiring" className="text-neutral-400 hover:text-white transition-colors">
                  Job Posts
                </Link>
              </li>
              <li>
                <Link to="/referrals" className="text-neutral-400 hover:text-white transition-colors">
                  Get Referrals
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="text-neutral-400 hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-neutral-400 hover:text-white transition-colors">
                  Create Profile
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support links">
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help-center" onClick={() => window.scrollTo(0, 0)} className="text-neutral-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="text-neutral-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" onClick={() => window.scrollTo(0, 0)} className="text-neutral-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:Krishnamishrajii26@gmail.com" className="text-neutral-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-900">
          {/* Built by Section */}
          <div className="flex flex-col items-center mb-6 pb-6 border-b border-neutral-800">
            <h4 className="text-white font-semibold text-lg mb-2">Krishna Mishra</h4>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/in/krishna--mishra/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <a 
                href="mailto:Krishnamishrajii26@gmail.com"
                className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm"
              >
                <Mail size={16} />
                Email
              </a>
              <a 
                href="tel:+918452042331"
                className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm"
              >
                <Phone size={16} />
                +91 8452042331
              </a>
            </div>
            <p className="text-white text-2xl mt-2">🇮🇳 India</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} LayedIn. All rights reserved.
            </p>
            <p className="text-neutral-500 text-sm flex items-center mt-2 md:mt-0">
              Made for the tech community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
