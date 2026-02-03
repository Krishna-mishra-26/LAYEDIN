import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Building2, MapPin, Briefcase, GraduationCap,
  Mail, Phone, Linkedin, Github, Globe, Plus, X, ArrowRight, ArrowLeft, Trash2, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const visaOptions = [
  'Citizen', 'Permanent Resident', 'Work Permit', 'Work Visa',
  'Student Visa', 'Dependent Visa', 'Need Sponsorship', 'No Restrictions', 'Not Applicable'
];

const remoteOptions = ['Remote Only', 'Hybrid', 'On-site', 'Flexible'];

const genderOptions = ['Male', 'Female'];

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

const targetRoleOptions = [
  'Software Engineer', 'Senior Software Engineer', 'Staff Engineer', 'Principal Engineer',
  'Engineering Manager', 'Tech Lead', 'Architect', 'DevOps Engineer', 'Data Engineer',
  'Data Scientist', 'ML Engineer', 'Product Manager', 'Designer', 'Solutions Architect',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer',
  'QA Engineer', 'Security Engineer', 'Cloud Engineer', 'Site Reliability Engineer',
  'Business Analyst', 'Project Manager', 'Scrum Master', 'Technical Writer'
];

const skillsSuggestions = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', 'C',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'Perl', 'Lua', 'Haskell',
  'Clojure', 'Elixir', 'Erlang', 'F#', 'Dart', 'Julia', 'MATLAB', 'Groovy',
  'Objective-C', 'Assembly', 'COBOL', 'Fortran', 'Visual Basic', 'Shell Scripting',
  'PowerShell', 'Bash', 'Solidity', 'WebAssembly',
  // Frontend
  'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'SvelteKit',
  'HTML', 'CSS', 'Sass', 'LESS', 'Tailwind CSS', 'Bootstrap', 'Material UI',
  'Chakra UI', 'Styled Components', 'Emotion', 'Redux', 'MobX', 'Zustand',
  'React Query', 'SWR', 'Webpack', 'Vite', 'Rollup', 'Parcel', 'Babel',
  'jQuery', 'Backbone.js', 'Ember.js', 'Alpine.js', 'HTMX', 'Astro',
  // Backend
  'Node.js', 'Express.js', 'Nest.js', 'Fastify', 'Koa', 'Hapi',
  'Django', 'Flask', 'FastAPI', 'Pyramid', 'Tornado',
  'Spring Boot', 'Spring', 'Hibernate', 'Maven', 'Gradle',
  'Ruby on Rails', 'Sinatra', 'Laravel', 'Symfony', 'CodeIgniter',
  'ASP.NET', '.NET Core', 'Entity Framework',
  'Gin', 'Echo', 'Fiber', 'Chi',
  'Phoenix', 'Actix', 'Rocket',
  // Databases
  'SQL', 'MySQL', 'PostgreSQL', 'SQLite', 'MariaDB', 'Oracle DB', 'SQL Server',
  'MongoDB', 'Cassandra', 'CouchDB', 'DynamoDB', 'Firebase', 'Firestore',
  'Redis', 'Memcached', 'Elasticsearch', 'Solr', 'Neo4j', 'ArangoDB',
  'InfluxDB', 'TimescaleDB', 'Supabase', 'PlanetScale', 'CockroachDB',
  // Cloud & DevOps
  'AWS', 'GCP', 'Azure', 'DigitalOcean', 'Heroku', 'Vercel', 'Netlify',
  'Docker', 'Kubernetes', 'Helm', 'Terraform', 'Ansible', 'Puppet', 'Chef',
  'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Travis CI', 'ArgoCD',
  'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'Splunk', 'ELK Stack',
  'Nginx', 'Apache', 'Caddy', 'HAProxy', 'Traefik',
  'Linux', 'Ubuntu', 'CentOS', 'Debian', 'Red Hat', 'Windows Server',
  // Data & ML
  'Machine Learning', 'Deep Learning', 'Data Science', 'AI', 'NLP',
  'Computer Vision', 'Reinforcement Learning', 'LLMs', 'GPT', 'ChatGPT',
  'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn', 'XGBoost', 'LightGBM',
  'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'Plotly',
  'Spark', 'Hadoop', 'Hive', 'Presto', 'Airflow', 'dbt', 'Dagster',
  'Snowflake', 'BigQuery', 'Redshift', 'Databricks', 'MLflow', 'Kubeflow',
  'Jupyter', 'Colab', 'Hugging Face', 'OpenAI API', 'LangChain',
  // Mobile
  'React Native', 'Flutter', 'iOS', 'Android', 'SwiftUI', 'UIKit',
  'Jetpack Compose', 'Xamarin', 'Ionic', 'Capacitor', 'Expo',
  // APIs & Protocols
  'REST APIs', 'GraphQL', 'gRPC', 'WebSockets', 'SOAP', 'OpenAPI', 'Swagger',
  'OAuth', 'JWT', 'SAML', 'SSO', 'API Gateway',
  // Testing
  'Jest', 'Mocha', 'Chai', 'Cypress', 'Playwright', 'Selenium', 'Puppeteer',
  'JUnit', 'TestNG', 'PyTest', 'RSpec', 'PHPUnit', 'NUnit',
  'TDD', 'BDD', 'E2E Testing', 'Unit Testing', 'Integration Testing',
  // Tools & Practices
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN',
  'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Trello', 'Asana',
  'CI/CD', 'DevOps', 'SRE', 'MLOps', 'DataOps', 'GitOps',
  'Microservices', 'Monolith', 'Serverless', 'Event-Driven', 'DDD',
  'Clean Architecture', 'SOLID', 'Design Patterns', 'System Design',
  // Security
  'Cybersecurity', 'Penetration Testing', 'OWASP', 'Security Auditing',
  'Encryption', 'SSL/TLS', 'Firewall', 'VPN', 'IAM', 'Zero Trust',
  // Other
  'Blockchain', 'Web3', 'Smart Contracts', 'Ethereum', 'Solana',
  'AR/VR', 'Unity', 'Unreal Engine', 'Game Development',
  'IoT', 'Embedded Systems', 'Raspberry Pi', 'Arduino',
  'Figma', 'Sketch', 'Adobe XD', 'UI/UX Design', 'Photoshop', 'Illustrator'
];

