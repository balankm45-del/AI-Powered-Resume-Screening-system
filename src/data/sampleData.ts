import { CandidateAnalysis, JobRequirement } from '../types';

export const DEFAULT_JOB_REQUIREMENTS: JobRequirement[] = [
  {
    id: 'job-python-dev',
    jobTitle: 'Python Developer',
    department: 'Engineering',
    requiredSkills: ['Python', 'SQL', 'Django', 'Machine Learning'],
    preferredSkills: ['Flask', 'FastAPI', 'Git', 'Docker'],
    minEducation: 'B.Tech / B.E / MCA / Computer Science Degree',
    minExperienceYears: 1,
    jobDescription:
      'We are looking for a skilled Python Developer to build and maintain scalable backend web services, integrate machine learning models, design efficient SQL database queries, and collaborate with frontend engineers. The ideal candidate has hands-on experience with Django or modern Python frameworks, understands clean code principles, and possesses solid problem-solving abilities.',
    location: 'Bangalore / Remote',
  },
  {
    id: 'job-fullstack-dev',
    jobTitle: 'Full Stack React & Node Developer',
    department: 'Product Development',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    preferredSkills: ['Next.js', 'GraphQL', 'AWS', 'Docker'],
    minEducation: 'Bachelor in Computer Science / IT or equivalent',
    minExperienceYears: 2,
    jobDescription:
      'Seeking an enthusiastic Full Stack Developer responsible for architecting responsive user interfaces with React/TypeScript and crafting robust RESTful APIs in Node.js. Must have strong understanding of state management, relational databases, and modern web application workflows.',
    location: 'Hybrid',
  },
  {
    id: 'job-data-analyst',
    jobTitle: 'Data Analyst & ML Specialist',
    department: 'Analytics',
    requiredSkills: ['Python', 'SQL', 'Pandas', 'PowerBI', 'Machine Learning'],
    preferredSkills: ['Tableau', 'Scikit-Learn', 'R', 'BigQuery'],
    minEducation: 'B.Tech / B.Sc in Statistics, Math, CS or Data Science',
    minExperienceYears: 1,
    jobDescription:
      'We are seeking a detail-oriented Data Analyst to extract business insights from complex datasets, design automated dashboards, build predictive machine learning models, and communicate actionable findings to stakeholders.',
    location: 'Remote',
  },
];

