import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ToastContainer from '../shared/Toast';
import PageTransition from '../shared/PageTransition';
import styles from './DashboardShell.module.css';

export default function DashboardShell() {
  const location = useLocation();

  // Mouse-reactive ambient background
  useEffect(() => {
    const handler = (e) => {
      const x = ((e.clientX / window.innerWidth) * 100).toFixed(1);
      const y = ((e.clientY / window.innerHeight) * 100).toFixed(1);
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={styles.shell}>
      <div className="ambient-bg" />
      <div className="noise-overlay" />
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <main className={styles.content}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
