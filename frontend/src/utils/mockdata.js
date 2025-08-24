// Mock data for testing the frontend before backend integration

export const mockCandidates = [
  {
    _id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    education: 'Bachelor in Computer Science',
    yearsOfExperience: 3,
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    aiScore: 85,
    aiSummary: 'Strong frontend developer with React expertise. Good potential for full-stack roles.',
    status: 'shortlisted'
  },
  {
    _id: '2',
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    education: 'Master in Data Science',
    yearsOfExperience: 2,
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
    aiScore: 78,
    aiSummary: 'Promising data scientist with strong technical skills. Some industry experience would be beneficial.',
    status: 'new'
  },
  {
    _id: '3',
    name: 'Michael Wong',
    email: 'm.wong@example.com',
    education: 'Bachelor in Software Engineering',
    yearsOfExperience: 1,
    skills: ['Java', 'Spring Boot', 'Git', 'Agile'],
    aiScore: 62,
    aiSummary: 'Junior developer with good fundamentals. Will need mentoring but shows potential.',
    status: 'reviewing'
  }
];

export const mockStats = {
  totalCandidates: 42,
  averageScore: 73,
  statusStats: {
    new: 15,
    reviewing: 8,
    shortlisted: 12,
    interviewed: 4,
    offered: 2,
    rejected: 1
  },
  topSkills: [
    { name: 'JavaScript', count: 28 },
    { name: 'React', count: 22 },
    { name: 'Python', count: 18 }
  ]
};
