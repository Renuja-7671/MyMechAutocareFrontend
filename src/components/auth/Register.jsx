import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { showSuccess, showError } from '../../utils/toast';
import NavbarComponent from '../common/Navbar';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    role: 'customer', // Only customers can register
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
      showSuccess('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || err.error || err.errors?.[0]?.msg || 'Registration failed');
      showError('Registration failed. Please try again.');
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
            <Col md={10} lg={8}>
              <Card className="shadow-lg border-0 rounded-4 animate-fade-in">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h1 className="fw-bold text-primary mb-2">Create a Customer Account</h1>
                    <p className="text-muted">Join our auto service platform</p>
                  </div>

                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Only customers can register, so no role selection */}

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">First Name</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <FaUser className="text-muted" />
                            </span>
                            <Form.Control
                              type="text"
                              name="firstName"
                              placeholder="John"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                              className="border-start-0 ps-0"
                            />
                          </div>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Last Name</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <FaUser className="text-muted" />
                            </span>
                            <Form.Control
                              type="text"
                              name="lastName"
                              placeholder="Doe"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                              className="border-start-0 ps-0"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Email Address</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaEnvelope className="text-muted" />
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="john.doe@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-start-0 ps-0"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Phone Number</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaPhone className="text-muted" />
                        </span>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="555-0123"
                          value={formData.phone}
                          onChange={handleChange}
                          className="border-start-0 ps-0"
                        />
                      </div>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Password</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <FaLock className="text-muted" />
                            </span>
                            <Form.Control
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              placeholder="Min. 6 characters"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              minLength={6}
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
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <FaLock className="text-muted" />
                            </span>
                            <Form.Control
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              placeholder="Re-enter password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                              minLength={6}
                              className="border-start-0 ps-0"
                            />
                            <span
                              className="input-group-text bg-light border-start-0"
                              style={{ cursor: 'pointer' }}
                              onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        placeholder="123 Main Street, City, State"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      className="w-100 py-2 fw-semibold mt-3"
                      size="lg"
                      disabled={loading}
                      style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', border: 'none' }}
                    >
                      {loading ? 'Creating Account...' : (
                        <>
                          <FaUserPlus className="me-2" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </Form>

                  <hr className="my-4" />

                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Register;