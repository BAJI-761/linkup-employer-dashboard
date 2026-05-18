import { memo } from 'react';
import styles from './KanbanCard.module.css';

const KanbanCard = memo(({ application, onDragStart, onDragEnd }) => {
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Generate a mock score based on name length for demo purposes, 
  // or use matchScore if it exists
  const score = application.matchScore || Math.min(99, 70 + application.userName.length * 3);

  return (
    <div 
      className={styles.card}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          {application.userName.charAt(0)}
        </div>
        <div>
          <h4 className={styles.name}>{application.userName}</h4>
          <p className={styles.jobTitle}>{application.jobTitle}</p>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.skills}>
          {application.skills.slice(0, 3).map(skill => (
            <span key={skill} className={styles.skillChip}>{skill}</span>
          ))}
          {application.skills.length > 3 && (
            <span className={styles.skillChip}>+{application.skills.length - 3}</span>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.date}>{formatDate(application.appliedDate)}</span>
        <span className={styles.score}>{score}% MATCH</span>
      </div>
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';

export default KanbanCard;
