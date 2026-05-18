import styles from './StatusBadge.module.css';

const statusConfig = {
  active: { label: 'ACTIVE', className: 'active' },
  closed: { label: 'CLOSED', className: 'closed' },
  pending: { label: 'PENDING', className: 'pending' },
  reviewed: { label: 'REVIEWED', className: 'reviewed' },
  shortlisted: { label: 'SHORTLISTED', className: 'shortlisted' },
  rejected: { label: 'REJECTED', className: 'rejected' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  return <span className={`${styles.badge} ${styles[config.className]}`}>{config.label}</span>;
}
