import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FaTools, FaSearch, FaFilter, FaStar, FaDollarSign, FaClock } from 'react-icons/fa';
import ServiceCard from '../components/ServiceCard';
import Loader from '../components/Loader';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock services data
  const mockServices = [
    {
      id: 1,
      name: 'Oil Change',
      price: 49.99,
      duration: 30,
      rating: 4.8,
      category: 'maintenance',
      description: 'Complete oil change with filter replacement and fluid top-off.',
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Brake Inspection',
      price: 79.99,
      duration: 60,
      rating: 4.9,
      category: 'safety',
      description: 'Comprehensive brake system inspection and safety check.',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Engine Diagnostic',
      price: 99.99,
      duration: 90,
      rating: 4.7,
      category: 'diagnostic',
      description: 'Advanced engine diagnostics to identify performance issues.',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Tire Rotation',
      price: 29.99,
      duration: 45,
      rating: 4.6,
      category: 'maintenance',
      description: 'Proper tire rotation to ensure even wear and extend tire life.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=200&fit=crop'
    },
    {
      id: 5,
      name: 'AC Service',
      price: 129.99,
      duration: 75,
      rating: 4.5,
      category: 'comfort',
      description: 'Complete air conditioning system service and recharge.',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=200&fit=crop'
    },
    {
      id: 6,
      name: 'Transmission Service',
      price: 199.99,
      duration: 120,
      rating: 4.8,
      category: 'maintenance',
      description: 'Complete transmission fluid change and system inspection.',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=200&fit=crop'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServices(mockServices);
      setFilteredServices(mockServices);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let result = services;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filter !== 'all') {
      result = result.filter(service => service.category === filter);
    }
    
    setFilteredServices(result);
  }, [searchTerm, filter, services]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleBookService = (service) => {
    // Implement booking functionality
    console.log('Booking service:', service);
  };

  const handleViewDetails = (service) => {
    // Implement view details functionality
    console.log('View details for:', service);
  };

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'safety', label: 'Safety' },
    { value: 'diagnostic', label: 'Diagnostic' },
    { value: 'comfort', label: 'Comfort' }
  ];

  if (loading) {
    return <Loader fullScreen message="Loading services..." />;
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <FaTools className="me-2" />
            Our Services
          </h2>
        </div>

        {/* Search and Filter */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaFilter />
                  </InputGroup.Text>
                  <Form.Select value={filter} onChange={handleFilterChange}>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <FaTools size={48} className="text-muted mb-3" />
              <h5 className="mb-2">No services found</h5>
              <p className="text-muted">
                Try adjusting your search or filter criteria.
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {filteredServices.map((service) => (
              <Col key={service.id} md={6} lg={4}>
                <ServiceCard
                  service={service}
                  onBook={handleBookService}
                  onViewDetails={handleViewDetails}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* Service Categories Info */}
        <Card className="border-0 shadow-sm mt-4">
          <Card.Header className="bg-white border-bottom">
            <h5 className="mb-0">Service Categories</h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-4">
              {categories.filter(cat => cat.value !== 'all').map(category => (
                <Col key={category.value} md={6} lg={3}>
                  <div className="d-flex align-items-center p-3 bg-light rounded">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <FaTools className="text-white" />
                    </div>
                    <div>
                      <div className="fw-bold">{category.label}</div>
                      <small className="text-muted">
                        {services.filter(s => s.category === category.value).length} services
                      </small>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Services;