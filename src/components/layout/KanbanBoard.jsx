import { useState } from 'react';
import KanbanCard from '../widgets/KanbanCard';
import styles from './KanbanBoard.module.css';
import { useDashboard } from '../../context/DashboardContext';

const COLUMNS = [
  { id: 'pending', title: 'Pending' },
  { id: 'reviewed', title: 'Reviewed' },
  { id: 'shortlisted', title: 'Shortlisted' },
  { id: 'rejected', title: 'Rejected' }
];

export default function KanbanBoard({ applications }) {
  const { dispatch } = useDashboard();
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires data to be set
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (e) => {
    setDragOverCol(null);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverCol(null);
    if (draggedId) {
      dispatch({ 
        type: 'UPDATE_APPLICATION_STATUS', 
        payload: { id: draggedId, status: colId } 
      });
      // Optionally add a toast
      dispatch({ 
        type: 'ADD_TOAST', 
        payload: { message: `Moved to ${colId}`, type: 'info' } 
      });
    }
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  if (applications.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '50vh', backgroundColor: 'var(--bg-surface)', border: '1px dashed var(--border-color)',
        padding: '2rem', textAlign: 'center'
      }}>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          NO APPLICANTS YET
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '2rem' }}>
          Your personnel pipeline is currently empty. Create a new dispatch to start receiving applications.
        </p>
        <button 
          className="btn-primary" 
          onClick={() => {
            // Dispatch a custom event or let the user click the "NEW DISPATCH" button in the TopBar
            document.dispatchEvent(new CustomEvent('openCreateJobModal'));
          }}
        >
          POST NEW DISPATCH
        </button>
      </div>
    );
  }

  return (
    <div className={styles.board}>
      {COLUMNS.map(col => {
        const columnApps = applications.filter(a => a.status === col.id);
        const isDragOver = dragOverCol === col.id;

        return (
          <div key={col.id} className={styles.column}>
            <div className={styles.columnHeader}>
              <h3 className={styles.columnTitle}>{col.title}</h3>
              <span className={styles.columnCount}>{columnApps.length}</span>
            </div>
            
            <div 
              className={`${styles.cardList} ${isDragOver ? styles.dragOver : ''}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {columnApps.map(app => (
                <KanbanCard 
                  key={app.id} 
                  application={app} 
                  onDragStart={(e) => handleDragStart(e, app.id)}
                  onDragEnd={handleDragEnd}
                />
              ))}
              
              {columnApps.length === 0 && !isDragOver && (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--border-color)',
                  marginTop: '1rem'
                }}>
                  Drop cards here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
