const getRelativeDateString = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const defaultApplications = [
  { id: 1, userId: 1, userName: 'Arjun Mehta', userEmail: 'arjun.mehta@email.com', jobId: 1, jobTitle: 'Senior Frontend Engineer', status: 'shortlisted', appliedDate: getRelativeDateString(2), skills: ['React', 'JavaScript', 'TypeScript'] },
  { id: 2, userId: 2, userName: 'Sarah Chen', userEmail: 'sarah.chen@email.com', jobId: 5, jobTitle: 'Data Scientist', status: 'reviewed', appliedDate: getRelativeDateString(5), skills: ['Python', 'Machine Learning', 'TensorFlow'] },
  { id: 3, userId: 3, userName: 'James Rodriguez', userEmail: 'j.rodriguez@email.com', jobId: 2, jobTitle: 'Backend Developer', status: 'pending', appliedDate: getRelativeDateString(3), skills: ['Java', 'Spring Boot', 'Microservices'] },
  { id: 4, userId: 4, userName: 'Priya Sharma', userEmail: 'priya.sharma@email.com', jobId: 3, jobTitle: 'Product Designer', status: 'shortlisted', appliedDate: getRelativeDateString(8), skills: ['UI/UX', 'Figma', 'Design Systems'] },
  { id: 5, userId: 5, userName: 'Michael Okafor', userEmail: 'm.okafor@email.com', jobId: 4, jobTitle: 'DevOps Engineer', status: 'pending', appliedDate: getRelativeDateString(10), skills: ['DevOps', 'AWS', 'Kubernetes'] },
  { id: 6, userId: 6, userName: 'Emily Zhang', userEmail: 'emily.z@email.com', jobId: 7, jobTitle: 'Full Stack Developer', status: 'rejected', appliedDate: getRelativeDateString(20), skills: ['Node.js', 'React', 'MongoDB'] },
  { id: 7, userId: 7, userName: 'David Kim', userEmail: 'david.kim@email.com', jobId: 2, jobTitle: 'Backend Developer', status: 'reviewed', appliedDate: getRelativeDateString(6), skills: ['Go', 'Rust', 'Systems Programming'] },
  { id: 8, userId: 8, userName: 'Fatima Al-Hassan', userEmail: 'fatima.h@email.com', jobId: 12, jobTitle: 'AI/ML Engineer', status: 'pending', appliedDate: getRelativeDateString(35), skills: ['Data Science', 'SQL', 'Tableau'] },
  { id: 9, userId: 9, userName: 'Alex Thompson', userEmail: 'a.thompson@email.com', jobId: 9, jobTitle: 'Mobile Developer', status: 'shortlisted', appliedDate: getRelativeDateString(25), skills: ['React Native', 'Flutter', 'Mobile Dev'] },
  { id: 10, userId: 10, userName: 'Nina Petrov', userEmail: 'nina.p@email.com', jobId: 10, jobTitle: 'Security Analyst', status: 'reviewed', appliedDate: getRelativeDateString(28), skills: ['Cybersecurity', 'Penetration Testing', 'SIEM'] },
  { id: 11, userId: 1, userName: 'Arjun Mehta', userEmail: 'arjun.mehta@email.com', jobId: 7, jobTitle: 'Full Stack Developer', status: 'rejected', appliedDate: getRelativeDateString(19), skills: ['React', 'JavaScript', 'TypeScript'] },
  { id: 12, userId: 2, userName: 'Sarah Chen', userEmail: 'sarah.chen@email.com', jobId: 12, jobTitle: 'AI/ML Engineer', status: 'shortlisted', appliedDate: getRelativeDateString(36), skills: ['Python', 'Machine Learning', 'TensorFlow'] },
  { id: 13, userId: 3, userName: 'James Rodriguez', userEmail: 'j.rodriguez@email.com', jobId: 4, jobTitle: 'DevOps Engineer', status: 'pending', appliedDate: getRelativeDateString(12), skills: ['Java', 'Spring Boot', 'Microservices'] },
  { id: 14, userId: 6, userName: 'Emily Zhang', userEmail: 'emily.z@email.com', jobId: 1, jobTitle: 'Senior Frontend Engineer', status: 'reviewed', appliedDate: getRelativeDateString(1), skills: ['Node.js', 'React', 'MongoDB'] },
  { id: 15, userId: 4, userName: 'Priya Sharma', userEmail: 'priya.sharma@email.com', jobId: 8, jobTitle: 'UX Researcher', status: 'pending', appliedDate: getRelativeDateString(24), skills: ['UI/UX', 'Figma', 'Design Systems'] },
  { id: 16, userId: 5, userName: 'Michael Okafor', userEmail: 'm.okafor@email.com', jobId: 15, jobTitle: 'Cloud Architect', status: 'reviewed', appliedDate: getRelativeDateString(42), skills: ['DevOps', 'AWS', 'Kubernetes'] },
  { id: 17, userId: 7, userName: 'David Kim', userEmail: 'david.kim@email.com', jobId: 15, jobTitle: 'Cloud Architect', status: 'pending', appliedDate: getRelativeDateString(44), skills: ['Go', 'Rust', 'Systems Programming'] },
  { id: 18, userId: 8, userName: 'Fatima Al-Hassan', userEmail: 'fatima.h@email.com', jobId: 5, jobTitle: 'Data Scientist', status: 'shortlisted', appliedDate: getRelativeDateString(15), skills: ['Data Science', 'SQL', 'Tableau'] },
  { id: 19, userId: 9, userName: 'Alex Thompson', userEmail: 'a.thompson@email.com', jobId: 6, jobTitle: 'Marketing Intern', status: 'rejected', appliedDate: getRelativeDateString(18), skills: ['React Native', 'Flutter', 'Mobile Dev'] },
  { id: 20, userId: 10, userName: 'Nina Petrov', userEmail: 'nina.p@email.com', jobId: 4, jobTitle: 'DevOps Engineer', status: 'pending', appliedDate: getRelativeDateString(11), skills: ['Cybersecurity', 'Penetration Testing', 'SIEM'] },
  { id: 21, userId: 1, userName: 'Arjun Mehta', userEmail: 'arjun.mehta@email.com', jobId: 9, jobTitle: 'Mobile Developer', status: 'pending', appliedDate: getRelativeDateString(27), skills: ['React', 'JavaScript', 'TypeScript'] },
  { id: 22, userId: 6, userName: 'Emily Zhang', userEmail: 'emily.z@email.com', jobId: 11, jobTitle: 'Technical Writer', status: 'reviewed', appliedDate: getRelativeDateString(32), skills: ['Node.js', 'React', 'MongoDB'] },
  { id: 23, userId: 3, userName: 'James Rodriguez', userEmail: 'j.rodriguez@email.com', jobId: 13, jobTitle: 'QA Engineer', status: 'shortlisted', appliedDate: getRelativeDateString(38), skills: ['Java', 'Spring Boot', 'Microservices'] },
  { id: 24, userId: 4, userName: 'Priya Sharma', userEmail: 'priya.sharma@email.com', jobId: 14, jobTitle: 'Design Intern', status: 'rejected', appliedDate: getRelativeDateString(40), skills: ['UI/UX', 'Figma', 'Design Systems'] },
  { id: 25, userId: 2, userName: 'Sarah Chen', userEmail: 'sarah.chen@email.com', jobId: 16, jobTitle: 'Content Strategist', status: 'pending', appliedDate: getRelativeDateString(45), skills: ['Python', 'Machine Learning', 'TensorFlow'] },
];
