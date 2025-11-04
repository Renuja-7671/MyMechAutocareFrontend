import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { FaUsers, FaCalendarCheck, FaUserTie, FaDollarSign, FaUsersCog, FaTools, FaChartBar, FaCog, FaUserPlus, FaBell, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavbarComponent from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // const [users, setUsers] = useState([]); // Will be used for user management
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    appointments: 0,
    employees: 0,
    revenue: 0
  });

  // Mock data
  // const mockUsers = [
  //   { id: 1, name: 'John Doe', email: 'john.doe@email.com', role: 'customer', status: 'active' },
  //   { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', role: 'customer', status: 'active' },
  //   { id: 3, name: 'Mike Johnson', email: 'mike.johnson@autoservice.com', role: 'employee', status: 'active' },
  //   { id: 4, name: 'Sarah Davis', email: 'sarah.davis@autoservice.com', role: 'employee', status: 'active' },
  //   { id: 5, name: 'Admin User', email: 'admin@autoservice.com', role: 'admin', status: 'active' }
  // ];

  const mockAppointments = [
    { id: 1, customer: 'John Doe', vehicle: 'Toyota Camry', service: 'Oil Change', date: 'Oct 5, 2025', status: 'scheduled' },
    { id: 2, customer: 'Jane Smith', vehicle: 'Ford F-150', service: 'Brake Inspection', date: 'Oct 6, 2025', status: 'confirmed' }
  ];

  useEffect(() => {
    // Load mock data
    setStats({
      totalUsers: 5,
      appointments: 2,
      employees: 2,
      revenue: 1250
    });
    // In a real app, we would setUsers(mockUsers);
    // For now, we're just storing it for future use
    setAppointments(mockAppointments);
    
    setServices([
      { id: 1, name: 'Oil Change', price: 49.99, category: 'Maintenance' },
      { id: 2, name: 'Brake Inspection', price: 79.99, category: 'Safety' },
      { id: 3, name: 'Engine Diagnostic', price: 99.99, category: 'Diagnostic' }
    ]);
  }, []);

  if (loading) {
    return <Loader fullScreen message="Loading dashboard..." />;
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
              value={stats.totalUsers}
              iconBg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaCalendarCheck />}
              title="Appointments"
              value={stats.appointments}
              iconBg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaUserTie />}
              title="Employees"
              value={stats.employees}
              iconBg="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaDollarSign />}
              title="Revenue"
              value={`$${stats.revenue}`}
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <FaSearch className="text-muted me-2" />
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="Search appointments..." 
                      style={{ width: '200px' }}
                    />
                  </div>
                  <Button variant="outline-primary" size="sm">
                    <FaBell className="me-1" /> Notifications
                  </Button>
                </div>
                
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Vehicle</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.customer}</td>
                        <td>{appointment.vehicle}</td>
                        <td>{appointment.service}</td>
                        <td>{appointment.date}</td>
                        <td>
                          <Badge bg={
                            appointment.status === 'scheduled' ? 'warning' :
                            appointment.status === 'confirmed' ? 'success' :
                            appointment.status === 'completed' ? 'primary' : 'secondary'
                          }>
                            {appointment.status}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-1">
                            View
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    ))}
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
                {services.map((service) => (
                  <div key={service.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <strong>{service.name}</strong>
                      <div className="text-muted small">{service.category}</div>
                    </div>
                    <Badge bg="primary">${service.price}</Badge>
                  </div>
                ))}
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
                  <div>
                    <span className="badge bg-success me-1">User</span>
                    New customer registered: John Doe
                  </div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">3 hours ago</small>
                  <div>
                    <span className="badge bg-primary me-1">Appointment</span>
                    Appointment scheduled for Oct 5
                  </div>
                </div>
                <div>
                  <small className="text-muted">5 hours ago</small>
                  <div>
                    <span className="badge bg-info me-1">Employee</span>
                    New employee added: Mike Johnson
                  </div>
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