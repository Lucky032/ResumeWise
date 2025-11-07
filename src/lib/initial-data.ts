import type { Resume, Template } from './types';

export const initialTemplates: Template[] = [
  {
    id: 'modern_clean',
    name: 'Modern Clean',
    category: 'modern',
    layout: 'two-column',
    previewImageUrl: '/previews/modern_clean.png',
    isPremium: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    category: 'traditional',
    layout: 'single-column',
    previewImageUrl: '/previews/professional.png',
    isPremium: false,
  },
  {
    id: 'creative',
    name: 'Creative',
    category: 'design-forward',
    layout: 'two-column',
    previewImageUrl: '/previews/creative.png',
    isPremium: false,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    category: 'modern',
    layout: 'single-column',
    previewImageUrl: '/previews/minimal.png',
    isPremium: false,
  },
  {
    id: 'executive',
    name: 'Executive',
    category: 'corporate',
    layout: 'two-column',
    previewImageUrl: '/previews/executive.png',
    isPremium: true,
  },
];

export const initialResumeData: Resume = {
  id: 'sample-resume-1',
  userId: 'user-1',
  title: 'My First Resume',
  templateId: 'modern_clean',
  content: {
    contactInfo: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '123-456-7890',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      portfolio: 'johndoe.dev',
      github: 'github.com/johndoe',
    },
    summary:
      'Highly motivated and results-oriented Software Engineer with 5+ years of experience in developing and scaling web applications. Proficient in JavaScript, React, and Node.js. Passionate about creating intuitive user experiences and solving complex problems.',
    workExperience: [
      {
        id: 'we1',
        jobTitle: 'Senior Software Engineer',
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        startDate: '01/2020',
        endDate: 'Present',
        currentlyWorking: true,
        description: [
          'Led the development of a new microservices architecture, improving system scalability by 40%.',
          'Mentored junior engineers, fostering a culture of growth and knowledge sharing.',
          'Reduced API response times by 200ms through performance optimization techniques.',
        ],
      },
      {
        id: 'we2',
        jobTitle: 'Software Engineer',
        company: 'Innovate Corp.',
        location: 'Palo Alto, CA',
        startDate: '06/2017',
        endDate: '12/2019',
        currentlyWorking: false,
        description: [
          'Developed and maintained features for a large-scale e-commerce platform using React and Redux.',
          'Collaborated with a team of 10 engineers in an Agile environment.',
          'Contributed to a 15% increase in user engagement by redesigning the checkout flow.',
        ],
      },
    ],
    education: [
      {
        id: 'edu1',
        degree: 'Master of Science in Computer Science',
        institution: 'Stanford University',
        location: 'Stanford, CA',
        graduationDate: '05/2017',
        gpa: 3.9,
      },
       {
        id: 'edu2',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        graduationDate: '05/2015',
        gpa: 3.8,
      },
    ],
    skills: {
      technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS'],
      soft: ['Team Leadership', 'Agile Methodologies', 'Problem Solving', 'Communication'],
      categories: {
        'Programming Languages': ['JavaScript', 'TypeScript', 'Python'],
        'Frameworks/Libraries': ['React', 'Node.js', 'Express.js'],
        'Databases': ['PostgreSQL', 'MongoDB', 'Redis'],
      },
    },
  },
  design: {
    primaryColor: '#00BFFF',
    fontFamily: 'Inter',
    fontSize: 10,
  },
  metadata: {
    createdAt: new Date('2023-10-01T10:00:00Z'),
    updatedAt: new Date('2023-11-05T14:30:00Z'),
  },
};
