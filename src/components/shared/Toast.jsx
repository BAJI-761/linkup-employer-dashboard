import { useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import styles from './Toast.module.css';

export default function ToastContainer() {
  const { state, dispatch } = useDashboard();

  return (
    <div className={styles.container}>
      {state.toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} dispatch={dispatch} />
      ))}
    </div>
  );
}

function ToastItem({ toast, dispatch }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  return (
    <div className={`${styles.toast} ${styles[toast.type || 'info']}`}>
      <span className={styles.message}>{toast.message}</span>
      <button className={styles.close} onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}>×</button>
    </div>
  );
}
