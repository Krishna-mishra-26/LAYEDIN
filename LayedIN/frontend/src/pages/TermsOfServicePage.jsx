import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
  const lastUpdated = 'January 31, 2026';

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-neutral-400">
              Last updated: <span className="text-white">{lastUpdated}</span>
            </p>
            <p className="text-neutral-500 text-sm mt-2">
              TL;DR: Be cool, don't be a jerk, don't spam. Pretty simple.
            </p>
          </div>

          <div className="card mb-6 bg-blue-900/20 border-blue-800/30">
            <div className="flex items-start gap-3">
              <FileText className="text-blue-400 mt-1" size={24} />
              <div>
                <h3 className="text-white font-semibold mb-2">The Deal</h3>
                <p className="text-neutral-400 text-sm">
                  By using LayedIn, you agree to these terms. If you don't agree, don't use the platform.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Platform Purpose */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-white mb-4">1. What This Is</h2>
              <p className="text-neutral-300 mb-4">
                LayedIn helps people affected by layoffs find jobs. Companies find talent. Everyone wins. It's free.
              </p>
            </section>

            {/* User Accounts */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Your Account</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={18} />
                    The Basics
                  </h3>
                  <ul className="space-y-2 text-neutral-300 ml-6">
                    <li>• Be 18+ years old</li>
                    <li>• Don't lie about your info</li>
                    <li>• Keep your password secure</li>
                    <li>• One account per person</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <XCircle className="text-red-400" size={18} />
                    Getting Kicked Out
                  </h3>
                  <p className="text-neutral-300 ml-6">
                    We'll ban accounts that spam, scam, or otherwise ruin things for everyone else.
                  </p>
                </div>
              </div>
            </section>

            {/* Acceptable Use */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Do's and Don'ts</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={18} />
                    Go ahead:
                  </h3>
                  <ul className="space-y-2 text-neutral-300 ml-6">
                    <li>• Make an honest profile</li>
                    <li>• Apply to jobs</li>
                    <li>• Post legit job openings</li>
                    <li>• Message people professionally</li>
                    <li>• Ask for or offer referrals</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <XCircle className="text-red-400" size={18} />
                    Don't do this:
                  </h3>
                  <ul className="space-y-2 text-neutral-300 ml-6">
                    <li>• Lie or post fake stuff</li>
                    <li>• Spam or harass people</li>
                    <li>• Scrape data</li>
                    <li>• Be discriminatory or offensive</li>
                    <li>• Do anything illegal</li>
                    <li>• Share your login</li>
                    <li>• Make fake profiles</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Content & Intellectual Property */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Your Content vs Our Stuff</h2>
              <div className="space-y-4 text-neutral-300">
                <div>
                  <h3 className="text-white font-medium mb-2">Your Content</h3>
                  <p className="mb-2">
                    You own what you post. By using LayedIn, you let us:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Show your profile on the platform</li>
                    <li>• Share your public info with other users</li>
                    <li>• Use anonymous data for analytics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Our Content</h3>
                  <p>
                    The platform, design, and branding belong to Krishna Mishra. Don't steal it.
                  </p>
                </div>
              </div>
            </section>

            {/* Free Service */}
            <section className="card bg-green-900/20 border-green-800/30">
              <h2 className="text-2xl font-semibold text-white mb-4">5. It's Free (Really)</h2>
              <p className="text-neutral-300 mb-4">
                LayedIn is <strong className="text-white">completely free</strong>. No tricks, no "premium" tier. Everything is free:
              </p>
              <ul className="space-y-2 text-neutral-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Create profiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Browse and search</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Post jobs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Message people</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Get/give referrals</span>
                </li>
              </ul>
            </section>

            {/* Privacy & Data */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Privacy Stuff</h2>
              <p className="text-neutral-300 mb-4">
                Read our <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="text-blue-400 hover:text-blue-300">Privacy Policy</Link> for the full details. Quick version:
              </p>
              <div className="space-y-2 text-neutral-300">
                <ul className="space-y-2 ml-4">
                  <li>• Your password is encrypted</li>
                  <li>• You control what's public</li>
                  <li>• We don't sell your data</li>
                  <li>• You can delete your account anytime</li>
                </ul>
              </div>
            </section>

            {/* Disclaimers */}
            <section className="card border-yellow-900/30">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-yellow-400" size={24} />
                <h2 className="text-2xl font-semibold text-white">7. Important Stuff</h2>
              </div>
              <div className="space-y-4 text-neutral-300">
                <div>
                  <h3 className="text-white font-medium mb-2">We Don't Guarantee Jobs</h3>
                  <p>
                    We connect people. That's it. We can't promise you'll get hired or find the perfect candidate.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">User Content</h3>
                  <p>
                    We're not responsible if someone posts fake info or a scam job. Do your homework.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">External Links</h3>
                  <p>
                    If you click a link to another site (resume, company website), that's on you. We're not responsible for other websites.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Legal Stuff</h2>
              <p className="text-neutral-300 mb-3">
                LayedIn is provided "as is". We're not liable for:
              </p>
              <ul className="space-y-2 text-neutral-300 ml-4">
                <li>• Lost job opportunities</li>
                <li>• Bad interactions with other users</li>
                <li>• Technical issues or bugs</li>
                <li>• What other people post</li>
              </ul>
              <p className="text-neutral-400 text-sm mt-4">
                Translation: Use at your own risk. We're doing our best, but stuff happens.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-white mb-4">9. We Might Update This</h2>
              <p className="text-neutral-300">
                We can update these terms. If you keep using LayedIn after we change stuff, that means you're cool with it. We'll email you if there are big changes.
              </p>
            </section>

            {/* Contact */}
            <section className="card bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-blue-400" size={24} />
                <h2 className="text-2xl font-semibold text-white">Got Questions?</h2>
              </div>
              <p className="text-neutral-300 mb-4">
                Email me if something's unclear or you need to report something:
              </p>
              <div className="space-y-2">
                <p className="text-neutral-300">
                  <a
                    href="mailto:Krishnamishrajii26@gmail.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Krishnamishrajii26@gmail.com
                  </a>
                </p>
                <p className="text-neutral-400 text-sm">
                  Built by Krishna Mishra from India 🇮🇳
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
            <p>
              By using LayedIn, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
