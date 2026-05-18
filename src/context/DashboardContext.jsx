import { createContext, useContext, useReducer, useEffect } from 'react';
import { defaultJobs } from '../data/jobs';
import { defaultUsers } from '../data/users';
import { defaultApplications } from '../data/applications';

const DashboardContext = createContext(null);

const STORAGE_KEYS = {
  theme: 'linkup_dashboard_theme',
  jobs: 'linkup_jobs',
  users: 'linkup_users',
  applications: 'linkup_applications',
  auth: 'linkup_auth',
};

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

function getInitialState() {
  const auth = loadFromStorage(STORAGE_KEYS.auth, { isAuthenticated: false, userId: null, role: null, token: null });
  const users = loadFromStorage(STORAGE_KEYS.users, defaultUsers);
  
  let admin = null;
  if (auth.isAuthenticated && auth.userId && auth.role === 'employer') {
    admin = users.find(u => u.id === auth.userId) || null;
  }

  // Load jobs and applications
  let allJobs = loadFromStorage(STORAGE_KEYS.jobs, defaultJobs);
  let allApplications = loadFromStorage(STORAGE_KEYS.applications, defaultApplications);

  // Self-healing database mechanism: If old cached data is missing 'postedBy' field or contains stale 2025 dates, auto-reset to high-fidelity dynamic seed data
  const needsHealing = allJobs.some(j => !j.postedBy) || allApplications.some(a => (a.appliedDate || '').startsWith('2025-'));
  if (needsHealing) {
    allJobs = defaultJobs;
    allApplications = defaultApplications;
    try {
      localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(defaultJobs));
      localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(defaultApplications));
    } catch (e) {
      console.error('Database healing failed:', e);
    }
  }

  // If there's an active employer, filter jobs/applications for this employer,
  // or default to all if we just want a global view. Let's filter to just their jobs:
  const jobs = admin ? allJobs.filter(j => j.postedBy === admin.id) : allJobs;
  const jobIds = jobs.map(j => String(j.id));
  const applications = admin ? allApplications.filter(a => jobIds.includes(String(a.jobId))) : allApplications;

  return {
    auth,
    admin,
    theme: loadFromStorage(STORAGE_KEYS.theme, 'light'),
    jobs,
    users,
    applications,
    allJobs, // Keep a reference to save back to localStorage
    allApplications,
    searchQuery: '',
    activeFilter: 'all',
    currentPage: 1,
    sortBy: { column: 'postedDate', direction: 'desc' },
    sidebarOpen: false,
    toasts: [],
    notifications: [
      { id: 1, message: 'New application received for Senior Frontend Engineer', read: false, time: '2 min ago' },
      { id: 2, message: 'Sarah Chen was shortlisted for AI/ML Engineer', read: false, time: '15 min ago' },
      { id: 3, message: 'Security Analyst position has been closed', read: true, time: '8 hours ago' },
    ],
  };
}

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      const { email, password } = action.payload;
      const user = state.users.find(u => u.email === email && u.password === password);
      if (!user) return { ...state, toasts: [...state.toasts, { id: Date.now(), message: 'Invalid email or password', type: 'error' }] };
      if (user.role !== 'employer') return { ...state, toasts: [...state.toasts, { id: Date.now(), message: 'Access denied: Please use an employer account', type: 'error' }] };
      
      const auth = { isAuthenticated: true, userId: user.id, role: user.role, token: `token_${user.id}_${Date.now()}` };
      
      // Update jobs and apps based on new admin
      const jobs = state.allJobs.filter(j => j.postedBy === user.id);
      const jobIds = jobs.map(j => j.id);
      const applications = state.allApplications.filter(a => jobIds.includes(a.jobId));

      return { ...state, auth, admin: user, jobs, applications, toasts: [...state.toasts, { id: Date.now(), message: 'Login successful' }] };
    }

    case 'REGISTER': {
      const { name, email, password, companyName } = action.payload;
      const exists = state.users.find(u => u.email === email);
      if (exists) return { ...state, toasts: [...state.toasts, { id: Date.now(), message: 'Email already registered', type: 'error' }] };

      const newUser = {
        id: `employer_${Date.now()}`,
        name,
        email,
        password,
        role: 'employer',
        companyId: `company_${Date.now()}`,
        companyName: companyName || `${name}'s Company`,
        createdAt: new Date().toISOString().split('T')[0]
      };

      const users = [...state.users, newUser];
      const auth = { isAuthenticated: true, userId: newUser.id, role: 'employer', token: `token_${newUser.id}_${Date.now()}` };

      return {
        ...state,
        users,
        auth,
        admin: newUser,
        jobs: [],
        applications: [],
        toasts: [...state.toasts, { id: Date.now(), message: 'Registration successful' }]
      };
    }
    
    case 'LOGOUT':
      return { 
        ...state, 
        auth: { isAuthenticated: false, userId: null, role: null, token: null }, 
        admin: null,
        jobs: [],
        applications: []
      };

    case 'TOGGLE_THEME': {
      const next = state.theme === 'light' ? 'dark' : 'light';
      return { ...state, theme: next };
    }
    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'ADD_JOB': {
      const newJob = action.payload;
      const jobs = [newJob, ...state.jobs];
      const allJobs = [newJob, ...state.allJobs];
      return { ...state, jobs, allJobs, toasts: [...state.toasts, { id: Date.now(), message: 'Dispatch created successfully' }] };
    }
    case 'EDIT_JOB': {
      const jobs = state.jobs.map(j => j.id === action.payload.id ? { ...j, ...action.payload } : j);
      const allJobs = state.allJobs.map(j => j.id === action.payload.id ? { ...j, ...action.payload } : j);
      return { ...state, jobs, allJobs };
    }
    case 'DELETE_JOB': {
      const jobs = state.jobs.filter(j => String(j.id) !== String(action.payload));
      const allJobs = state.allJobs.filter(j => String(j.id) !== String(action.payload));
      const applications = state.applications.filter(a => String(a.jobId) !== String(action.payload));
      const allApplications = state.allApplications.filter(a => String(a.jobId) !== String(action.payload));
      return { ...state, jobs, allJobs, applications, allApplications };
    }
    case 'TOGGLE_JOB_STATUS': {
      const jobs = state.jobs.map(j => j.id === action.payload ? { ...j, status: j.status === 'active' ? 'closed' : 'active' } : j);
      const allJobs = state.allJobs.map(j => j.id === action.payload ? { ...j, status: j.status === 'active' ? 'closed' : 'active' } : j);
      return { ...state, jobs, allJobs };
    }

    case 'UPDATE_APPLICATION_STATUS': {
      const applications = state.applications.map(a => a.id === action.payload.id ? { ...a, status: action.payload.status } : a);
      const allApplications = state.allApplications.map(a => a.id === action.payload.id ? { ...a, status: action.payload.status } : a);
      return { ...state, applications, allApplications };
    }

    case 'ADD_APPLICATION': {
      const newApp = action.payload;
      const applications = [newApp, ...state.applications];
      const allApplications = [newApp, ...state.allApplications];
      
      const newNotification = {
        id: Date.now(),
        message: `New simulated application received from ${newApp.userName} for ${newApp.jobTitle}`,
        read: false,
        time: 'Just now'
      };
      
      return { 
        ...state, 
        applications, 
        allApplications, 
        notifications: [newNotification, ...state.notifications],
        toasts: [...state.toasts, { id: Date.now(), message: `Simulated application submitted for ${newApp.userName}!`, type: 'success' }] 
      };
    }

    case 'UPDATE_PROFILE': {
      const updatedAdmin = { ...state.admin, ...action.payload };
      const users = state.users.map(u => u.id === updatedAdmin.id ? updatedAdmin : u);
      return { 
        ...state, 
        admin: updatedAdmin, 
        users,
        toasts: [...state.toasts, { id: Date.now(), message: 'Profile updated successfully', type: 'success' }]
      };
    }

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    case 'SET_FILTER':
      return { ...state, activeFilter: action.payload, currentPage: 1 };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };

    case 'MARK_NOTIFICATION_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };

    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, null, getInitialState);

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(state.theme));
  }, [state.theme]);

  // Persist auth and data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(state.auth));
  }, [state.auth]);

  useEffect(() => {
    if (state.allJobs) {
      localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(state.allJobs));
    }
  }, [state.allJobs]);

  useEffect(() => {
    if (state.allApplications) {
      localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(state.allApplications));
    }
  }, [state.allApplications]);

  // We rarely edit all users from dashboard directly, but save just in case
  useEffect(() => {
    if (state.users) {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(state.users));
    }
  }, [state.users]);

  // Analytics Helpers
  const computeMonthlyApplications = (apps) => {
    // Generate an array for the last 6 months
    const months = [];
    const date = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        count: 0
      });
    }
    
    apps.forEach(app => {
      const d = new Date(app.appliedDate);
      const target = months.find(m => m.monthNum === d.getMonth() && m.year === d.getFullYear());
      if (target) target.count++;
    });
    return months.map(m => ({ month: m.month, count: m.count }));
  };

  const computeStatusDistribution = (apps) => {
    const dist = { pending: 0, reviewed: 0, shortlisted: 0, rejected: 0 };
    apps.forEach(a => { if (dist[a.status] !== undefined) dist[a.status]++; });
    return [
      { name: 'Pending', value: dist.pending },
      { name: 'Reviewed', value: dist.reviewed },
      { name: 'Shortlisted', value: dist.shortlisted },
      { name: 'Rejected', value: dist.rejected }
    ].filter(item => item.value > 0);
  };

  const computeTopSkills = (apps) => {
    const skillCounts = {};
    apps.forEach(app => {
      if (app.status !== 'rejected') {
        app.skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });
    return Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5
  };

  // Computed values
  const computed = {
    totalJobs: state.jobs.length,
    totalApplications: state.applications.length,
    totalUsers: state.users.length,
    activeJobs: state.jobs.filter(j => j.status === 'active' || !j.status).length,
    unreadNotifications: state.notifications.filter(n => !n.read).length,
    // Analytics
    monthlyApplications: computeMonthlyApplications(state.applications),
    statusDistribution: computeStatusDistribution(state.applications),
    topSkills: computeTopSkills(state.applications)
  };

  return (
    <DashboardContext.Provider value={{ state, dispatch, computed }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
}