const degreeOptions = [
  'High School', 'Associate', 'Bachelor\'s', 'Master\'s', 'PhD', 
  'MBA', 'Diploma', 'Certificate', 'Bootcamp', 'Self-taught'
];

const fieldOfStudyOptions = [
  'Computer Science', 'Software Engineering', 'Information Technology',
  'Data Science', 'Electrical Engineering', 'Mechanical Engineering',
  'Business Administration', 'Economics', 'Mathematics', 'Physics',
  'Statistics', 'Information Systems', 'Cybersecurity', 'Artificial Intelligence',
  'Design', 'Communications', 'Marketing', 'Finance', 'Other'
];

const institutionSuggestions = [
  // US Universities - Top CS/Engineering
  'Massachusetts Institute of Technology (MIT)', 'Stanford University', 'Carnegie Mellon University',
  'University of California, Berkeley', 'California Institute of Technology (Caltech)',
  'Georgia Institute of Technology', 'University of Illinois Urbana-Champaign',
  'University of Michigan', 'Cornell University', 'Princeton University',
  'Harvard University', 'Yale University', 'Columbia University',
  'University of Washington', 'Univeristy of Mumbai', 'University of Texas at Austin',
  'University of California, Los Angeles (UCLA)', 'University of California, San Diego',
  'University of Southern California', 'Purdue University', 'University of Wisconsin-Madison',
  'University of Maryland', 'University of Pennsylvania', 'Duke University',
  'Northwestern University', 'Rice University', 'Brown University',
  'University of Virginia', 'Ohio State University', 'Pennsylvania State University',
  'University of Colorado Boulder', 'Arizona State University', 'University of Minnesota',
  'New York University (NYU)', 'Boston University', 'Northeastern University',
  'University of Florida', 'North Carolina State University', 'Virginia Tech',
  'Texas A&M University', 'University of Arizona', 'University of Utah',
  // International Universities
  'University of Oxford', 'University of Cambridge', 'Imperial College London',
  'ETH Zurich', 'Technical University of Munich', 'EPFL',
  'University of Toronto', 'University of Waterloo', 'McGill University',
  'University of British Columbia', 'National University of Singapore',
  'Nanyang Technological University', 'Tsinghua University', 'Peking University',
  'University of Tokyo', 'Seoul National University', 'KAIST',
  'Indian Institute of Technology (IIT) Bombay', 'IIT Delhi', 'IIT Kanpur',
  'IIT Madras', 'IIT Kharagpur', 'BITS Pilani', 'IIIT Hyderabad',
  'Indian Institute of Science (IISc)', 'Delhi University', 'Anna University',
  'RWTH Aachen', 'TU Berlin', 'University of Melbourne', 'University of Sydney',
  'Australian National University', 'Technion', 'Tel Aviv University',
  // Coding Bootcamps
  'App Academy', 'Hack Reactor', 'Flatiron School', 'General Assembly',
  'Coding Dojo', 'Fullstack Academy', 'Springboard', 'Thinkful',
  'Lambda School (BloomTech)', 'Galvanize', 'Le Wagon', 'Ironhack',
  'Codecademy', 'freeCodeCamp', 'The Odin Project', 'Launch School',
  'Turing School', 'Grace Hopper Program', 'Codesmith', '100Devs',
  'Udacity', 'Coursera', 'edX', 'Pluralsight', 'LinkedIn Learning',
  // Community Colleges
  'Community College', 'Online University', 'Open University',
  'Western Governors University', 'Southern New Hampshire University',
  'Arizona State University Online', 'Georgia Tech Online',
  // Other
  'Self-taught', 'Other'
];

