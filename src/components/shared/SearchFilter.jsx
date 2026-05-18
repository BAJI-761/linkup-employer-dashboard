import { Search } from 'lucide-react';
import styles from './SearchFilter.module.css';

export default function SearchFilter({ searchValue, onSearchChange, filters, activeFilter, onFilterChange }) {
  return (
    <div className={styles.container}>
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.icon} />
        <input
          type="text"
          placeholder="Search records..."
          className={styles.input}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {filters && (
        <div className={styles.filters}>
          {filters.map(f => (
            <button
              key={f.value}
              className={`${styles.chip} ${activeFilter === f.value ? styles.chipActive : ''}`}
              onClick={() => onFilterChange(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
