import { Card } from 'react-bootstrap';

const StatCard = ({ icon, title, value, gradient, iconBg }) => {
  return (
    <Card className="border-0 shadow-sm card-hover h-100">
      <Card.Body className="d-flex align-items-center">
        <div
          className="rounded-circle p-3 me-3"
          style={{
            background: iconBg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="fs-3 text-white">{icon}</span>
        </div>
        <div>
          <h3 className="mb-0 fw-bold">{value}</h3>
          <p className="mb-0 text-muted">{title}</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;