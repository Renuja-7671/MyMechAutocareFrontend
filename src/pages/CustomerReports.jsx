// src/pages/CustomerReports.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge } from 'react-bootstrap';
import { FaDownload, FaChartBar, FaFilePdf, FaStar } from 'react-icons/fa';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/common/StatCard';
import NavbarComponent from '../components/common/CustomerNavbar';
import Loader from '../components/Loader';
import ChatbotWidget from '../components/ChatbotWidget';
//import { showInfo } from '../utils/toast';

const CustomerReports = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  //const [filter, setFilter] = useState('year');

  const stats = { total: 12, spent: 1249.88, top: 'Oil Change', savings: 89.50 };
  const history = [
    { id: 1, date: '2025-10-28', service: 'Oil Change', vehicle: 'Toyota Camry', cost: 49.99, status: 'Completed' },
    { id: 2, date: '2025-10-20', service: 'Brake Inspection', vehicle: 'Ford F-150', cost: 79.99, status: 'Completed' },
  ];

  const monthlyData = [
    { month: 'Jan', services: 2 }, { month: 'Feb', services: 1 }, { month: 'Mar', services: 3 },
    { month: 'Apr', services: 1 }, { month: 'May', services: 2 }, { month: 'Jun', services: 3 }
  ];

  const categoryData = [
    { name: 'Maintenance', value: 6, color: '#667eea' },
    { name: 'Safety', value: 3, color: '#f093fb' },
    { name: 'Diagnostic', value: 2, color: '#fa709a' },
    { name: 'Other', value: 1, color: '#30cfd0' }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (authLoading || loading) return <Loader fullScreen />;

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <NavbarComponent user={user} />
      <Container className="py-4">
        <div className="d-flex justify-content-between mb-4">
          <div>
            <h1 className="fw-bold">Service Reports</h1>
            <p className="text-muted">View your service history and analytics</p>
          </div>
          <div>
            <Button variant="outline-success" className="me-2"><FaFilePdf /> PDF</Button>
            <Button variant="outline-primary"><FaDownload /> Export</Button>
          </div>
        </div>

        <Row className="g-4 mb-4">
          <Col md={3}><StatCard title="Total Services" value={stats.total} icon={<FaChartBar />} iconBg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" /></Col>
          <Col md={3}><StatCard title="Total Spent" value={`$${stats.spent}`} icon={<FaDownload />} iconBg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" /></Col>
          <Col md={3}><StatCard title="Top Service" value={stats.top} icon={<FaStar />} iconBg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" /></Col>
          <Col md={3}><StatCard title="Savings" value={`$${stats.savings}`} icon={<FaChartBar />} iconBg="linear-gradient(135deg, #30cfd0 0%, #330867 100%)" /></Col>
        </Row>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header>
                <h5>Service History</h5>
              </Card.Header>
              <Card.Body>
                <Table hover responsive>
                  <thead><tr><th>Date</th><th>Service</th><th>Vehicle</th><th>Cost</th><th>Status</th></tr></thead>
                  <tbody>
                    {history.map(h => (
                      <tr key={h.id}>
                        <td>{h.date}</td>
                        <td>{h.service}</td>
                        <td>{h.vehicle}</td>
                        <td>${h.cost}</td>
                        <td><Badge bg="success">{h.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-3">
              <Card.Header><h6>Monthly Services</h6></Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="services" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header><h6>Service Categories</h6></Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {categoryData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ChatbotWidget />
    </div>
  );
};

export default CustomerReports;