import { useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DataTable.module.css';

const ROWS_PER_PAGE = 8;

export default function DataTable({ columns, data, sortBy, onSort, currentPage, onPageChange, renderRow, emptyState }) {
  const totalPages = Math.max(1, Math.ceil(data.length / ROWS_PER_PAGE));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return data.slice(start, start + ROWS_PER_PAGE);
  }, [data, currentPage]);

  if (data.length === 0 && emptyState) return emptyState;

  return (
    <div className={styles.tableWrap}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`${styles.th} ${col.sortable ? styles.sortable : ''}`}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <span>{col.label}</span>
                  {col.sortable && (
                    <ArrowUpDown size={12} className={`${styles.sortIcon} ${sortBy?.column === col.key ? styles.sortActive : ''}`} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, i) => renderRow(item, i))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages} — {data.length} records
          </span>
          <div className={styles.pageButtons}>
            <button
              className={styles.pageBtn}
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} /> PREV
            </button>
            <button
              className={styles.pageBtn}
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              NEXT EDITION <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
