import { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useDebounce } from '../hooks/useDebounce';
import SearchFilter from '../components/shared/SearchFilter';
import DataTable from '../components/tables/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import CreateJobModal from '../components/widgets/CreateJobModal';
import emptyJobsImg from '../assets/images/empty_jobs.png';
import tableStyles from '../components/tables/DataTable.module.css';
import styles from './JobsPage.module.css';

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'jobType', label: 'Type', sortable: true },
  { key: 'applicants', label: 'Applicants', sortable: true },
  { key: 'postedDate', label: 'Posted', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
];

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Part-time', label: 'Part-time' },
];

export default function JobsPage() {
  const { state, dispatch } = useDashboard();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState({ column: 'postedDate', direction: 'desc' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search);

  const filteredJobs = useMemo(() => {
    let result = [...state.jobs];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(j =>
        (j.title || '').toLowerCase().includes(q) ||
        (j.company || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q)
      );
    }

    // Filter
    if (filter !== 'all') {
      if (filter === 'active' || filter === 'closed') {
        // Assume undefined/missing status is active
        result = result.filter(j => (j.status || 'active') === filter);
      } else {
        result = result.filter(j => j.jobType === filter || j.type === filter);
      }
    }

    // Sort
    result.sort((a, b) => {
      const col = sortBy.column;
      const dir = sortBy.direction === 'asc' ? 1 : -1;
      if (col === 'applicants') return ((a[col] || 0) - (b[col] || 0)) * dir;
      if (col === 'postedDate') return (new Date(a[col] || 0) - new Date(b[col] || 0)) * dir;
      return String(a[col] || '').localeCompare(String(b[col] || '')) * dir;
    });

    return result;
  }, [state.jobs, debouncedSearch, filter, sortBy]);

  const handleSort = (column) => {
    setSortBy(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_JOB', payload: id });
    dispatch({ type: 'ADD_TOAST', payload: { message: 'Dispatch removed successfully', type: 'success' } });
  };

  const handleToggleStatus = (id) => {
    dispatch({ type: 'TOGGLE_JOB_STATUS', payload: id });
    dispatch({ type: 'ADD_TOAST', payload: { message: 'Dispatch status updated', type: 'info' } });
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.headline}>ACTIVE DISPATCHES</h1>
          <p className={styles.subtitle}>{state.jobs.length} total positions — {state.jobs.filter(j => (j.status || 'active') === 'active').length} active</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          NEW DISPATCH
        </button>
      </header>

      <SearchFilter
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        filters={filters}
        activeFilter={filter}
        onFilterChange={(v) => { setFilter(v); setPage(1); }}
      />

      <DataTable
        columns={columns}
        data={filteredJobs}
        sortBy={sortBy}
        onSort={handleSort}
        currentPage={page}
        onPageChange={setPage}
        emptyState={
          <EmptyState
            image={emptyJobsImg}
            title="No Dispatches Found"
            subtitle="No job postings match your current search or filters. Try adjusting your criteria."
          />
        }
        renderRow={(job, i) => (
          <tr key={job.id} className={tableStyles.tr} style={{ animationDelay: `${i * 40}ms` }}>
            <td className={tableStyles.td}>
              <span className={tableStyles.cellBold}>{job.title}</span>
            </td>
            <td className={tableStyles.td}>{job.company}</td>
            <td className={`${tableStyles.td} ${tableStyles.cellMuted}`}>{job.location}</td>
            <td className={tableStyles.td}>
              <span className={tableStyles.skillChip}>{job.jobType || job.type}</span>
            </td>
            <td className={`${tableStyles.td} ${tableStyles.cellMono}`}>{job.applicants || 0}</td>
            <td className={`${tableStyles.td} ${tableStyles.cellMono}`}>{formatDate(job.postedDate)}</td>
            <td className={tableStyles.td}><StatusBadge status={job.status || 'active'} /></td>
            <td className={tableStyles.td}>
              <div className={tableStyles.cellActions}>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => handleToggleStatus(job.id)}>
                  {(job.status || 'active') === 'active' ? 'CLOSE' : 'REOPEN'}
                </button>
                <button className="btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(job.id)}>
                  DELETE
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

