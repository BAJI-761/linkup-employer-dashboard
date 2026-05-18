import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { motion } from 'framer-motion';
import styles from './StatCard.module.css';

export default function StatCard({ icon: Icon, label, value, trend, trendDirection, delay = 0 }) {
  const counterRef = useAnimatedCounter(value, 2);

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`${styles.trend} ${trendDirection === 'up' ? styles.trendUp : styles.trendDown}`}>
            {trendDirection === 'up' ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className={styles.value} ref={counterRef}>0</div>
      <div className={styles.label}>{label}</div>
    </motion.div>
  );
}