const techCompanies = [
  // FAANG+
  'Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft',
  // Big Tech
  'Alphabet', 'IBM', 'Oracle', 'SAP', 'Salesforce', 'Adobe', 'Intel',
  'Nvidia', 'AMD', 'Qualcomm', 'Cisco', 'VMware', 'Dell', 'HP', 'HPE','Larsen & Toubro',
  // Social & Communication
  'Twitter', 'X', 'LinkedIn', 'Snap', 'Pinterest', 'Reddit', 'Discord',
  'Slack', 'Zoom', 'Twitch', 'TikTok', 'ByteDance', 'Telegram', 'WhatsApp',
  // Streaming & Entertainment
  'Spotify', 'YouTube', 'Hulu', 'Disney+', 'HBO Max', 'Paramount',
  'Warner Bros Discovery', 'Sony', 'EA', 'Activision Blizzard', 'Epic Games',
  'Riot Games', 'Valve', 'Unity', 'Roblox',
  // E-commerce & Marketplace
  'Shopify', 'eBay', 'Etsy', 'Wayfair', 'Chewy', 'Wish', 'Alibaba',
  'JD.com', 'Mercado Libre', 'Coupang', 'Zalando', 'ASOS',
  // Rideshare & Delivery
  'Uber', 'Lyft', 'DoorDash', 'Instacart', 'Grubhub', 'Postmates',
  'DHL', 'FedEx', 'UPS', 'Grab', 'Gojek', 'Ola', 'Didi',
  // Travel & Hospitality
  'Airbnb', 'Booking.com', 'Expedia', 'Tripadvisor', 'Kayak', 'Vrbo',
  'Marriott', 'Hilton', 'Delta', 'United Airlines', 'American Airlines',
  // Fintech & Payments
  'Stripe', 'PayPal', 'Square', 'Block', 'Visa', 'Mastercard',
  'Plaid', 'Brex', 'Chime', 'Affirm', 'Klarna', 'Afterpay', 'Adyen',
  'Revolut', 'N26', 'Monzo', 'Nubank', 'SoFi', 'Robinhood', 'Coinbase',
  'Binance', 'Kraken', 'FTX', 'Gemini', 'OpenSea', 'Uniswap',
  // Cloud & Infrastructure
  'AWS', 'Google Cloud', 'Azure', 'DigitalOcean', 'Cloudflare',
  'Akamai', 'Fastly', 'Vercel', 'Netlify', 'Heroku', 'Render',
  'MongoDB', 'Redis Labs', 'Elastic', 'Confluent', 'HashiCorp',
  // Developer Tools & SaaS
  'Atlassian', 'GitHub', 'GitLab', 'JetBrains', 'Figma', 'Notion',
  'Airtable', 'Asana', 'Monday.com', 'Smartsheet', 'Zendesk', 'Freshworks',
  'HubSpot', 'Mailchimp', 'Sendgrid', 'Twilio', 'PagerDuty',
  // Data & Analytics
  'Snowflake', 'Databricks', 'Palantir', 'Datadog', 'Splunk', 'New Relic',
  'Tableau', 'Looker', 'Amplitude', 'Mixpanel', 'Segment', 'dbt Labs',
  // Security
  'CrowdStrike', 'Palo Alto Networks', 'Fortinet', 'Okta', 'Zscaler',
  'SentinelOne', 'Cloudflare', '1Password', 'LastPass', 'Auth0',
  // AI & ML
  'OpenAI', 'Anthropic', 'DeepMind', 'Hugging Face', 'Scale AI',
  'DataRobot', 'C3.ai', 'UiPath', 'Automation Anywhere', 'Celonis',
  // Healthcare Tech
  'Epic Systems', 'Cerner', 'Veeva', 'Oscar Health', 'Ro', 'Hims',
  'Teladoc', 'Amwell', 'One Medical', 'Calm', 'Headspace', 'Peloton',
  // Hardware & Semiconductors
  'TSMC', 'Samsung', 'SK Hynix', 'Micron', 'Broadcom', 'Texas Instruments',
  'Marvell', 'Analog Devices', 'NXP', 'Arm', 'MediaTek',
  // Automotive & EV
  'Tesla', 'Rivian', 'Lucid', 'Waymo', 'Cruise', 'Aurora', 'Nuro',
  'Zoox', 'Aptiv', 'Mobileye', 'ChargePoint', 'EVgo',
  // Space & Aerospace
  'SpaceX', 'Blue Origin', 'Rocket Lab', 'Planet Labs', 'Anduril',
  'Northrop Grumman', 'Lockheed Martin', 'Boeing', 'Raytheon',
  // Consulting & Services
  'Accenture', 'Deloitte', 'McKinsey', 'BCG', 'Bain', 'KPMG', 'PwC', 'EY',
  'Cognizant', 'Infosys', 'TCS', 'Wipro', 'HCL', 'Tech Mahindra', 'Capgemini',
  // Startups & Unicorns
  'Canva', 'Miro', 'Loom', 'Linear', 'Retool', 'Webflow', 'Framer',
  'Supabase', 'PlanetScale', 'Railway', 'Fly.io', 'Neon', 'Upstash',
  'Vercel', 'Deno', 'Bun', 'Prisma', 'tRPC'
];

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
  'Netherlands', 'Ireland', 'Australia', 'India', 'Singapore',
  'Japan', 'South Korea', 'China', 'Brazil', 'Mexico', 'Spain',
  'Italy', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland',
  'Austria', 'Belgium', 'Poland', 'Portugal', 'New Zealand', 'Israel',
  'United Arab Emirates', 'Saudi Arabia', 'South Africa', 'Argentina'
];

