import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts & UI
import DashboardLayout from './components/Layout/DashboardLayout';
import SmoothScroll from './components/SmoothScroll';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import CreateDonation from './pages/donor/CreateDonation';
import DonationHistory from './pages/donor/DonationHistory';
import DonorProfile from './pages/donor/DonorProfile';

// NGO Pages
import NGODashboard from './pages/ngo/NGODashboard';
import AvailableDonations from './pages/ngo/AvailableDonations';
import AcceptedDonations from './pages/ngo/AcceptedDonations';
import NGOProfile from './pages/ngo/NGOProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDonations from './pages/admin/ManageDonations';
import Analytics from './pages/admin/Analytics';
import Reports from './pages/admin/Reports';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <SmoothScroll>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Donor Routes */}
                <Route path="/donor" element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DashboardLayout title="Donor Portal" />
                  </ProtectedRoute>
                }>
                  <Route index element={<DonorDashboard />} />
                  <Route path="create" element={<CreateDonation />} />
                  <Route path="history" element={<DonationHistory />} />
                  <Route path="profile" element={<DonorProfile />} />
                </Route>

                {/* NGO Routes */}
                <Route path="/ngo" element={
                  <ProtectedRoute allowedRoles={['ngo']}>
                    <DashboardLayout title="NGO Portal" />
                  </ProtectedRoute>
                }>
                  <Route index element={<NGODashboard />} />
                  <Route path="available" element={<AvailableDonations />} />
                  <Route path="accepted" element={<AcceptedDonations />} />
                  <Route path="profile" element={<NGOProfile />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout title="Admin Portal" />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="donations" element={<ManageDonations />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="reports" element={<Reports />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </SmoothScroll>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
