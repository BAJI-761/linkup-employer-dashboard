import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const RANDOM_NAMES = [
  'Lucas Sterling', 'Aria Vance', 'Elijah Brooks', 'Elena Rostova', 
  'Marcus Thorne', 'Seraphina Finch', 'Dominic Cruz', 'Nadia Sinclair'
];

const RANDOM_EMAILS = [
  'l.sterling@email.com', 'aria.v@tech.io', 'ebrooks@cloud.net', 'elena.r@dev.com',
  'm.thorne@cyber.org', 'seraphina@design.co', 'd.cruz@systems.io', 'nadia.s@ai.tech'
];

const SKILL_POOLS = {
  frontend: ['React', 'TypeScript', 'Next.js', 'Framer Motion', 'TailwindCSS', 'CSS Modules'],
  backend: ['Node.js', 'Express', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'REST API'],
  datascience: ['Python', 'PyTorch', 'Pandas', 'scikit-learn', 'SQL', 'Data Analytics'],
  devops: ['AWS', 'Kubernetes', 'CI/CD', 'Terraform', 'Prometheus', 'Linux', 'Grafana']
};

export default function SimulateCandidateModal({ isOpen, onClose }) {
  const { state, dispatch } = useDashboard();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobId: state.jobs[0] ? String(state.jobs[0].id) : '',
    skillsString: 'React, TypeScript, CSS',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAutoGenerate = () => {
    const selectedJob = state.jobs.find(j => String(j.id) === String(formData.jobId)) || state.jobs[0];
    const randIndex = Math.floor(Math.random() * RANDOM_NAMES.length);
    const name = RANDOM_NAMES[randIndex];
    const email = RANDOM_EMAILS[randIndex];
    
    // Choose appropriate skills based on job title
    const titleLower = (selectedJob?.title || '').toLowerCase();
    let skills = SKILL_POOLS.frontend;
    if (titleLower.includes('backend') || titleLower.includes('server') || titleLower.includes('qa')) {
      skills = SKILL_POOLS.backend;
    } else if (titleLower.includes('data') || titleLower.includes('science') || titleLower.includes('ml') || titleLower.includes('ai')) {
      skills = SKILL_POOLS.datascience;
    } else if (titleLower.includes('devops') || titleLower.includes('cloud') || titleLower.includes('sre') || titleLower.includes('security')) {
      skills = SKILL_POOLS.devops;
    }

    // Select 3 random skills
    const chosen = [...skills].sort(() => 0.5 - Math.random()).slice(0, 3);

    setFormData({
      name,
      email,
      jobId: selectedJob ? String(selectedJob.id) : '',
      skillsString: chosen.join(', '),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedJob = state.jobs.find(j => String(j.id) === String(formData.jobId));
    if (!selectedJob) return;

    const newApp = {
      id: Date.now(),
      userId: `user_sim_${Date.now()}`,
      userName: formData.name,
      userEmail: formData.email,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      skills: formData.skillsString.split(',').map(s => s.trim()).filter(Boolean),
    };

    dispatch({ type: 'ADD_APPLICATION', payload: newApp });
    onClose();
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'grid', placeItems: 'center', overflowY: 'auto', padding: '2rem 1rem' }}>
          <motion.div 
            variants={overlayVariants} initial="hidden" animate="visible" exit="hidden"
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: -1 }}
          />
          
          <motion.div 
            variants={modalVariants} initial="hidden" animate="visible" exit="exit"
            style={{ 
              position: 'relative', width: '100%', maxWidth: '550px', backgroundColor: 'var(--bg-card)', 
              border: '3px solid var(--border)', boxShadow: 'var(--shadow-float)', padding: '2rem',
              borderRadius: '0px', zIndex: 1
            }}
          >
            <button 
              onClick={onClose}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem 0' }}>
              <h2 style={{ fontFamily: 'var(--font-display-family)', fontSize: '2rem', lineHeight: 1, fontWeight: 900, margin: 0 }}>SIMULATE APPLICANT</h2>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Quick Generate Action */}
              <button 
                type="button" 
                onClick={handleAutoGenerate}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '0.75rem', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)',
                  border: '2px dashed var(--border)', cursor: 'pointer', fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', borderRadius: 0,
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                  e.currentTarget.style.color = 'var(--bg-page)';
                  e.currentTarget.style.borderStyle = 'solid';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-page)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderStyle = 'dashed';
                }}
              >
                <Sparkles size={14} />
                AUTO-FILL RANDOM HIGHER-INTELLIGENCE PROFILE
              </button>

              {/* Target Job */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Target Dispatch / Position</label>
                <select 
                  name="jobId" value={formData.jobId} onChange={handleChange} required
                  style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', borderRadius: 0, outline: 'none' }}
                >
                  <option value="" disabled>-- Select a position --</option>
                  {state.jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title} ({j.location})</option>
                  ))}
                </select>
              </div>

              {/* Candidate Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Candidate Full Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', borderRadius: 0, outline: 'none' }}
                />
              </div>

              {/* Candidate Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Contact Email Address</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', borderRadius: 0, outline: 'none' }}
                />
              </div>

              {/* Candidate Skills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Skills (Comma-separated)</label>
                <input 
                  type="text" name="skillsString" value={formData.skillsString} onChange={handleChange} required
                  style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', borderRadius: 0, outline: 'none' }}
                />
              </div>

              {/* Submit */}
              <button 
                type="submit"
                style={{
                  marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg-page)',
                  fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--text-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--text-primary)'}
              >
                SUBMIT SIMULATED APPLICATION
              </button>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
