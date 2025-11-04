import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUser, 
  FaCalendarAlt, 
  FaTools, 
  FaChartBar, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    switch (user?.role) {
      case 'customer':
        return [
          { path: '/customer/dashboard', icon: <FaHome />, label: 'Dashboard' },
          { path: '/customer/appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
          { path: '/customer/services', icon: <FaTools />, label: 'Services' },
          { path: '/customer/profile', icon: <FaUser />, label: 'Profile' },
        ];
      case 'employee':
        return [
          { path: '/employee/dashboard', icon: <FaHome />, label: 'Dashboard' },
          { path: '/employee/appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
          { path: '/employee/services', icon: <FaTools />, label: 'Services' },
          { path: '/employee/profile', icon: <FaUser />, label: 'Profile' },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
          { path: '/admin/appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
          { path: '/admin/services', icon: <FaTools />, label: 'Services' },
          { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
          { path: '/admin/reports', icon: <FaChartBar />, label: 'Reports' },
          { path: '/admin/profile', icon: <FaUser />, label: 'Profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`bg-dark text-white d-flex flex-column ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Sidebar Header */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary">
        {!collapsed && (
          <div className="d-flex align-items-center">
            <img 
              src="/MyMech Logo.png" 
              alt="Logo" 
              className="me-2" 
              style={{ width: '40px', height: '40px' }}
            />
            <h5 className="mb-0">MyMech</h5>
          </div>
        )}
        <button 
          className="btn btn-link text-white p-0"
          onClick={toggleSidebar}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-grow-1 overflow-auto">
        <ul className="nav flex-column p-2">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item mb-1">
              <Link 
                to={item.path} 
                className={`nav-link text-white d-flex align-items-center ${
                  location.pathname === item.path ? 'bg-primary' : 'hover-bg-primary'
                }`}
              >
                <span className="me-2">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-2 border-top border-secondary">
        <button 
          className="btn btn-link text-white d-flex align-items-center w-100"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <style jsx>{`
        .sidebar-expanded {
          width: 250px;
          transition: width 0.3s ease;
        }
        
        .sidebar-collapsed {
          width: 70px;
          transition: width 0.3s ease;
        }
        
        .hover-bg-primary:hover {
          background-color: #0d6efd !important;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;