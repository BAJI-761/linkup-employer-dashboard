import styles from './EmptyState.module.css';

export default function EmptyState({ image, title, subtitle }) {
  return (
    <div className={styles.container}>
      {image && <img src={image} alt={title} className={styles.image} />}
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
