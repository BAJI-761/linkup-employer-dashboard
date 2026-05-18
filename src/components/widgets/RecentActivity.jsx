import { motion } from 'framer-motion';
import { FileText, CheckCircle, Briefcase, Eye, XCircle } from 'lucide-react';
import { recentActivity } from '../../data/analytics';
import styles from './RecentActivity.module.css';

const iconMap = { FileText, CheckCircle, Briefcase, Eye, XCircle };

export default function RecentActivity() {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>LATEST INTELLIGENCE</h3>
        <span className={styles.subtitle}>Live feed</span>
      </div>
      <div className={styles.list}>
        {recentActivity.map((item, i) => {
          const Icon = iconMap[item.icon] || FileText;
          return (
            <motion.div
              key={item.id}
              className={styles.item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.06 }}
            >
              <div className={`${styles.iconWrap} ${styles[item.type]}`}>
                <Icon size={14} />
              </div>
              <div className={styles.content}>
                <p className={styles.message}>{item.message}</p>
                <span className={styles.time}>{item.time}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
