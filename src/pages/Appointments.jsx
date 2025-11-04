import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import { FaCalendarAlt, FaPlus, FaSearch, FaFilter, FaCar, FaUser, FaClock, FaCheck } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import customerApi from '../api/customer';
import employeeApi from '../api/employee';
import Loader from '../components/Loader';
import ServiceCard from '../components/ServiceCard';

const Appointments = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    vehicle: '',
    date: '',
    time: '',
    notes: ''
  });

  // Mock services data
  const services = [
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

  // Load appointments based on user role
  useEffect(() => {
    loadAppointments();
  }, [user]);

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on('serviceUpdate', (data) => {
        // Update appointment status in real-time
        setAppointments(prev => prev.map(app => 
          app.id === data.appointmentId ? { ...app, status: data.status } : app
        ));
      });

      return () => {
        socket.off('serviceUpdate');
      };
    }
  }, [socket]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      let response;
      
      if (user?.role === 'customer') {
        response = await customerApi.getAppointments();
      } else if (user?.role === 'employee') {
        response = await employeeApi.getAssignedServices();
      }
      
      setAppointments(response?.data || []);
    } catch (err) {
      setError('Failed to load appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleViewDetails = (service) => {
    // Implement view details functionality
    console.log('View details for:', service);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const appointmentData = {
        serviceId: selectedService.id,
        vehicle: bookingData.vehicle,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes
      };
      
      await customerApi.bookAppointment(appointmentData);
      
      // Close modal and reset form
      setShowBookingModal(false);
      setBookingData({ vehicle: '', date: '', time: '', notes: '' });
      setSelectedService(null);
      
      // Reload appointments
      loadAppointments();
    } catch (err) {
      setError('Failed to book appointment');
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Badge bg="warning">Scheduled</Badge>;
      case 'in-progress':
        return <Badge bg="primary">In Progress</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading appointments..." />;
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <FaCalendarAlt className="me-2" />
            Appointments
          </h2>
          
          {user?.role === 'customer' && (
            <Button variant="primary" onClick={() => setShowBookingModal(true)}>
              <FaPlus className="me-2" />
              Book Appointment
            </Button>
          )}
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <Row className="g-4">
          {/* Appointments List */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Your Appointments</h5>
                <div className="d-flex gap-2">
                  <div className="input-group" style={{ width: '250px' }}>
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search appointments..."
                    />
                  </div>
                  <Button variant="outline-secondary">
                    <FaFilter />
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {appointments.length === 0 ? (
                  <div className="text-center py-5">
                    <FaCalendarAlt size={48} className="text-muted mb-3" />
                    <h5 className="mb-2">No appointments found</h5>
                    <p className="text-muted">
                      {user?.role === 'customer' 
                        ? 'Book your first appointment to get started.' 
                        : 'No appointments assigned to you yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Vehicle</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment) => (
                          <tr key={appointment.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaTools className="text-muted me-2" />
                                <div>
                                  <div className="fw-bold">{appointment.serviceName}</div>
                                  <small className="text-muted">${appointment.price}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaCar className="text-muted me-2" />
                                <div>
                                  <div>{appointment.vehicle?.make} {appointment.vehicle?.model}</div>
                                  <small className="text-muted">{appointment.vehicle?.year}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaClock className="text-muted me-2" />
                                <div>
                                  <div>{new Date(appointment.date).toLocaleDateString()}</div>
                                  <small className="text-muted">{appointment.time}</small>
                                </div>
                              </div>
                            </td>
                            <td>{getStatusBadge(appointment.status)}</td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Services/Stats Sidebar */}
          <Col lg={4}>
            {user?.role === 'customer' ? (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Available Services</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-3">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onBook={handleBookService}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Today's Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-3">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <div>
                        <div className="fw-bold">Tasks Assigned</div>
                        <small className="text-muted">Today</small>
                      </div>
                      <div className="fs-4 fw-bold text-primary">5</div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <div>
                        <div className="fw-bold">Hours Logged</div>
                        <small className="text-muted">Today</small>
                      </div>
                      <div className="fs-4 fw-bold text-success">6.5h</div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <div>
                        <div className="fw-bold">Tasks Completed</div>
                        <small className="text-muted">Today</small>
                      </div>
                      <div className="fs-4 fw-bold text-info">3</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Service: {selectedService?.name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBookingSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle</Form.Label>
              <Form.Select 
                value={bookingData.vehicle}
                onChange={(e) => setBookingData({...bookingData, vehicle: e.target.value})}
                required
              >
                <option value="">Select your vehicle</option>
                <option value="1">Toyota Camry (2018)</option>
                <option value="2">Ford F-150 (2020)</option>
                <option value="3">Honda Civic (2019)</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bookingData.notes}
                onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                placeholder="Any specific requirements or concerns..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Book Appointment
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments;