
import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap';
import { FaSignOutAlt, FaUser, FaCar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const NavbarComponent = ({ user, variant = 'primary' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const gradients = {
    primary: 'linear-gradient(135deg, #334bb5ff 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    danger: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
  };

  return (
    <BSNavbar style={{ background: gradients[variant] }} variant="dark" className="shadow-sm">
      <Container>
        <a className="navbar-brand fw-bold fs-3 d-flex align-items-center" href="/" style={{ color: '#ffffffff' }}>
          <img src="/MyMech Logo.png" alt="MyMech Logo" style={{ height: '60px', marginRight: '12px' }} />
          MyMech Autocare
        </a>
        <Nav className="ms-auto align-items-center">
          <Button
            variant="outline-light"
            size="sm"
            className="me-3"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          {user ? (
            <>
              <span className="text-white me-3 d-flex align-items-center">
                <FaUser className="me-2" />
                {user?.customer?.firstName || user?.employee?.firstName || 'Admin'}
              </span>
              <Button
                variant="light"
                size="sm"
                onClick={handleLogout}
                className="d-flex align-items-center"
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline-light"
                size="sm"
                className="me-2"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="light"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </BSNavbar>
  );
};

export default NavbarComponent;