// Fetch jobs from external API (using free or lightweight alternative)
// We'll use a public job API or create mock data
const fetchExternalJobs = async () => {
  try {
    // Using a free job API endpoint
    // For production, you might want to use RapidAPI JSearch, LinkedIn API, or similar
    
    // For now, we'll return curated job opportunities from tech companies
    const externalJobs = [
      {
        title: 'Senior Software Engineer',
        company: 'Google',
        companyLogo: 'https://www.google.com/favicon.ico',
        location: 'San Francisco, CA',
        remoteType: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salary: '$180,000 - $250,000',
        description: 'Google is looking for experienced software engineers to join our core products team. Work on systems that impact billions of users worldwide.',
        skills: ['JavaScript', 'Python', 'System Design', 'Go'],
        visaSponsorship: true,
        url: 'https://www.google.com/careers/jobs/results/?q=software%20engineer',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Full Stack Developer',
        company: 'Meta',
        companyLogo: 'https://www.meta.com/favicon.ico',
        location: 'Menlo Park, CA',
        remoteType: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: '$160,000 - $220,000',
        description: 'Meta is building the future of communication. Join our team to work on cutting-edge technologies that connect people globally.',
        skills: ['React', 'Node.js', 'TypeScript', 'GraphQL'],
        visaSponsorship: true,
        url: 'https://www.metacareers.com/jobs/',
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'DevOps Engineer',
        company: 'Amazon',
        companyLogo: 'https://www.amazon.com/favicon.ico',
        location: 'Seattle, WA',
        remoteType: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: '$150,000 - $210,000',
        description: 'Amazon Web Services (AWS) is looking for DevOps engineers to help scale infrastructure globally. Work with cutting-edge cloud technologies.',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Linux'],
        visaSponsorship: true,
        url: 'https://www.amazon.jobs/en/',
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Product Manager',
        company: 'Apple',
        companyLogo: 'https://www.apple.com/favicon.ico',
        location: 'Cupertino, CA',
        remoteType: 'On-site',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salary: '$170,000 - $240,000',
        description: 'Join Apple\'s product team and help shape the future of technology. Work on innovative products loved by millions.',
        skills: ['Product Strategy', 'Data Analysis', 'Agile', 'User Research'],
        visaSponsorship: true,
        url: 'https://www.apple.com/careers/jobs/',
        postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Data Scientist',
        company: 'Netflix',
        companyLogo: 'https://www.netflix.com/favicon.ico',
        location: 'Los Angeles, CA',
        remoteType: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salary: '$180,000 - $260,000',
        description: 'Help millions of members discover their next favorite show or movie. Work on machine learning systems that power personalization.',
        skills: ['Python', 'Machine Learning', 'SQL', 'Spark'],
        visaSponsorship: true,
        url: 'https://jobs.netflix.com/',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Backend Engineer',
        company: 'Stripe',
        companyLogo: 'https://www.stripe.com/favicon.ico',
        location: 'San Francisco, CA',
        remoteType: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: '$160,000 - $220,000',
        description: 'Stripe is building financial infrastructure for the internet. Help developers monetize their businesses and users send money.',
        skills: ['Java', 'Go', 'TypeScript', 'System Design'],
        visaSponsorship: true,
        url: 'https://stripe.com/jobs',
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Frontend Engineer',
        company: 'Airbnb',
        companyLogo: 'https://www.airbnb.com/favicon.ico',
        location: 'San Francisco, CA',
        remoteType: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: '$150,000 - $210,000',
        description: 'Design and build beautiful user experiences for millions of travelers and hosts. Work on React and modern web technologies.',
        skills: ['React', 'TypeScript', 'CSS', 'Performance'],
        visaSponsorship: true,
        url: 'https://www.airbnb.com/careers',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Security Engineer',
        company: 'Microsoft',
        companyLogo: 'https://www.microsoft.com/favicon.ico',
        location: 'Redmond, WA',
        remoteType: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salary: '$170,000 - $230,000',
        description: 'Protect Microsoft\'s cloud infrastructure and help secure the digital world. Work on Azure security and threat detection.',
        skills: ['Cybersecurity', 'C++', 'Cloud Security', 'Networking'],
        visaSponsorship: true,
        url: 'https://careers.microsoft.com',
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'QA Engineer',
        company: 'Tesla',
        companyLogo: 'https://www.tesla.com/favicon.ico',
        location: 'Austin, TX',
        remoteType: 'On-site',
        jobType: 'Full-time',
        experienceLevel: 'Entry Level',
        salary: '$90,000 - $130,000',
        description: 'Help ensure the quality of Tesla\'s software and products. Work on testing autonomous driving systems and vehicle software.',
        skills: ['Python', 'Test Automation', 'Git', 'Linux'],
        visaSponsorship: true,
        url: 'https://www.tesla.com/careers',
        postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Solutions Architect',
        company: 'Salesforce',
        companyLogo: 'https://www.salesforce.com/favicon.ico',
        location: 'San Francisco, CA',
        remoteType: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salary: '$160,000 - $220,000',
        description: 'Design comprehensive solutions for enterprise clients using Salesforce technologies. Help customers achieve digital transformation.',
        skills: ['Salesforce', 'Cloud Architecture', 'CRM', 'SQL'],
        visaSponsorship: true,
        url: 'https://careers.salesforce.com',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    return externalJobs;
  } catch (error) {
    console.error('Error fetching external jobs:', error);
    return [];
  }
};

module.exports = { fetchExternalJobs };
