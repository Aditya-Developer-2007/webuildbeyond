import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';

const PrivateAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user?.isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/"       element={<Home />} />
      <Route path="/auth"   element={<AuthPage />} />
      <Route
        path="/admin"
        element={
          <PrivateAdminRoute>
            <AdminDashboard />
          </PrivateAdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
