import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import styles from './Charts.module.css';

const CustomLegend = ({ payload, data }) => (
  <div className={styles.legendWrap}>
    {payload.map((entry, i) => (
      <div key={i} className={styles.legendItem}>
        <span className={styles.legendDot} style={{ background: entry.color }} />
        <span className={styles.legendLabel}>{entry.value}</span>
        <span className={styles.legendCount}>{data[i]?.value}</span>
      </div>
    ))}
  </div>
);

export default function PieChartWidget() {
  const { state, computed } = useDashboard();
  const isDark = state.theme === 'dark';

  const COLORS = {
    Pending: isDark ? '#FBBF24' : '#D97706',
    Reviewed: isDark ? '#60A5FA' : '#2563EB',
    Shortlisted: isDark ? '#4ADE80' : '#16A34A',
    Rejected: isDark ? '#F87171' : '#DC2626'
  };

  const data = computed.statusDistribution.map(d => ({
    ...d,
    color: COLORS[d.name] || '#888'
  }));

  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <motion.div
        className={styles.chartCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>STATUS BREAKDOWN</h3>
          <span className={styles.chartSubtitle}>Application pipeline</span>
        </div>
        <div className={styles.chartBody} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '280px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Awaiting Data
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.chartCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>STATUS BREAKDOWN</h3>
        <span className={styles.chartSubtitle}>Application pipeline</span>
      </div>
      <div className={styles.chartBody} style={{ position: 'relative' }}>
        {/* Centered Total Label */}
        <div style={{
          position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none'
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>{total}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: '4px' }}>TOTAL</span>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data} dataKey="value" nameKey="name"
              cx="50%" cy="45%" innerRadius={65} outerRadius={95}
              stroke="var(--bg-page)" strokeWidth={3}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Legend content={<CustomLegend data={data} />} verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
