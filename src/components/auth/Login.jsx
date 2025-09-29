import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaCar } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../../services/authService';
import NavbarComponent from '../common/Navbar';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      
      switch (response.user.role) {
        case 'customer':
          navigate('/customer/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <NavbarComponent variant="primary" />
      <div className="d-flex align-items-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={6}>
              <Card className="shadow-lg border-0 rounded-4 animate-fade-in">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <a className="navbar-brand fw-bold fs-3" href="/" style={{ color: '#667eea' }}>
                        <FaCar className="me-2" />
                        MyMech Autocare
                    </a>
                    <p className="text-muted">Log in to your account</p>
                  </div>

                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Email Address</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaEnvelope className="text-muted" />
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-start-0 ps-0"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Password</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaLock className="text-muted" />
                        </span>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="border-start-0 ps-0"
                        />
                        <span
                          className="input-group-text bg-light border-start-0"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </Form.Group>

                    <Button
                      type="submit"
                      className="w-100 py-2 fw-semibold"
                      size="lg"
                      disabled={loading}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                    >
                      {loading ? 'Signing in...' : (
                        <>
                          <FaSignInAlt className="me-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </Form>

                  <hr className="my-4" />

                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                        Create Account
                      </Link>
                    </p>
                  </div>

                  <Card className="mt-4 bg-light border-0">
                    <Card.Body className="p-3">
                      <h6 className="fw-bold text-primary mb-2">Added by Renuja for testing</h6>
                      <small className="d-block text-muted mb-1">
                        <strong>Customer:</strong> john.doe@email.com / password123
                      </small>
                      <small className="d-block text-muted mb-1">
                        <strong>Employee:</strong> mike.johnson@autoservice.com / password123
                      </small>
                      <small className="d-block text-muted">
                        <strong>Admin:</strong> admin@autoservice.com / password123
                      </small>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Login;