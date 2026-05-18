import { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useDebounce } from '../hooks/useDebounce';
import SearchFilter from '../components/shared/SearchFilter';
import KanbanBoard from '../components/layout/KanbanBoard';
import SimulateCandidateModal from '../components/widgets/SimulateCandidateModal';
import styles from './UsersPage.module.css';

const filters = [
  { value: 'all', label: 'All Jobs' },
];

export default function UsersPage() {
  const { state } = useDashboard();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  const debouncedSearch = useDebounce(search);

  // Generate dynamic filters based on active jobs in applications
  const dynamicFilters = useMemo(() => {
    const jobTitles = [...new Set(state.applications.map(a => a.jobTitle))];
    return [
      { value: 'all', label: 'All Dispatches' },
      ...jobTitles.map(t => ({ value: t, label: t }))
    ];
  }, [state.applications]);

  const filteredApps = useMemo(() => {
    let result = [...state.applications];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(a =>
        a.userName.toLowerCase().includes(q) ||
        a.userEmail.toLowerCase().includes(q) ||
        a.jobTitle.toLowerCase().includes(q)
      );
    }

    if (filter !== 'all') {
      result = result.filter(a => a.jobTitle === filter);
    }

    return result;
  }, [state.applications, debouncedSearch, filter]);

  const statusCounts = useMemo(() => ({
    pending: state.applications.filter(a => a.status === 'pending').length,
    reviewed: state.applications.filter(a => a.status === 'reviewed').length,
    shortlisted: state.applications.filter(a => a.status === 'shortlisted').length,
    rejected: state.applications.filter(a => a.status === 'rejected').length,
  }), [state.applications]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.headline}>PERSONNEL PIPELINE</h1>
          <p className={styles.subtitle}>
            {state.applications.length} total applications —
            <span className={styles.statInline}> {statusCounts.pending} pending</span> ·
            <span className={styles.statInline}> {statusCounts.reviewed} reviewed</span> ·
            <span className={styles.statInline}> {statusCounts.shortlisted} shortlisted</span> ·
            <span className={styles.statInline}> {statusCounts.rejected} rejected</span>
          </p>
        </div>
        <button className="btn-primary" onClick={() => setIsSimulateOpen(true)}>
          SIMULATE APPLICANT
        </button>
      </header>

      <SearchFilter
        searchValue={search}
        onSearchChange={(v) => setSearch(v)}
        filters={dynamicFilters}
        activeFilter={filter}
        onFilterChange={(v) => setFilter(v)}
      />

      <div style={{ marginTop: '2rem' }}>
        <KanbanBoard applications={filteredApps} />
      </div>

      <SimulateCandidateModal isOpen={isSimulateOpen} onClose={() => setIsSimulateOpen(false)} />
    </div>
  );
}
