import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './views/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import RegisterEmployee from './components/auth/RegisterEmployee';
import CustomerDashboard from './views/CustomerDashboard';
import EmployeeDashboard from './views/EmployeeDashboard';
import AdminDashboard from './views/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/customer/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/employee/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/register-employee" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RegisterEmployee />
            </ProtectedRoute>
          } 
        />

        <Route path="/unauthorized" element={
          <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center">
              <h1 className="display-1 fw-bold text-danger">403</h1>
              <h2 className="mb-3">Unauthorized Access</h2>
              <p className="text-muted mb-4">You do not have permission to access this page.</p>
              <a href="/login" className="btn btn-primary">Go to Login</a>
            </div>
          </div>
        } />

        <Route path="*" element={
          <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center">
              <h1 className="display-1 fw-bold text-primary">404</h1>
              <h2 className="mb-3">Page Not Found</h2>
              <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
              <a href="/login" className="btn btn-primary">Go to Login</a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;