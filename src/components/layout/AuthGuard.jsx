import { Navigate, useLocation } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';

export default function AuthGuard({ children }) {
  const { state } = useDashboard();
  const location = useLocation();

  if (!state.auth.isAuthenticated || state.auth.role !== 'employer') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
