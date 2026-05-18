import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { state, dispatch } = useDashboard();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    if (state.auth.isAuthenticated && state.auth.role === 'employer') {
      navigate('/');
    }
  }, [state.auth.isAuthenticated, state.auth.role, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN', payload: { email, password } });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch({ 
      type: 'REGISTER', 
      payload: { 
        name, 
        email: regEmail, 
        password: regPassword, 
        companyName 
      } 
    });
  };

  return (
    <div className={styles.splitPage}>
      {/* Left Column: Cinematic Editorial Branding */}
      <div className={styles.brandingCol}>
        <div className={styles.grainOverlay} />
        <div className={styles.brandingHeader}>
          <span className={styles.systemTag}>LINKUP CORPORATE</span>
          <span className={styles.systemEdition}>EST. 2025</span>
        </div>
        
        <div className={styles.brandingCenter}>
          <h2 className={styles.brandTitle}>THE INTEL<br/>COMMAND.</h2>
          <p className={styles.brandDesc}>
            Access the LinkUp executive network. Monitor candidate pipelines, coordinate developer dispatches, and govern corporate telemetry under a single newsprint terminal.
          </p>
        </div>
        
        {/* Animated Marquee Ticker */}
        <div className={styles.marqueeWrap}>
          <div className={styles.marqueeContent}>
            <span>COMMAND DESK — DISPATCH CONTROL — HIRING INTEL — CORPORATE TELEMETRY — EXECUTIVE ARCHIVES — </span>
            <span>COMMAND DESK — DISPATCH CONTROL — HIRING INTEL — CORPORATE TELEMETRY — EXECUTIVE ARCHIVES — </span>
          </div>
        </div>

        <div className={styles.brandingFooter}>
          <span>AUTHORIZED OFFICERS ONLY</span>
          <span>SYSTEM V2.0.4</span>
        </div>
      </div>

      {/* Right Column: Controlled Authentication Form */}
      <div className={styles.formCol}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={styles.authCard}
        >
          <div className={styles.authHeader}>
            <h1 className={styles.logo}>LINKUP</h1>
            <div className={styles.tabs}>
              <button 
                type="button"
                onClick={() => setIsRegistering(false)} 
                className={`${styles.tab} ${!isRegistering ? styles.activeTab : ''}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setIsRegistering(true)} 
                className={`${styles.tab} ${isRegistering ? styles.activeTab : ''}`}
              >
                Register
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isRegistering ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className={styles.form}
              >
                <div className={styles.field}>
                  <label className={styles.label}>Corporate Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="employer@demo.com"
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Security Passkey</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={styles.input}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  AUTHENTICATE
                </button>
                
                <div className={styles.demoTip}>
                  <span>DEMO CREDENTIALS:</span>
                  <code>employer@demo.com / password123</code>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegister}
                className={styles.form}
              >
                <div className={styles.field}>
                  <label className={styles.label}>Officer Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Williams"
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Company Brand</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google India"
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Contact Email</label>
                  <input 
                    type="email" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="sarah@google.com"
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Choose Passkey</label>
                  <input 
                    type="password" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    minLength={6}
                    className={styles.input}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  CREATE EMPLOYER ACCOUNT
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className={styles.footerNote}>
            <span>SECURE LINKUP ECOSYSTEM PROVENANCE</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
