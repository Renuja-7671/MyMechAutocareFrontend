import { Card, Badge, Button } from 'react-bootstrap';
import { FaTools, FaClock, FaDollarSign, FaStar } from 'react-icons/fa';

const ServiceCard = ({ service, onBook, onViewDetails }) => {
  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Img 
        variant="top" 
        src={service.image || "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=200&fit=crop"} 
        style={{ height: '150px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{service.name}</Card.Title>
          <Badge bg="primary">${service.price}</Badge>
        </div>
        
        <Card.Text className="text-muted flex-grow-1">
          {service.description}
        </Card.Text>
        
        <div className="d-flex justify-content-between text-muted small mb-3">
          <div className="d-flex align-items-center">
            <FaClock className="me-1" />
            <span>{service.duration} min</span>
          </div>
          <div className="d-flex align-items-center">
            <FaStar className="me-1 text-warning" />
            <span>{service.rating}</span>
          </div>
        </div>
        
        <div className="d-flex gap-2 mt-auto">
          {onBook && (
            <Button 
              variant="primary" 
              size="sm" 
              className="flex-grow-1"
              onClick={() => onBook(service)}
            >
              <FaTools className="me-1" />
              Book Now
            </Button>
          )}
          {onViewDetails && (
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => onViewDetails(service)}
            >
              Details
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;