const citiesByCountry = {
  'United States': ['New York', 'San Francisco', 'Los Angeles', 'Seattle', 'Austin', 'Boston', 'Chicago', 'Denver', 'Miami', 'Atlanta', 'Washington DC', 'San Jose', 'San Diego', 'Philadelphia', 'Phoenix', 'Dallas', 'Houston', 'Portland', 'Minneapolis', 'Raleigh'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg', 'Quebec City', 'Halifax', 'Victoria'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Bristol', 'Leeds', 'Liverpool', 'Cambridge', 'Oxford'],
  'Germany': ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dresden', 'Hannover'],
  'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Bordeaux', 'Lille', 'Strasbourg', 'Montpellier'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda'],
  'Ireland': ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kilkenny'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Hobart'],
  'India': ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Gurgaon', 'Noida'],
  'Singapore': ['Singapore'],
  'Japan': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kyoto', 'Kobe'],
  'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju'],
  'China': ['Beijing', 'Shanghai', 'Shenzhen', 'Hangzhou', 'Guangzhou', 'Chengdu', 'Nanjing', 'Wuhan'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Curitiba'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Cancún'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Malaga', 'Zaragoza'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Bologna', 'Venice'],
  'Sweden': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås'],
  'Norway': ['Oslo', 'Bergen', 'Trondheim', 'Stavanger'],
  'Denmark': ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg'],
  'Finland': ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu'],
  'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'],
  'Austria': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck'],
  'Belgium': ['Brussels', 'Antwerp', 'Ghent', 'Bruges', 'Leuven'],
  'Poland': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk'],
  'Portugal': ['Lisbon', 'Porto', 'Braga', 'Coimbra', 'Faro'],
  'New Zealand': ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Dunedin'],
  'Israel': ['Tel Aviv', 'Jerusalem', 'Haifa', 'Herzliya', 'Ramat Gan'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'],
  'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata']
};

