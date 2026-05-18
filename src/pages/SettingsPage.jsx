import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const { state, dispatch } = useDashboard();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    industry: '',
  });

  useEffect(() => {
    if (state.admin) {
      setFormData({
        name: state.admin.name || '',
        location: state.admin.location || '',
        industry: state.admin.industry || '',
      });
    }
  }, [state.admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_PROFILE', payload: formData });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>EMPLOYER SETTINGS</h1>
        <p className={styles.subtitle}>Manage your organization profile and preferences</p>
      </div>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.cardTitle}>ORGANIZATION PROFILE</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">COMPANY NAME</label>
            <input
              className={styles.input}
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="location">HEADQUARTERS LOCATION</label>
            <input
              className={styles.input}
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="industry">INDUSTRY</label>
            <input
              className={styles.input}
              id="industry"
              name="industry"
              type="text"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g. Technology, Healthcare"
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn-primary">SAVE CHANGES</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
