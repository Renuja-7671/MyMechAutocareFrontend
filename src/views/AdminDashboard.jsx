import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { FaUsers, FaCalendarCheck, FaUserTie, FaDollarSign, FaUsersCog, FaTools, FaChartBar, FaCog, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import authService from '../services/authService';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <NavbarComponent user={user} variant="danger" />
      
      <Container className="py-4">
        <div className="mb-4 animate-fade-in">
          <h1 className="fw-bold mb-1">Administrator Dashboard</h1>
          <p className="text-muted">System overview and management</p>
        </div>

        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaUsers />}
              title="Total Users"
              value="5"
              iconBg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaCalendarCheck />}
              title="Appointments"
              value="2"
              iconBg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaUserTie />}
              title="Employees"
              value="2"
              iconBg="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaDollarSign />}
              title="Revenue"
              value="$0"
              iconBg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            />
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold">Recent Appointments</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>Toyota Camry</td>
                      <td>Oil Change</td>
                      <td>Oct 5, 2025</td>
                      <td><Badge bg="warning">Scheduled</Badge></td>
                    </tr>
                    <tr>
                      <td>Jane Smith</td>
                      <td>Ford F-150</td>
                      <td>Brake Inspection</td>
                      <td>Oct 6, 2025</td>
                      <td><Badge bg="success">Confirmed</Badge></td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-3">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold">System Status</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted d-block">Admin Email</small>
                  <strong>{user?.email}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Role</small>
                  <Badge bg="danger" className="text-uppercase">{user?.role}</Badge>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">System Status</small>
                  <Badge bg="success">Online</Badge>
                </div>
                <div>
                  <small className="text-muted d-block">Database</small>
                  <Badge bg="success">Connected</Badge>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold">Admin Actions</h5>
              </Card.Header>
              <Card.Body className="d-flex flex-column gap-2">
                <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center">
                  <FaUsersCog className="me-2" />
                  Manage Users
                </Button>
                <Button
                  variant="outline-primary"
                  className="w-100 d-flex align-items-center justify-content-center"
                  onClick={() => navigate('/admin/register-employee')}
                >
                  <FaUserPlus className="me-2" />
                  Register Employee
                </Button>
                <Button variant="success" className="w-100 d-flex align-items-center justify-content-center">
                  <FaTools className="me-2" />
                  Manage Services
                </Button>
                <Button variant="info" className="w-100 d-flex align-items-center justify-content-center text-white">
                  <FaChartBar className="me-2" />
                  View Reports
                </Button>
                <Button variant="warning" className="w-100 d-flex align-items-center justify-content-center">
                  <FaCog className="me-2" />
                  Settings
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold">Top Services</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>Oil Change</strong>
                    <div className="text-muted small">Maintenance</div>
                  </div>
                  <Badge bg="primary">$49.99</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>Brake Inspection</strong>
                    <div className="text-muted small">Safety</div>
                  </div>
                  <Badge bg="primary">$79.99</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Engine Diagnostic</strong>
                    <div className="text-muted small">Diagnostic</div>
                  </div>
                  <Badge bg="primary">$99.99</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold">System Activity</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted">2 hours ago</small>
                  <div>New customer registered: John Doe</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">3 hours ago</small>
                  <div>Appointment scheduled for Oct 5</div>
                </div>
                <div>
                  <small className="text-muted">5 hours ago</small>
                  <div>New employee added: Mike Johnson</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;