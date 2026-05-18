import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function CreateJobModal({ isOpen, onClose }) {
  const { state, dispatch } = useDashboard();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'Full-time',
    workplaceType: 'On-Site',
    description: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct new job matching main app schema
    const newJob = {
      id: `job_${Date.now()}`,
      title: formData.title,
      company: state.admin.companyName || state.admin.name || 'Company',
      companyLogo: 'default',
      location: formData.location,
      trusted: true,
      salaryMin: Number(formData.salaryMin) || 0,
      salaryMax: Number(formData.salaryMax) || 0,
      salaryCurrency: "INR",
      salaryPeriod: "Month",
      jobType: formData.jobType,
      workplaceType: formData.workplaceType,
      workingHours: "9AM - 6PM",
      experience: "Not Specified",
      jobLocation: formData.location,
      tags: [formData.jobType, formData.workplaceType],
      applicants: 0,
      saved: false,
      featured: false,
      description: formData.description,
      requirements: [],
      postedDate: new Date().toISOString().split('T')[0],
      postedBy: state.admin.id,
      companyId: state.admin.companyId || `company_${Date.now()}`,
      status: 'active'
    };

    dispatch({ type: 'ADD_JOB', payload: newJob });
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
              position: 'relative', width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-card)', 
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

            <h2 style={{ fontFamily: 'var(--font-display-family)', fontSize: '2rem', margin: '0 0 1.5rem 0', lineHeight: 1, fontWeight: 900 }}>NEW DISPATCH</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Job Title</label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleChange} required
                  style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', borderRadius: 0, outline: 'none' }}
                />
              </div>

              {/* Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Location</label>
                <input 
                  type="text" name="location" value={formData.location} onChange={handleChange} required
                  style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', borderRadius: 0, outline: 'none' }}
                />
              </div>

              {/* Grid for Salary and Types */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Min Salary</label>
                  <input 
                    type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange}
                    style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', borderRadius: 0, outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Max Salary</label>
                  <input 
                    type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange}
                    style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', borderRadius: 0, outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Job Type</label>
                  <select 
                    name="jobType" value={formData.jobType} onChange={handleChange}
                    style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', borderRadius: 0, outline: 'none', appearance: 'none' }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Workplace</label>
                  <select 
                    name="workplaceType" value={formData.workplaceType} onChange={handleChange}
                    style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', borderRadius: 0, outline: 'none', appearance: 'none' }}
                  >
                    <option value="On-Site">On-Site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Description</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleChange} required rows={4}
                  style={{ padding: '0.75rem', border: '2px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', borderRadius: 0, outline: 'none', resize: 'vertical' }}
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
                PUBLISH DISPATCH
              </button>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
