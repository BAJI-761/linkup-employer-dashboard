import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import styles from './Charts.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{label}</span>
      <span className={styles.tooltipValue}>{payload[0].value} applications</span>
    </div>
  );
};

export default function BarChartWidget() {
  const { state, computed } = useDashboard();
  const isDark = state.theme === 'dark';

  const barColor = isDark ? '#F9F9F7' : '#111111';
  const gridColor = isDark ? '#404040' : '#E5E5E0';
  const textColor = isDark ? '#A3A3A3' : '#525252';

  const total = computed.monthlyApplications.reduce((s, m) => s + m.count, 0);

  if (total === 0) {
    return (
      <motion.div
        className={styles.chartCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>MONTHLY APPLICATIONS</h3>
          <span className={styles.chartSubtitle}>Last 6 months</span>
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
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>MONTHLY APPLICATIONS</h3>
        <span className={styles.chartSubtitle}>Last 6 months</span>
      </div>
      <div className={styles.chartBody}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={computed.monthlyApplications} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="none" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="month" axisLine={{ stroke: gridColor }}
              tickLine={false} tick={{ fill: textColor, fontFamily: 'JetBrains Mono', fontSize: 11 }}
            />
            <YAxis
              axisLine={false} tickLine={false}
              tick={{ fill: textColor, fontFamily: 'JetBrains Mono', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey="count" radius={[0, 0, 0, 0]} maxBarSize={48}>
              {computed.monthlyApplications.map((_, i) => (
                <Cell key={i} fill={barColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
