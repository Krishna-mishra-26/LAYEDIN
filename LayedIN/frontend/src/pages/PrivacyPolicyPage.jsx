import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database, UserX, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-neutral-400">
              Last updated: <span className="text-white">{lastUpdated}</span>
            </p>
            <p className="text-neutral-500 text-sm mt-2">
              TL;DR: We don't sell your data. You control what's public. We keep things secure.
            </p>
          </div>

          <div className="card mb-6 bg-blue-900/20 border-blue-800/30">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-400 mt-1" size={24} />
              <div>
                <h3 className="text-white font-semibold mb-2">Your Privacy Matters</h3>
                <p className="text-neutral-400 text-sm">
                  We're transparent about what we collect and why. No shady stuff.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Information We Collect */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-neutral-400" size={24} />
                <h2 className="text-2xl font-semibold text-white">What We Collect</h2>
              </div>
              <div className="space-y-4 text-neutral-300">
                <p>Pretty standard stuff:</p>
                <div>
                  <h3 className="text-white font-medium mb-2">Your Account</h3>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>Email and password (encrypted, obviously)</li>
                    <li>Name, skills, work history</li>
                    <li>Education and job preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Contact Info (if you add it)</h3>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>Phone, LinkedIn, GitHub, portfolio links</li>
                    <li>Location and visa status</li>
                    <li>Resume link and profile photo</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Activity</h3>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>Messages you send</li>
                    <li>Who viewed your profile</li>
                    <li>Jobs you post or apply to</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-neutral-400" size={24} />
                <h2 className="text-2xl font-semibold text-white">What We Do With It</h2>
              </div>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Show your profile to companies looking for people like you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Let you message recruiters and other users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Make the platform better (analytics, bug fixes, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Send you important updates about your account</span>
                </li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-neutral-400" size={24} />
                <h2 className="text-2xl font-semibold text-white">Who Sees Your Info</h2>
              </div>
              <div className="space-y-4 text-neutral-300">
                <p className="text-lg">
                  <strong className="text-white">We DO NOT sell your data. Period.</strong>
                </p>
                <p>Your info is only shared when:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>You make your profile public (companies can see it)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>You send messages (the recipient sees them)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Law requires it (court orders, etc.)</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Your Privacy Controls */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-neutral-400" size={24} />
                <h2 className="text-2xl font-semibold text-white">You're In Control</h2>
              </div>
              <div className="space-y-3 text-neutral-300">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Choose what contact info is public</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Edit your profile anytime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Make your profile private or delete it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Hide your salary if you want</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section className="card">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-neutral-400" size={24} />
                <h2 className="text-2xl font-semibold text-white">Security</h2>
              </div>
              <div className="space-y-3 text-neutral-300">
                <p>We keep your data safe:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Encrypted passwords (bcrypt)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Secure HTTPS connections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>JWT authentication tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Regular security updates</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Account Deletion */}
            <section className="card border-red-900/30">
              <div className="flex items-center gap-3 mb-4">
                <UserX className="text-red-400" size={24} />
                <h2 className="text-2xl font-semibold text-white">Want Out?</h2>
              </div>
              <p className="text-neutral-300 mb-4">
                Delete your account anytime from profile settings. This will permanently remove:
              </p>
              <ul className="space-y-2 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Your profile and all data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>All messages and conversations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Job posts you created</span>
                </li>
              </ul>
              <p className="text-neutral-400 text-sm mt-4">
                Can't undo this. Some info might be kept for legal reasons.
              </p>
            </section>

            {/* Contact Us */}
            <section className="card bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-blue-400" size={24} />
                <h2 className="text-2xl font-semibold text-white">Questions?</h2>
              </div>
              <p className="text-neutral-300 mb-4">
                Reach out anytime:
              </p>
              <a
                href="mailto:Krishnamishrajii26@gmail.com"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Krishnamishrajii26@gmail.com
              </a>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
