import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Moon, Sun, Bell, Menu, ChevronDown } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import styles from './TopBar.module.css';

export default function TopBar() {
  const { state, dispatch, computed } = useDashboard();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOff = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <header className={styles.topbar}>
      {/* Mobile Menu Button */}
      <button
        className={styles.menuBtn}
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search archives..."
          className={styles.searchInput}
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
        />
      </div>

      {/* Right Actions */}
      <div className={styles.actions}>
        {/* Theme Toggle */}
        <button
          className={styles.iconBtn}
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            {state.theme === 'light' ? (
              <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon size={18} />
              </motion.div>
            ) : (
              <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className={styles.dropdownWrap} ref={notifRef}>
          <button
            className={styles.iconBtn}
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {computed.unreadNotifications > 0 && (
              <span className={styles.badge}>{computed.unreadNotifications}</span>
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className={styles.dropdown}
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.dropdownHeader}>
                  <span>NOTICES</span>
                  <button onClick={() => { dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' }); }}>Mark all read</button>
                </div>
                {state.notifications.map(n => (
                  <div
                    key={n.id}
                    className={`${styles.notifItem} ${!n.read ? styles.unread : ''}`}
                    onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id })}
                  >
                    <p className={styles.notifMessage}>{n.message}</p>
                    <span className={styles.notifTime}>{n.time}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className={styles.dropdownWrap} ref={profileRef}>
          <button
            className={styles.profileBtn}
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
          >
            <div className={styles.avatar}>{state.admin ? state.admin.name.charAt(0) : '?'}</div>
            <span className={styles.profileName}>{state.admin ? state.admin.name : 'Unknown'}</span>
            <ChevronDown size={14} />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                className={styles.dropdown}
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.profileCard}>
                  <div className={styles.avatarLg}>{state.admin ? state.admin.name.charAt(0) : '?'}</div>
                  <div>
                    <p className={styles.profileNameLg}>{state.admin ? state.admin.name : 'Unknown'}</p>
                    <p className={styles.profileEmail}>{state.admin ? state.admin.email : ''}</p>
                  </div>
                </div>
                <div className={styles.dropdownDivider} />
                <button className={styles.dropdownItem} onClick={() => { navigate('/settings'); setShowProfile(false); }}>SETTINGS</button>
                <button className={styles.dropdownItem} onClick={handleSignOff}>SIGN OFF</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

