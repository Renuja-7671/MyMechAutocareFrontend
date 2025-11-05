// src/components/common/CustomerNavbar.jsx
import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, Dropdown, Button, Form } from 'react-bootstrap';
import { FaUser, FaCalendarAlt, FaTools, FaChartBar, FaSignOutAlt, FaBell, FaMoon, FaSun, FaHome, FaCog } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { showInfo } from '../../utils/toast';

const CustomerNavbar = ({ variant = 'primary', showLogin = false }) => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Load dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    document.body.classList.toggle('dark-mode', saved);
  }, []);

  // Toggle dark mode
 
  // Listen for real-time notifications
  useEffect(() => {
    if (socket && user) {
      const handleNotification = (data) => {
        const newNotif = {
          id: Date.now() + Math.random(),
          ...data,
          time: 'Just now',
          read: false
        };
        setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
        setUnreadCount(prev => prev + 1);
        showInfo(data.message);
      };

      socket.on('notification', handleNotification);
      return () => socket.off('notification', handleNotification);
    }
  }, [socket, user]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    showInfo('Logged out successfully');
  };

  const navItems = [
    { path: '/customer/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/customer/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/customer/services', label: 'Services', icon: <FaTools /> },
    { path: '/customer/reports', label: 'Reports', icon: <FaChartBar /> },
    { path: '/customer/profile', label: 'Profile', icon: <FaCog /> },
  ];

  return (
    <Navbar
      bg={variant === 'light' ? 'light' : 'primary'}
      variant={darkMode ? 'dark' : variant}
      expand="lg"
      className="shadow-sm"
      sticky="top"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to={user ? '/customer/dashboard' : '/'} className="fw-bold d-flex align-items-center">
          <FaTools className="me-2 text-primary" />
          MyMech AutoCare
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="customer-navbar" />

        <Navbar.Collapse id="customer-navbar">
          <Nav className="me-auto">
            {showLogin ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              navItems.map(item => (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span className="d-lg-none">{item.icon} {item.label}</span>
                  <span className="d-none d-lg-inline">{item.label}</span>
                </Nav.Link>
              ))
            )}
          </Nav>

          <Nav className="align-items-center">
            {/* Dark Mode Toggle
            <Form.Check
              type="switch"
              id="dark-mode-switch"
              label={darkMode ? <FaMoon /> : <FaSun />}
              checked={darkMode}
              onChange={toggleDarkMode}
              className="me-3 d-none d-lg-flex align-items-center"
            />
 */}
            {/* Notifications */}
            {user && (
              <Dropdown align="end" className="me-2">
                <Dropdown.Toggle
                  variant="link"
                  className="text-decoration-none position-relative p-0"
                  style={{ color: 'inherit' }}
                >
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle-x rounded-pill"
                      style={{ fontSize: '0.6rem' }}
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border-0" style={{ width: '300px' }}>
                  <Dropdown.Header className="d-flex justify-content-between">
                    <span>Notifications</span>
                    <small>{unreadCount} unread</small>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  {notifications.length === 0 ? (
                    <Dropdown.ItemText className="text-center text-muted py-3">
                      <FaBell className="mb-2 opacity-50" />
                      <p className="mb-0 small">No new notifications</p>
                    </Dropdown.ItemText>
                  ) : (
                    notifications.map(notif => (
                      <Dropdown.Item
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={!notif.read ? 'bg-light' : ''}
                      >
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <div className="small fw-medium">{notif.message}</div>
                            <div className="text-muted xsmall">{notif.time}</div>
                          </div>
                          {!notif.read && <Badge bg="primary" className="ms-2">New</Badge>}
                        </div>
                      </Dropdown.Item>
                    ))
                  )}
                  {notifications.length > 0 && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item className="text-center">
                        <Button variant="link" size="sm">View All</Button>
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* User Dropdown */}
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" className="text-decoration-none d-flex align-items-center p-0">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{ width: 36, height: 36 }}
                    >
                      <FaUser className="text-muted" />
                    </div>
                    <div className="d-none d-md-block text-start">
                      <div className="small fw-bold">{user.customer?.firstName}</div>
                      <div className="xsmall text-muted">Customer</div>
                    </div>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border-0">
                  <Dropdown.Header>
                    <small className="text-muted">Signed in as</small><br />
                    <strong>{user.email}</strong>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/customer/profile">
                    <FaCog className="me-2" /> Profile Settings
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/customer/appointments">
                    <FaCalendarAlt className="me-2" /> My Appointments
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button as={Link} to="/login" size="sm" variant="outline-primary">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomerNavbar;