import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, LogOut, X, Settings } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import sidebarBrand from '../../assets/images/sidebar_brand.png';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Command Desk', subtitle: 'Analytics Overview' },
  { to: '/jobs', icon: Briefcase, label: 'Dispatches', subtitle: 'Job Management' },
  { to: '/users', icon: Users, label: 'Personnel', subtitle: 'Applicant Registry' },
  { to: '/settings', icon: Settings, label: 'Settings', subtitle: 'Employer Profile' },
];

export default function Sidebar() {
  const { state, dispatch } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  const editionNumber = Math.floor((Date.now() - new Date('2025-01-01').getTime()) / 86400000);

  const handleSignOff = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {state.sidebarOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`${styles.sidebar} ${state.sidebarOpen ? styles.open : ''}`}
        initial={false}
      >
        {/* Brand Header */}
        <div className={styles.brand}>
          <button
            className={styles.mobileClose}
            onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
          <h1 className={styles.logo}>LINKUP</h1>
          <div className={styles.edition}>
            <span className={styles.editionLabel}>EMPLOYER EDITION</span>
            <span className={styles.editionNum}>No. {editionNumber}</span>
          </div>
          <div className={styles.divider} />
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map(({ to, icon: Icon, label, subtitle }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
              >
                {isActive && (
                  <motion.div
                    className={styles.activeIndicator}
                    layoutId="sidebar-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={18} className={styles.navIcon} />
                <div className={styles.navText}>
                  <span className={styles.navLabel}>{label}</span>
                  <span className={styles.navSubtitle}>{subtitle}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.divider} />
          <div className={styles.brandImage}>
            <img src={sidebarBrand} alt="LinkUp Press" />
          </div>
          
          <a 
            href="https://linkup-eosin.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.publicPortalBtn}
          >
            <Briefcase size={16} />
            <span>PUBLIC PORTAL</span>
          </a>

          <button className={styles.signOff} onClick={handleSignOff}>
            <LogOut size={16} />
            <span>SIGN OFF</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
