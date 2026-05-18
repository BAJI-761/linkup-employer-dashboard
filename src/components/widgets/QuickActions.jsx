import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Briefcase, Download } from 'lucide-react';
import styles from './QuickActions.module.css';

const actions = [
  { icon: PlusCircle, label: 'NEW DISPATCH', subtitle: 'Post a new job', to: '/jobs' },
  { icon: Briefcase, label: 'ALL DISPATCHES', subtitle: 'View job listings', to: '/jobs' },
  { icon: Download, label: 'EXPORT DATA', subtitle: 'Download CSV report', to: null },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>QUICK ACTIONS</h3>
      </div>
      <div className={styles.actions}>
        {actions.map(({ icon: Icon, label, subtitle, to }) => (
          <button
            key={label}
            className={styles.actionBtn}
            onClick={() => to && navigate(to)}
          >
            <Icon size={18} />
            <div className={styles.actionText}>
              <span className={styles.actionLabel}>{label}</span>
              <span className={styles.actionSub}>{subtitle}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
