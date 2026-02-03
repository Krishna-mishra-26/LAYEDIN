require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
const HiringPost = require('./models/HiringPost');

const techCompanies = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber', 
  'Lyft', 'Airbnb', 'Stripe', 'Shopify', 'Salesforce', 'Twitter', 
  'LinkedIn', 'Snap', 'Pinterest', 'Dropbox', 'Slack', 'Zoom', 'Spotify',
  'Tesla', 'Nvidia', 'Intel', 'AMD', 'Qualcomm', 'Oracle', 'IBM',
  'Cisco', 'VMware', 'Adobe', 'Atlassian', 'Twilio', 'MongoDB', 'Datadog'
];

const skills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'Go', 'Rust', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
  'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform',
  'Machine Learning', 'Data Science', 'AI', 'Deep Learning',
  'React Native', 'Flutter', 'iOS', 'Android',
  'DevOps', 'CI/CD', 'Linux', 'Git', 'Agile', 'Scrum'
];

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
  'Netherlands', 'Ireland', 'Australia', 'India', 'Singapore'
];

const cities = {
  'United States': ['San Francisco', 'New York', 'Seattle', 'Austin', 'Los Angeles', 'Boston', 'Chicago'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal'],
  'United Kingdom': ['London', 'Manchester', 'Edinburgh'],
  'Germany': ['Berlin', 'Munich', 'Hamburg'],
  'India': ['Bangalore', 'Mumbai', 'Hyderabad', 'Delhi'],
  'Singapore': ['Singapore']
};

const firstNames = [
  'James', 'Sarah', 'Michael', 'Emily', 'David', 'Emma', 'Daniel', 'Olivia',
  'Alex', 'Maria', 'Chris', 'Jessica', 'Ryan', 'Ashley', 'Kevin', 'Amanda',
  'Brian', 'Nicole', 'Jason', 'Stephanie', 'Priya', 'Raj', 'Wei', 'Yuki'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia',
  'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore',
  'Jackson', 'Martin', 'Lee', 'Patel', 'Kumar', 'Chen', 'Wang', 'Kim', 'Singh'
];

const titles = [
  'Software Engineer', 'Senior Software Engineer', 'Staff Engineer',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'ML Engineer', 'Data Engineer', 'DevOps Engineer',
  'Product Manager', 'Engineering Manager', 'Technical Lead',
  'iOS Developer', 'Android Developer', 'Mobile Developer',
  'Cloud Architect', 'Solutions Architect', 'Security Engineer',
  'QA Engineer', 'Site Reliability Engineer', 'Platform Engineer'
];

const visaStatuses = [
  'Citizen', 'Citizen', 'Citizen', 'Permanent Resident', 'H1B', 
  'H1B', 'L1', 'O1', 'F1 OPT', 'Need Sponsorship'
];

const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await HiringPost.deleteMany({});
    console.log('Cleared existing data');
    
    // Create sample profiles
    const profiles = [];
    
    for (let i = 0; i < 50; i++) {
      const email = `user${i + 1}@example.com`;
      const user = await User.create({
        email,
        password: 'password123',
        isVerified: Math.random() > 0.3
      });
      
      const country = countries[Math.floor(Math.random() * countries.length)];
      const citiesForCountry = cities[country] || ['Unknown'];
      const city = citiesForCountry[Math.floor(Math.random() * citiesForCountry.length)];
      
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const company = techCompanies[Math.floor(Math.random() * techCompanies.length)];
      
      const gender = genders[Math.floor(Math.random() * genders.length)];
      
      const profile = await Profile.create({
        user: user._id,
        firstName,
        lastName,
        gender,
        headline: `${title} | Ex-${company} | Open to opportunities`,
        bio: `Experienced ${title} with ${Math.floor(Math.random() * 10) + 3} years of experience building scalable applications. Recently laid off from ${company} and actively looking for new opportunities. Passionate about clean code, system design, and mentoring junior developers.`,
        profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`,
        resumeUrl: `https://drive.google.com/file/d/resume-${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
        currentTitle: title,
        yearsOfExperience: Math.floor(Math.random() * 15) + 2,
        skills: getRandomItems(skills, Math.floor(Math.random() * 8) + 4),
        industries: getRandomItems(['Technology', 'Finance', 'Healthcare', 'E-commerce', 'SaaS', 'AI/ML'], 2),
        layoffCompany: company,
        layoffDate: getRandomDate(new Date('2024-01-01'), new Date('2025-12-01')),
        layoffReason: 'Restructuring',
        currentStatus: ['Actively Looking', 'Open to Opportunities'][Math.floor(Math.random() * 2)],
        preferredRoles: getRandomItems(titles, 3),
        preferredLocations: getRandomItems(['Remote', 'San Francisco', 'New York', 'Seattle', 'Austin'], 3),
        remotePreference: ['Remote Only', 'Hybrid', 'Flexible'][Math.floor(Math.random() * 3)],
        country,
        city,
        visaStatus: visaStatuses[Math.floor(Math.random() * visaStatuses.length)],
        willingToRelocate: Math.random() > 0.5,
        contactInfo: {
          email: { value: email, isVisible: true },
          linkedin: { value: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`, isVisible: true },
          github: { value: `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`, isVisible: Math.random() > 0.3 },
          portfolio: { value: Math.random() > 0.5 ? `https://${firstName.toLowerCase()}.dev` : '', isVisible: true }
        },
        experience: [
          {
            company,
            position: title,
            startDate: getRandomDate(new Date('2020-01-01'), new Date('2023-01-01')),
            endDate: getRandomDate(new Date('2024-01-01'), new Date('2025-06-01')),
            description: `Led development of key features and improvements. Collaborated with cross-functional teams to deliver high-impact projects.`,
            location: city,
            employmentType: 'Full-time'
          },
          {
            company: techCompanies[Math.floor(Math.random() * techCompanies.length)],
            position: titles[Math.floor(Math.random() * titles.length)],
            startDate: getRandomDate(new Date('2017-01-01'), new Date('2020-01-01')),
            endDate: getRandomDate(new Date('2020-01-01'), new Date('2023-01-01')),
            description: `Developed and maintained core platform features. Participated in code reviews and technical design discussions.`,
            location: citiesForCountry[Math.floor(Math.random() * citiesForCountry.length)],
            employmentType: 'Full-time'
          }
        ],
        education: [
          {
            institution: ['Stanford University', 'MIT', 'UC Berkeley', 'Carnegie Mellon', 'Georgia Tech', 'University of Toronto', 'IIT Bombay'][Math.floor(Math.random() * 7)],
            degree: ["Bachelor's", "Master's"][Math.floor(Math.random() * 2)],
            field: 'Computer Science',
            startDate: new Date('2012-09-01'),
            endDate: new Date('2016-05-01')
          }
        ],
        isPublic: true,
        isFeatured: i < 6,
        profileViews: Math.floor(Math.random() * 500)
      });
      
      profiles.push(profile);
    }
    
    console.log(`Created ${profiles.length} profiles`);
    
    // Create sample hiring posts
    const hiringPosts = [];
    
    for (let i = 0; i < 20; i++) {
      const company = techCompanies[Math.floor(Math.random() * techCompanies.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      
      const post = await HiringPost.create({
        authorName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        authorTitle: 'Hiring Manager',
        authorCompany: company,
        authorEmail: `hiring@${company.toLowerCase().replace(/\s/g, '')}.com`,
        title: `${title} at ${company}`,
        company,
        companyWebsite: `https://${company.toLowerCase().replace(/\s/g, '')}.com`,
        description: `We are looking for a talented ${title} to join our team at ${company}. 
        
You will be working on cutting-edge technology and solving complex problems at scale.

**What you'll do:**
- Design and implement new features
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews

**Requirements:**
- 3+ years of experience in software development
- Strong problem-solving skills
- Excellent communication skills
- Experience with modern development practices`,
        jobType: 'Full-time',
        experienceLevel: ['Mid Level', 'Senior', 'Lead'][Math.floor(Math.random() * 3)],
        location: `${cities['United States'][Math.floor(Math.random() * cities['United States'].length)]}, USA`,
        remoteType: ['Remote', 'Hybrid', 'On-site'][Math.floor(Math.random() * 3)],
        salary: {
          min: (Math.floor(Math.random() * 5) + 10) * 10000,
          max: (Math.floor(Math.random() * 5) + 15) * 10000,
          currency: 'USD',
          isVisible: Math.random() > 0.3
        },
        skills: getRandomItems(skills, 5),
        requirements: [
          '3+ years of experience',
          'Strong CS fundamentals',
          'Experience with cloud platforms',
          'Excellent communication skills'
        ],
        benefits: [
          'Competitive salary',
          'Health insurance',
          '401k matching',
          'Remote work options',
          'Learning budget',
          'Unlimited PTO'
        ],
        visaSponsorship: Math.random() > 0.5,
        applicationUrl: `https://${company.toLowerCase().replace(/\s/g, '')}.com/careers`,
        applicationEmail: `careers@${company.toLowerCase().replace(/\s/g, '')}.com`,
        isActive: true,
        isFeatured: i < 3,
        views: Math.floor(Math.random() * 1000),
        applications: Math.floor(Math.random() * 100)
      });
      
      hiringPosts.push(post);
    }
    
    console.log(`Created ${hiringPosts.length} hiring posts`);
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: user1@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
