import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, HelpCircle, FileText, Users, Briefcase } from 'lucide-react';

export default function HelpCenterPage() {
  const faqs = [
    {
      category: 'Getting Started',
      icon: <Users size={24} />,
      questions: [
        {
          q: 'How do I create my profile?',
          a: 'Just sign up and click "Create Profile". Takes about 5 minutes. Add your skills, experience, and what kind of roles you\'re looking for.'
        },
        {
          q: 'Is this really free?',
          a: 'Yep! No credit card, no hidden fees. Create profiles, browse jobs, message people - all free, forever.'
        },
        {
          q: 'How will companies find me?',
          a: 'They can search by skills, location, experience level. Make sure your profile is complete and set to "public" so recruiters can see you.'
        },
        {
          q: 'Can I hide my contact info?',
          a: 'Absolutely. In your profile settings, you choose what\'s public and what\'s private. Your email and phone stay hidden unless you share them.'
        }
      ]
    },
    {
      category: 'For Companies',
      icon: <Briefcase size={24} />,
      questions: [
        {
          q: 'How do I post a job?',
          a: 'Click "Post a Job" in the menu. No account needed (but you can create one if you want). Jobs go live within 24 hours.'
        },
        {
          q: 'Does it cost anything?',
          a: 'Nope! Post as many jobs as you want, completely free.'
        },
        {
          q: 'How do I contact candidates?',
          a: 'Just click "Message" on their profile. Our messaging system is built-in and easy to use.'
        },
        {
          q: 'Can I filter by specific skills?',
          a: 'Yes! Use our search to filter by skills, experience, location, visa status, remote preference - whatever you need.'
        }
      ]
    },
    {
      category: 'Common Questions',
      icon: <HelpCircle size={24} />,
      questions: [
        {
          q: 'How do I delete my account?',
          a: 'Go to profile settings, scroll down to "Danger Zone", and click "Delete My Account". This is permanent and can\'t be undone.'
        },
        {
          q: 'Is my data safe?',
          a: 'Yes. We use encryption, hash your password, and never sell your info to anyone.'
        },
        {
          q: 'Can I edit my profile later?',
          a: 'Of course! Go to Dashboard → Edit Profile anytime to update anything.'
        }
      ]
    }
  ];

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
          <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-neutral-400 text-lg mb-12">
            Got questions? We've got answers 👇
          </p>

          {/* Contact Section */}
          <div className="card mb-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30">
            <h2 className="text-2xl font-semibold text-white mb-4">Need help?</h2>
            <p className="text-neutral-400 mb-6">
              Can't find what you're looking for? Just reach out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:Krishnamishrajii26@gmail.com"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Mail size={18} />
                Email Us
              </a>
              <Link
                to="/messages"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <MessageCircle size={18} />
                Send a Message
              </Link>
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqs.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-white">{section.category}</h2>
                </div>

                <div className="space-y-6">
                  {section.questions.map((item, qIdx) => (
                    <div key={qIdx} className="border-l-2 border-neutral-700 pl-4">
                      <h3 className="text-lg font-medium text-white mb-2">{item.q}</h3>
                      <p className="text-neutral-400">{item.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="card mt-12">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText size={24} />
              More Info
            </h2>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy - How we handle your data
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" onClick={() => window.scrollTo(0, 0)} className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms of Service - The rules
                </Link>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/krishna--mishra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Connect with Krishna (the creator) on LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
