import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { FaCar, FaCalendarAlt, FaTools, FaStar, FaPlus, FaHistory, FaPhone, FaBell, FaCog } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { showInfo } from '../utils/toast';
import NavbarComponent from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import ServiceCard from '../components/ServiceCard';
import Loader from '../components/Loader';

const CustomerDashboard = () => {
  const { user, loading } = useAuth();
  const { socket } = useSocket();
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    vehicles: 0,
    upcoming: 0,
    active: 0,
    completed: 0
  });

  // Mock data for services
  const popularServices = [
    {
      id: 1,
      name: 'Oil Change',
      price: 49.99,
      duration: 30,
      rating: 4.8,
      description: 'Complete oil change with filter replacement and fluid top-off.'
    },
    {
      id: 2,
      name: 'Brake Inspection',
      price: 79.99,
      duration: 60,
      rating: 4.9,
      description: 'Comprehensive brake system inspection and safety check.'
    },
    {
      id: 3,
      name: 'Engine Diagnostic',
      price: 99.99,
      duration: 90,
      rating: 4.7,
      description: 'Advanced engine diagnostics to identify performance issues.'
    }
  ];

  useEffect(() => {
    // Load mock data
    setStats({
      vehicles: 2,
      upcoming: 1,
      active: 1,
      completed: 5
    });
    
    setAppointments([
      {
        id: 1,
        service: 'Oil Change',
        vehicle: 'Toyota Camry (2018)',
        date: '2025-10-15',
        time: '10:00 AM',
        status: 'scheduled'
      },
      {
        id: 2,
        service: 'Brake Inspection',
        vehicle: 'Ford F-150 (2020)',
        date: '2025-10-20',
        time: '2:00 PM',
        status: 'in-progress'
      }
    ]);
    
    setNotifications([
      {
        id: 1,
        message: 'Your oil change appointment is confirmed for tomorrow at 10:00 AM',
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        message: 'Your brake inspection is in progress',
        time: '1 day ago',
        read: true
      }
    ]);
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      const handleServiceUpdate = (data) => {
        // Update appointment status in real-time
        setAppointments(prev => prev.map(app => 
          app.id === data.appointmentId ? { ...app, status: data.status } : app
        ));
        
        // Show notification
        showInfo(`Service status updated to: ${data.status}`);
      };

      const handleNotification = (data) => {
        // Add new notification
        setNotifications(prev => [{
          id: Date.now(),
          message: data.message,
          time: 'Just now',
          read: false
        }, ...prev]);
        
        // Show toast notification
        showInfo(data.message);
      };

      socket.on('serviceUpdate', handleServiceUpdate);
      socket.on('notification', handleNotification);

      return () => {
        socket.off('serviceUpdate', handleServiceUpdate);
        socket.off('notification', handleNotification);
      };
    }
  }, [socket]);

  if (loading) {
    return <Loader fullScreen message="Loading dashboard..." />;
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
              value={stats.vehicles}
              iconBg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaCalendarAlt />}
              title="Upcoming"
              value={stats.upcoming}
              iconBg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaTools />}
              title="Active Services"
              value={stats.active}
              iconBg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaStar />}
              title="Completed"
              value={stats.completed}
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
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 fw-bold d-flex justify-content-between align-items-center">
                  <span>Notifications</span>
                  <Badge bg="primary">{notifications.filter(n => !n.read).length}</Badge>
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {notifications.length === 0 ? (
                  <div className="text-center text-muted py-3">
                    <FaBell className="mb-2 opacity-50" size={24} />
                    <p className="mb-0 small">No notifications</p>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {notifications.map((notification) => (
                      <ListGroup.Item 
                        key={notification.id} 
                        className={`border-0 px-3 py-2 ${!notification.read ? 'bg-light' : ''}`}
                      >
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <div className="small">{notification.message}</div>
                            <div className="small text-muted mt-1">{notification.time}</div>
                          </div>
                          {!notification.read && (
                            <Badge pill bg="primary" className="ms-2">New</Badge>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>

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
                  Service History
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
          <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Recent Appointments</h5>
            <Button variant="outline-primary" size="sm">
              View All
            </Button>
          </Card.Header>
          <Card.Body>
            {appointments.length === 0 ? (
              <div className="text-center text-muted py-5">
                <FaCalendarAlt size={48} className="mb-3 opacity-50" />
                <p className="mb-0">No appointments scheduled</p>
                <small>Book your first appointment to get started</small>
              </div>
            ) : (
              <div className="d-grid gap-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="d-flex align-items-center p-3 border rounded">
                    <div className="flex-grow-1">
                      <div className="fw-bold">{appointment.service}</div>
                      <div className="text-muted small">{appointment.vehicle}</div>
                      <div className="text-muted small">{appointment.date} at {appointment.time}</div>
                    </div>
                    <div>
                      <Badge bg={
                        appointment.status === 'scheduled' ? 'warning' :
                        appointment.status === 'in-progress' ? 'primary' :
                        appointment.status === 'completed' ? 'success' : 'secondary'
                      }>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm mt-4">
          <Card.Header className="bg-white border-bottom">
            <h5 className="mb-0 fw-bold">Popular Services</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {popularServices.map((service) => (
                <Col md={6} lg={4} className="mb-3" key={service.id}>
                  <ServiceCard service={service} />
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CustomerDashboard;