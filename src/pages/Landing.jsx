import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaTools, FaClock, FaUserShield, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      switch (user?.role) {
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
          navigate('/login');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-white mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4 animate-fade-in">
                Your Trusted Auto Service Partner
              </h1>
              <p className="lead mb-4">
                Experience seamless vehicle maintenance with real-time tracking, expert technicians, and transparent service updates.
              </p>
              <div className="d-flex gap-3">
                <Button
                  size="lg"
                  variant="light"
                  onClick={handleGetStarted}
                  className="px-5 py-3"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'} <FaArrowRight className="ms-2" />
                </Button>
                {!isAuthenticated && (
                  <Button
                    size="lg"
                    variant="outline-light"
                    onClick={() => navigate('/login')}
                    className="px-5 py-3"
                  >
                    Login
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop"
                  alt="Auto Service"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Why Choose MyMech Autocare?</h2>
            <p className="text-muted">Modern solutions for all your vehicle service needs</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="card border-0 shadow-sm h-100 text-center p-4 card-hover">
                <div
                  className="rounded-circle mx-auto mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaClock size={36} className="text-white" />
                </div>
                <h5 className="fw-bold mb-3">Real-Time Tracking</h5>
                <p className="text-muted">
                  Monitor your vehicle service progress live with instant updates and notifications.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="card border-0 shadow-sm h-100 text-center p-4 card-hover">
                <div
                  className="rounded-circle mx-auto mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaTools size={36} className="text-white" />
                </div>
                <h5 className="fw-bold mb-3">Expert Technicians</h5>
                <p className="text-muted">
                  Certified professionals with years of experience in automotive care and repair.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="card border-0 shadow-sm h-100 text-center p-4 card-hover">
                <div
                  className="rounded-circle mx-auto mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaCar size={36} className="text-white" />
                </div>
                <h5 className="fw-bold mb-3">Easy Booking</h5>
                <p className="text-muted">
                  Schedule appointments online in minutes with our user-friendly booking system.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="card border-0 shadow-sm h-100 text-center p-4 card-hover">
                <div
                  className="rounded-circle mx-auto mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaUserShield size={36} className="text-white" />
                </div>
                <h5 className="fw-bold mb-3">Trusted Service</h5>
                <p className="text-muted">
                  Transparent pricing and quality guarantee on all our services and repairs.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Our Services</h2>
            <p className="text-muted">Automotive solutions for every need</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={4}>
              <div className="card border-0 shadow-sm h-100">
                <img
                  src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=250&fit=crop"
                  alt="Oil Change"
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Regular Maintenance</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Oil Change</li>
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Tire Rotation</li>
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Brake Inspection</li>
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Fluid Checks</li>
                  </ul>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="card border-0 shadow-sm h-100">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop"
                  alt="Diagnostics"
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Diagnostics & Repair</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Engine Diagnostics</li>
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Transmission Service</li>
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Electrical Systems</li>
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />AC Repair</li>
                  </ul>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="card border-0 shadow-sm h-100">
                <img
                  src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=250&fit=crop"
                  alt="Custom Work"
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Custom Modifications</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Performance Upgrades</li>
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Exhaust Systems</li>
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Custom Paint</li>
                    <li className="mb-2"><FaCheckCircle className="text-success me-2" />Interior Work</li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="text-white mb-4 mb-lg-0">
              <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
              <p className="lead mb-0">
                Join thousands of satisfied customers who trust MyMech Autocare for their vehicle needs.
              </p>
            </Col>
            <Col lg={4} className="text-lg-end">
              <Button
                size="lg"
                variant="light"
                onClick={handleGetStarted}
                className="px-5 py-3 fw-bold"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Create Account'} <FaArrowRight className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Landing;