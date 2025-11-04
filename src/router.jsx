import { createBrowserRouter } from 'react-router-dom';
import Login from './components/auth/Login';
import CustomerDashboard from './views/CustomerDashboard';
import EmployeeDashboard from './views/EmployeeDashboard';
import AdminDashboard from './views/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },

  {
    path: '/customer/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <CustomerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/employee/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['employee']}>
        <EmployeeDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);

export default router;
