import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import SmoothScroll from './components/shared/SmoothScroll';
import DashboardShell from './components/layout/DashboardShell';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import AuthGuard from './components/layout/AuthGuard';

export default function App() {
  return (
    <DashboardProvider>
      <SmoothScroll>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<AuthGuard><DashboardShell /></AuthGuard>}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </SmoothScroll>
    </DashboardProvider>
  );
}

