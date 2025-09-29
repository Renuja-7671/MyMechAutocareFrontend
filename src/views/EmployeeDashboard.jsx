import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { FaTasks, FaClock, FaCheckCircle, FaExclamationCircle, FaPlay, FaList, FaComments } from 'react-icons/fa';
import NavbarComponent from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import authService from '../services/authService';

const EmployeeDashboard = () => {
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
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <NavbarComponent user={user} variant="success" />
      
      <Container className="py-4">
        <div className="mb-4 animate-fade-in">
          <h1 className="fw-bold mb-1">Welcome, {user?.employee?.firstName}!</h1>
          <p className="text-muted">
            {user?.employee?.position} - {user?.employee?.department}
          </p>
        </div>

        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaTasks />}
              title="Assigned Tasks"
              value="0"
              iconBg="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaClock />}
              title="Hours Today"
              value="0h"
              iconBg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaCheckCircle />}
              title="Completed"
              value="0"
              iconBg="linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaExclamationCircle />}
              title="Pending"
              value="0"
              iconBg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            />
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold">Today's Tasks</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center text-muted py-5">
                  <FaTasks size={48} className="mb-3 opacity-50" />
                  <p className="mb-0">No tasks assigned yet</p>
                  <small>Your assigned tasks will appear here
                    </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-3">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold">Employee Info</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted d-block">Email</small>
                  <strong>{user?.email}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Department</small>
                  <strong>{user?.employee?.department || 'N/A'}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Position</small>
                  <strong>{user?.employee?.position || 'N/A'}</strong>
                </div>
                <div>
                  <small className="text-muted d-block">Status</small>
                  <Badge bg={user?.is_active ? 'success' : 'secondary'}>
                    {user?.is_active ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold">Quick Actions</h5>
              </Card.Header>
              <Card.Body className="d-flex flex-column gap-2">
                <Button variant="success" className="w-100 d-flex align-items-center justify-content-center">
                  <FaPlay className="me-2" />
                  Start Timer
                </Button>
                <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center">
                  <FaList className="me-2" />
                  View All Tasks
                </Button>
                <Button variant="info" className="w-100 d-flex align-items-center justify-content-center text-white">
                  <FaClock className="me-2" />
                  Log Time
                </Button>
                <Button variant="warning" className="w-100 d-flex align-items-center justify-content-center">
                  <FaComments className="me-2" />
                  Messages
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom">
            <h5 className="mb-0 fw-bold">Work History</h5>
          </Card.Header>
          <Card.Body>
            <div className="text-center text-muted py-5">
              <FaClock size={48} className="mb-3 opacity-50" />
              <p className="mb-0">No work history</p>
              <small>Your completed tasks will appear here</small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EmployeeDashboard;