export const DEMO_CANDIDATES: CandidateAnalysis[] = [
  {
    id: 'demo-cand-1',
    fileName: 'Arun_Kumar_Resume.pdf',
    fileSize: 142000,
    candidateName: 'Arun Kumar',
    email: 'arun.kumar.dev@example.com',
    phone: '+91 98765 43210',
    education: 'B.Tech in Computer Science and Engineering (CGPA 8.6), VTU',
    skills: ['Python', 'Django', 'SQL', 'PostgreSQL', 'Machine Learning', 'Scikit-Learn', 'Git', 'FastAPI', 'REST APIs'],
    yearsOfExperience: 2,
    workExperience: [
      {
        title: 'Junior Python & Backend Engineer',
        company: 'Innovatech Solutions',
        duration: 'June 2024 - Present (1.5 years)',
        description: 'Developed scalable RESTful APIs using Django and FastAPI. Integrated machine learning classification models into web endpoints. Optimized PostgreSQL queries resulting in 35% faster response times.',
      },
      {
        title: 'Python Developer Intern',
        company: 'Apex Data Labs',
        duration: 'Jan 2024 - June 2024 (6 months)',
        description: 'Automated data extraction pipelines with Python and SQL. Built proof-of-concept ML models for customer churn prediction.',
      },
    ],
    projects: [
      {
        title: 'AI Resume Parser & Ranker',
        technologies: ['Python', 'Django', 'NLP', 'SQL'],
        description: 'Built an automated resume scanning engine extracting key tech stacks and computing cosine similarity scores with job descriptions.',
      },
      {
        title: 'Smart E-Commerce Price Predictor',
        technologies: ['Python', 'Scikit-Learn', 'Flask', 'PostgreSQL'],
        description: 'Engineered regression models predicting optimal product pricing based on historical demand spikes.',
      },
    ],
    certifications: ['Python for Data Science & ML (Coursera)', 'AWS Certified Cloud Practitioner'],
    matchScore: 92,
    breakdown: {
      skillsScore: 96,
      experienceScore: 90,
      educationScore: 95,
      descriptionScore: 88,
    },
    matchingSkills: ['Python', 'SQL', 'Django', 'Machine Learning', 'FastAPI', 'Git'],
    missingSkills: ['Flask'],
    skillsMatchPercentage: 100, // 4 out of 4 required
    recommendation: 'Strong Match',
    aiExplanation:
      'Arun Kumar demonstrates an outstanding profile alignment with the Python Developer role. He possesses 100% of all required skills (Python, SQL, Django, Machine Learning) and 2 years of relevant hands-on backend experience, surpassing the 1-year minimum requirement. His education (B.Tech CSE) directly satisfies requirements, and his projects reflect practical engineering in Django APIs and ML integrations.',
    pros: [
      'Has all 4 required skills: Python, Django, SQL, and Machine Learning',
      '2 years of proven professional backend & API development experience',
      'Relevant B.Tech in Computer Science degree',
      'Solid project portfolio with ML and Django database systems',
    ],
    cons: [
      'Experience with Docker is not explicitly listed in previous roles',
    ],
    isDemo: true,
    analyzedAt: new Date().toISOString(),
  },
  {
    id: 'demo-cand-2',
    fileName: 'Priya_Sharma_Resume.pdf',
    fileSize: 118000,
    candidateName: 'Priya Sharma',
    email: 'priya.sharma99@example.com',
    phone: '+91 98123 45678',
    education: 'MCA (Master of Computer Applications), Delhi University',
    skills: ['Python', 'SQL', 'Flask', 'HTML5/CSS3', 'Git', 'MySQL', 'Pandas'],
    yearsOfExperience: 1,
    workExperience: [
      {
        title: 'Software Developer',
        company: 'CodeCraft Technologies',
        duration: 'August 2025 - Present (1 year)',
        description: 'Built modular web services using Python and Flask. Designed relational schemas in MySQL and crafted automated reporting scripts with Pandas.',
      },
    ],
    projects: [
      {
        title: 'Hospital Management Portal',
        technologies: ['Python', 'Flask', 'SQL', 'Bootstrap'],
        description: 'Designed a multi-role appointment scheduling portal with role-based access control and automated email notifications.',
      },
      {
        title: 'Customer Survey Analytics Tool',
        technologies: ['Python', 'Pandas', 'SQL'],
        description: 'Processed structured survey responses to generate analytical KPI metrics.',
      },
    ],
    certifications: ['Complete Python Bootcamp (Udemy)', 'Database Design with SQL'],
    matchScore: 76,
    breakdown: {
      skillsScore: 75,
      experienceScore: 80,
      educationScore: 90,
      descriptionScore: 70,
    },
    matchingSkills: ['Python', 'SQL', 'Flask', 'Git'],
    missingSkills: ['Django', 'Machine Learning'],
    skillsMatchPercentage: 50, // 2 out of 4 required
    recommendation: 'Good Match',
    aiExplanation:
      'Priya Sharma holds a solid foundational background in Python and SQL with 1 year of professional experience building Flask web applications. She satisfies the educational criterion with an MCA degree and matches preferred skills like Flask and Git. However, she lacks direct hands-on experience with Django and Machine Learning as specified in the mandatory requirements.',
    pros: [
      'Strong core Python programming and SQL database proficiency',
      'Meets the 1-year minimum experience threshold',
      'Holds relevant MCA degree',
      'Possesses preferred skills: Flask and Git',
    ],
    cons: [
      'Missing core required skill: Django',
      'No evidence of Machine Learning experience in projects or past roles',
    ],
    isDemo: true,
    analyzedAt: new Date().toISOString(),
  },
  {
    id: 'demo-cand-3',
    fileName: 'Rahul_Verma_Resume.pdf',
    fileSize: 98000,
    candidateName: 'Rahul Verma',
    email: 'rahul.v@example.com',
    phone: '+91 97654 32198',
    education: 'B.Sc in Information Technology, Pune University',
    skills: ['Java', 'HTML', 'CSS', 'JavaScript', 'SQL', 'Core Java', 'Spring Basics'],
    yearsOfExperience: 1,
    workExperience: [
      {
        title: 'Junior Web Developer',
        company: 'WebSphere Infosystems',
        duration: 'Sept 2025 - Present (1 year)',
        description: 'Maintained frontend user interfaces using HTML, CSS, and vanilla JavaScript. Assisted in basic Java backend endpoint bug fixes.',
      },
    ],
    projects: [
      {
        title: 'Student Attendance Tracker',
        technologies: ['Java', 'Servlet', 'MySQL', 'HTML/CSS'],
        description: 'Developed an internal college tracking portal with tabular reporting.',
      },
    ],
    certifications: ['Oracle Certified Java Associate'],
    matchScore: 46,
    breakdown: {
      skillsScore: 35,
      experienceScore: 65,
      educationScore: 75,
      descriptionScore: 30,
    },
    matchingSkills: ['SQL'],
    missingSkills: ['Python', 'Django', 'Machine Learning', 'Flask', 'FastAPI'],
    skillsMatchPercentage: 25, // 1 out of 4 required
    recommendation: 'Low Match',
    aiExplanation:
      'Rahul Verma has 1 year of general web development experience with a primary focus in Java and frontend technologies (HTML/CSS). He matches only 1 out of 4 required skills (SQL). His resume does not demonstrate Python, Django, or Machine Learning skills required for this role.',
    pros: [
      'Has 1 year of software development industry exposure',
      'Basic SQL query knowledge',
    ],
    cons: [
      'Lacks Python programming language expertise',
      'No experience in Django or Python web frameworks',
      'No background in Machine Learning or predictive modeling',
      'Current tech stack is Java-oriented rather than Python',
    ],
    isDemo: true,
    analyzedAt: new Date().toISOString(),
  },
];
