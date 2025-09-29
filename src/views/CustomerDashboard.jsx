import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaCar, FaCalendarAlt, FaTools, FaStar, FaPlus, FaHistory, FaPhone } from 'react-icons/fa';
import NavbarComponent from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import authService from '../services/authService';

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authService.getProfile();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <NavbarComponent user={user} variant="primary" />
      
      <Container className="py-4">
        <div className="mb-4 animate-fade-in">
          <h1 className="fw-bold mb-1">Welcome back, {user?.customer?.firstName}!</h1>
          <p className="text-muted">Manage your vehicles and service appointments</p>
        </div>

        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaCar />}
              title="My Vehicles"
              value="0"
              iconBg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaCalendarAlt />}
              title="Upcoming"
              value="0"
              iconBg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaTools />}
              title="Active Services"
              value="0"
              iconBg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaStar />}
              title="Completed"
              value="0"
              iconBg="linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
            />
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold">Profile Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <small className="text-muted d-block">Full Name</small>
                    <strong>{user?.customer?.firstName} {user?.customer?.lastName}</strong>
                  </Col>
                  <Col md={6} className="mb-3">
                    <small className="text-muted d-block">Email</small>
                    <strong>{user?.email}</strong>
                  </Col>
                  <Col md={6} className="mb-3">
                    <small className="text-muted d-block">Phone</small>
                    <strong>{user?.customer?.phone || 'Not provided'}</strong>
                  </Col>
                  <Col md={6} className="mb-3">
                    <small className="text-muted d-block">City</small>
                    <strong>{user?.customer?.city || 'Not provided'}</strong>
                  </Col>
                  <Col md={12}>
                    <small className="text-muted d-block">Address</small>
                    <strong>{user?.customer?.address || 'Not provided'}</strong>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold">Quick Actions</h5>
              </Card.Header>
              <Card.Body className="d-flex flex-column gap-2">
                <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center">
                  <FaCalendarAlt className="me-2" />
                  Book Appointment
                </Button>
                <Button variant="success" className="w-100 d-flex align-items-center justify-content-center">
                  <FaPlus className="me-2" />
                  Add Vehicle
                </Button>
                <Button variant="info" className="w-100 d-flex align-items-center justify-content-center text-white">
                  <FaHistory className="me-2" />
                  View History
                </Button>
                <Button variant="warning" className="w-100 d-flex align-items-center justify-content-center">
                  <FaPhone className="me-2" />
                  Contact Support
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom">
            <h5 className="mb-0 fw-bold">Recent Activity</h5>
          </Card.Header>
          <Card.Body>
            <div className="text-center text-muted py-5">
              <FaHistory size={48} className="mb-3 opacity-50" />
              <p className="mb-0">No recent activity</p>
              <small>Your service history will appear here</small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CustomerDashboard;