// Autocomplete Dropdown Component
function AutocompleteInput({ value, onChange, suggestions, placeholder, label, required = false, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    if (inputValue.length > 0) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 10);
      setFilteredSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          {label} {required && '*'}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.length > 0) {
              const filtered = suggestions.filter(s => 
                s.toLowerCase().includes(value.toLowerCase())
              ).slice(0, 10);
              setFilteredSuggestions(filtered);
              setIsOpen(filtered.length > 0);
            }
          }}
          className="input-field w-full"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
        <ChevronDown 
          size={16} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" 
        />
      </div>
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-4 py-2 text-left text-neutral-200 hover:bg-neutral-700 transition-colors"
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Multi-select Dropdown Component
function MultiSelectDropdown({ value, onChange, options, placeholder, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase()) && !value.includes(opt)
  );

  const handleSelect = (option) => {
    onChange([...value, option]);
    setSearch('');
  };

  const handleRemove = (option) => {
    onChange(value.filter(v => v !== option));
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <div 
        className="input-field min-h-[44px] cursor-text flex flex-wrap gap-2 items-center"
        onClick={() => setIsOpen(true)}
      >
        {value.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-600 text-neutral-200 rounded text-sm"
          >
            {item}
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); handleRemove(item); }}
              className="hover:text-white"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-neutral-500 min-w-[100px]"
          placeholder={value.length === 0 ? placeholder : 'Add more...'}
        />
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.slice(0, 10).map((option, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-4 py-2 text-left text-neutral-200 hover:bg-neutral-700 transition-colors"
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CreateProfilePage() {
  const navigate = useNavigate();
  const { createProfile, user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    headline: '',
    bio: '',
    currentTitle: '',
    yearsOfExperience: '',
    skills: [],
    layoffCompany: '',
    layoffDate: '',
    layoffReason: 'Restructuring',
    currentStatus: 'Actively Looking', // default
    availableFrom: '', // empty by default
    remotePreference: 'Flexible',
    country: '',
    city: '',
    visaStatus: 'Not Applicable',
    willingToRelocate: false,
    lookingFor: [],
    preferredLocations: [],
    salaryExpectation: {
      min: '',
      max: '',
      currency: 'USD',
      isVisible: false
    },
    experience: [],
    education: [],
    resumeUrl: '',
    profilePhoto: '',
    contactInfo: {
      email: { value: user?.email || '', isVisible: true },
      phone: { value: '', isVisible: false },
      linkedin: { value: '', isVisible: true },
      github: { value: '', isVisible: true },
      portfolio: { value: '', isVisible: true }
    }
  });

  // Experience form
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    location: '',
    employmentType: 'Full-time',
    description: ''
  });

  // Education form
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: ''
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      if (subChild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: type === 'checkbox' ? checked : value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.position && newExperience.startDate) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience }]
      }));
      setNewExperience({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        location: '',
        employmentType: 'Full-time',
        description: ''
      });
    } else {
      toast.error('Please fill in company, position, and start date');
    }
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addEducation = () => {
    if (newEducation.institution) {
      // Convert month/year to date format for storage
      const startDate = newEducation.startYear ? `${newEducation.startYear}-${newEducation.startMonth || '01'}-01` : '';
      const endDate = newEducation.endYear ? `${newEducation.endYear}-${newEducation.endMonth || '01'}-01` : '';
      
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { 
          institution: newEducation.institution,
          degree: newEducation.degree,
          field: newEducation.field,
          startDate,
          endDate
        }]
      }));
      setNewEducation({
        institution: '',
        degree: '',
        field: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: ''
      });
    } else {
      toast.error('Please fill in institution name');
    }
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.gender || !formData.layoffCompany || !formData.layoffDate || !formData.country || !formData.resumeUrl) {
      toast.error('Please fill in all required fields including gender and resume');
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
        salaryExpectation: formData.salaryExpectation.min ? {
          min: parseInt(formData.salaryExpectation.min),
          max: formData.salaryExpectation.max ? parseInt(formData.salaryExpectation.max) : undefined,
          currency: formData.salaryExpectation.currency,
          isVisible: formData.salaryExpectation.isVisible
        } : undefined
      };
      
      await createProfile(submitData);
      toast.success('Profile created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = 4;
  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Generate month options
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Generate year options (last 50 years to next 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 56 }, (_, i) => currentYear + 5 - i);

  // Get cities for selected country
  const availableCities = formData.country ? (citiesByCountry[formData.country] || []) : [];

  return (
    <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Create Your Profile</h1>
              <span className="text-neutral-400 text-sm sm:text-base">Step {step} of {totalSteps}</span>
            </div>
            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-neutral-500 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-neutral-500">
              <span className={step >= 1 ? 'text-neutral-300' : ''}>Basic Info</span>
              <span className={step >= 2 ? 'text-neutral-300' : ''}>Status & Location</span>
              <span className={step >= 3 ? 'text-neutral-300' : ''}>Experience</span>
              <span className={step >= 4 ? 'text-neutral-300' : ''}>Contact</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <User className="text-neutral-400" size={24} />
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Senior Software Engineer | Ex-Google | Open to opportunities"
                    maxLength={200}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Current/Most Recent Title
                  </label>
                  <input
                    type="text"
                    name="currentTitle"
                    value={formData.currentTitle}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Software Engineer"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="5"
                    min="0"
                    max="50"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Bio / About You
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="input-field"
                    rows={4}
                    placeholder="Tell us about yourself, your experience, and what you're looking for..."
                    maxLength={2000}
                  />
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                    Next <ArrowRight size={18} className="text-black" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Layoff & Status Info */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Building2 className="text-neutral-400" size={24} />
                  Layoff & Work Status
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <AutocompleteInput
                    value={formData.layoffCompany}
                    onChange={(val) => setFormData(prev => ({ ...prev, layoffCompany: val }))}
                    suggestions={techCompanies}
                    placeholder="Google"
                    label="Previous Company (Layoff)"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Layoff Date *
                    </label>
                    <input
                      type="date"
                      name="layoffDate"
                      value={formData.layoffDate}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Layoff Reason (Optional)
                  </label>
                  <select
                    name="layoffReason"
                    value={['Restructuring', 'Cost Cutting', 'Company Shutdown', 'Merger/Acquisition'].includes(formData.layoffReason) ? formData.layoffReason : 'Other'}
                    onChange={(e) => {
                      if (e.target.value === 'Other') {
                        setFormData(prev => ({ ...prev, layoffReason: '' }));
                      } else {
                        setFormData(prev => ({ ...prev, layoffReason: e.target.value }));
                      }
                    }}
                    className="input-field"
                  >
                    <option value="Restructuring">Restructuring</option>
                    <option value="Cost Cutting">Cost Cutting</option>
                    <option value="Company Shutdown">Company Shutdown</option>
                    <option value="Merger/Acquisition">Merger/Acquisition</option>
                    <option value="Other">Other (specify below)</option>
                  </select>
                  {!['Restructuring', 'Cost Cutting', 'Company Shutdown', 'Merger/Acquisition'].includes(formData.layoffReason) && (
                    <input
                      type="text"
                      name="layoffReason"
                      value={formData.layoffReason}
                      onChange={handleChange}
                      placeholder="Enter custom reason..."
                      className="input-field mt-2"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <AutocompleteInput
                    value={formData.country}
                    onChange={(val) => setFormData(prev => ({ ...prev, country: val, city: '' }))}
                    suggestions={countries}
                    placeholder="United States"
                    label="Country"
                    required
                  />
                  <AutocompleteInput
                    value={formData.city}
                    onChange={(val) => setFormData(prev => ({ ...prev, city: val }))}
                    suggestions={availableCities}
                    placeholder="San Francisco"
                    label="City"
                    disabled={!formData.country}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Visa Status
                    </label>
                    <select
                      name="visaStatus"
                      value={formData.visaStatus}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {visaOptions.map(visa => (
                        <option key={visa} value={visa}>{visa}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Preferences
                    </label>
                    <select
                      name="remotePreference"
                      value={formData.remotePreference}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {remoteOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Available From
                  </label>
                  <input
                    type="month"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    className="input-field"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    When are you available to start a new position?
                  </p>
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="willingToRelocate"
                      checked={formData.willingToRelocate}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-neutral-600 text-neutral-500 focus:ring-neutral-500"
                    />
                    <span className="text-neutral-300">Willing to relocate</span>
                  </label>
                </div>

                {/* Skills with Autocomplete */}
                <div className="mb-4">
                  <MultiSelectDropdown
                    value={formData.skills}
                    onChange={(skills) => setFormData(prev => ({ ...prev, skills }))}
                    options={skillsSuggestions}
                    placeholder="Type to search skills (e.g., JavaScript, Python)"
                    label="Skills"
                  />
                </div>

                {/* Looking For - Multi-select */}
                <div className="mb-4">
                  <MultiSelectDropdown
                    value={formData.lookingFor}
                    onChange={(roles) => setFormData(prev => ({ ...prev, lookingFor: roles }))}
                    options={targetRoleOptions}
                    placeholder="Select target roles"
                    label="Looking For (Target Roles)"
                  />
                </div>

                {/* Preferred Locations */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Preferred Locations (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.preferredLocations.map((location, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 flex items-center gap-2"
                      >
                        {location}
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            preferredLocations: prev.preferredLocations.filter((_, i) => i !== idx)
                          }))}
                          className="text-neutral-500 hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Type a location and press Enter (e.g., San Francisco, CA)"
                    className="input-field"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        e.preventDefault();
                        const location = e.target.value.trim();
                        if (!formData.preferredLocations.includes(location)) {
                          setFormData(prev => ({
                            ...prev,
                            preferredLocations: [...prev.preferredLocations, location]
                          }));
                        }
                        e.target.value = '';
                      }
                    }}
                  />
                  <p className="text-xs text-neutral-500 mt-1">Press Enter to add each location</p>
                </div>

                {/* Salary Expectation */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Salary Expectation (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      placeholder="Min (e.g., 100000)"
                      value={formData.salaryExpectation.min}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        salaryExpectation: { ...prev.salaryExpectation, min: e.target.value }
                      }))}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Max (e.g., 150000)"
                      value={formData.salaryExpectation.max}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        salaryExpectation: { ...prev.salaryExpectation, max: e.target.value }
                      }))}
                      className="input-field"
                    />
                    <select
                      value={formData.salaryExpectation.currency}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        salaryExpectation: { ...prev.salaryExpectation, currency: e.target.value }
                      }))}
                      className="input-field"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                      <option value="INR">INR</option>
                      <option value="SGD">SGD</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.salaryExpectation.isVisible}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        salaryExpectation: { ...prev.salaryExpectation, isVisible: e.target.checked }
                      }))}
                      className="w-4 h-4 rounded border-neutral-600"
                    />
                    <span className="text-sm text-neutral-400">Show salary on my profile</span>
                  </label>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="btn-secondary flex items-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                    Next <ArrowRight size={18} className="text-black" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Experience & Education */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Experience Section */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Briefcase className="text-neutral-400" size={24} />
                    Work Experience
                  </h2>

                  {/* Added Experiences */}
                  {formData.experience.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {formData.experience.map((exp, index) => (
                        <div key={index} className="p-4 bg-neutral-700/50 rounded-xl flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{exp.position}</h4>
                            <p className="text-neutral-400">{exp.company}</p>
                            <p className="text-sm text-neutral-400">
                              {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              {' - '}
                              {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                              {exp.location && ` • ${exp.location}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-neutral-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Experience Form */}
                  <div className="p-4 border border-dashed border-neutral-600 rounded-xl">
                    <h4 className="font-medium text-neutral-300 mb-4">Add Experience</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <AutocompleteInput
                        value={newExperience.company}
                        onChange={(val) => setNewExperience(prev => ({ ...prev, company: val }))}
                        suggestions={techCompanies}
                        placeholder="Google"
                        label="Company *"
                      />
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Position *</label>
                        <input
                          type="text"
                          name="position"
                          value={newExperience.position}
                          onChange={handleExperienceChange}
                          className="input-field"
                          placeholder="Software Engineer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Start Date *</label>
                        <input
                          type="date"
                          name="startDate"
                          value={newExperience.startDate}
                          onChange={handleExperienceChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={newExperience.endDate}
                          onChange={handleExperienceChange}
                          className="input-field"
                          disabled={newExperience.isCurrent}
                        />
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isCurrent"
                            checked={newExperience.isCurrent}
                            onChange={handleExperienceChange}
                            className="w-4 h-4 rounded border-neutral-600 text-neutral-500"
                          />
                          <span className="text-sm text-neutral-400">I currently work here</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={newExperience.location}
                          onChange={handleExperienceChange}
                          className="input-field"
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Employment Type</label>
                        <select
                          name="employmentType"
                          value={newExperience.employmentType}
                          onChange={handleExperienceChange}
                          className="input-field"
                        >
                          {employmentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={newExperience.description}
                        onChange={handleExperienceChange}
                        className="input-field"
                        rows={3}
                        placeholder="Describe your role and achievements..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addExperience}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Plus size={18} /> Confirm Add Experience
                    </button>
                  </div>
                </div>

                {/* Education Section */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <GraduationCap className="text-neutral-400" size={24} />
                    Education
                  </h2>

                  {/* Added Education */}
                  {formData.education.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {formData.education.map((edu, index) => (
                        <div key={index} className="p-4 bg-neutral-700/50 rounded-xl flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{edu.institution}</h4>
                            <p className="text-neutral-400">
                              {edu.degree && `${edu.degree}`}
                              {edu.field && ` in ${edu.field}`}
                            </p>
                            <p className="text-sm text-neutral-400">
                              {edu.startDate && new Date(edu.startDate).getFullYear()}
                              {edu.endDate && ` - ${new Date(edu.endDate).getFullYear()}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-neutral-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Education Form */}
                  <div className="p-4 border border-dashed border-neutral-600 rounded-xl">
                    <h4 className="font-medium text-neutral-300 mb-4">Add Education</h4>
                    
                    <div className="mb-4">
                      <AutocompleteInput
                        value={newEducation.institution}
                        onChange={(val) => setNewEducation(prev => ({ ...prev, institution: val }))}
                        suggestions={institutionSuggestions}
                        placeholder="University of California, Berkeley"
                        label="Institution *"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Degree</label>
                        <select
                          name="degree"
                          value={newEducation.degree}
                          onChange={handleEducationChange}
                          className="input-field"
                        >
                          <option value="">Select Degree</option>
                          {degreeOptions.map(degree => (
                            <option key={degree} value={degree}>{degree}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <AutocompleteInput
                          value={newEducation.field}
                          onChange={(val) => setNewEducation(prev => ({ ...prev, field: val }))}
                          suggestions={fieldOfStudyOptions}
                          placeholder="Computer Science"
                          label="Field of Study"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Start (MM/YYYY)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            name="startMonth"
                            value={newEducation.startMonth}
                            onChange={handleEducationChange}
                            className="input-field"
                          >
                            <option value="">Month</option>
                            {months.map(m => (
                              <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                          </select>
                          <select
                            name="startYear"
                            value={newEducation.startYear}
                            onChange={handleEducationChange}
                            className="input-field"
                          >
                            <option value="">Year</option>
                            {years.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">End (MM/YYYY)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            name="endMonth"
                            value={newEducation.endMonth}
                            onChange={handleEducationChange}
                            className="input-field"
                          >
                            <option value="">Month</option>
                            {months.map(m => (
                              <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                          </select>
                          <select
                            name="endYear"
                            value={newEducation.endYear}
                            onChange={handleEducationChange}
                            className="input-field"
                          >
                            <option value="">Year</option>
                            {years.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addEducation}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Plus size={18} /> Confirm Add Education
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="btn-secondary flex items-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                    Next <ArrowRight size={18} className="text-black" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Contact Info */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Mail className="text-neutral-400" size={24} />
                  Contact Information
                </h2>

                <p className="text-neutral-400 mb-6">
                  Choose what contact information to display on your public profile.
                </p>

                {/* Email */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                      <Mail size={16} /> Email
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="contactInfo.email.isVisible"
                        checked={formData.contactInfo.email.isVisible}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-neutral-600 text-neutral-500 focus:ring-neutral-500"
                      />
                      <span className="text-sm text-neutral-400">Show publicly</span>
                    </label>
                  </div>
                  <input
                    type="email"
                    name="contactInfo.email.value"
                    value={formData.contactInfo.email.value}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                      <Phone size={16} /> Phone
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="contactInfo.phone.isVisible"
                        checked={formData.contactInfo.phone.isVisible}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-neutral-600 text-neutral-500 focus:ring-neutral-500"
                      />
                      <span className="text-sm text-neutral-400">Show publicly</span>
                    </label>
                  </div>
                  <input
                    type="tel"
                    name="contactInfo.phone.value"
                    value={formData.contactInfo.phone.value}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* LinkedIn */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                      <Linkedin size={16} /> LinkedIn
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="contactInfo.linkedin.isVisible"
                        checked={formData.contactInfo.linkedin.isVisible}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-neutral-600 text-neutral-500 focus:ring-neutral-500"
                      />
                      <span className="text-sm text-neutral-400">Show publicly</span>
                    </label>
                  </div>
                  <input
                    type="url"
                    name="contactInfo.linkedin.value"
                    value={formData.contactInfo.linkedin.value}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                {/* GitHub */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                      <Github size={16} /> GitHub
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="contactInfo.github.isVisible"
                        checked={formData.contactInfo.github.isVisible}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-neutral-600 text-neutral-500 focus:ring-neutral-500"
                      />
                      <span className="text-sm text-neutral-400">Show publicly</span>
                    </label>
                  </div>
                  <input
                    type="url"
                    name="contactInfo.github.value"
                    value={formData.contactInfo.github.value}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                {/* Portfolio */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                      <Globe size={16} /> Portfolio / Website
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="contactInfo.portfolio.isVisible"
                        checked={formData.contactInfo.portfolio.isVisible}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-neutral-600 text-neutral-500 focus:ring-neutral-500"
                      />
                      <span className="text-sm text-neutral-400">Show publicly</span>
                    </label>
                  </div>
                  <input
                    type="url"
                    name="contactInfo.portfolio.value"
                    value={formData.contactInfo.portfolio.value}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Resume Upload - Required */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Resume URL * (Required)
                  </label>
                  <input
                    type="url"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://drive.google.com/your-resume or LinkedIn PDF URL"
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Upload your resume to Google Drive, Dropbox, or any cloud storage and paste the public link here.
                  </p>
                </div>

                {/* Profile Photo - Optional */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Profile Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="profilePhoto"
                    value={formData.profilePhoto}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Add a professional photo URL (LinkedIn, Gravatar, or cloud storage link).
                  </p>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="btn-secondary flex items-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Profile <ArrowRight size={18} className="text-black" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
