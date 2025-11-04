import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import { FaChartBar, FaDownload, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Loader from '../components/Loader';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('appointments');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Mock data for charts
  const appointmentsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Appointments',
        data: [12, 19, 15, 17, 22, 25],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12000, 19000, 15000, 17000, 22000, 25000],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const servicesData = {
    labels: ['Oil Change', 'Brake Service', 'Engine Diag', 'AC Service', 'Tire Rotation'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }
    ]
  };

  const employeePerformanceData = [
    { name: 'John Smith', appointments: 45, revenue: 22500, rating: 4.8 },
    { name: 'Mike Johnson', appointments: 38, revenue: 19000, rating: 4.6 },
    { name: 'Sarah Davis', appointments: 42, revenue: 21000, rating: 4.9 },
    { name: 'Robert Wilson', appointments: 35, revenue: 17500, rating: 4.5 }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const handleDownloadReport = () => {
    // Implement report download functionality
    alert('Report download functionality would be implemented here');
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Chart',
      },
    },
  };

  if (loading) {
    return <Loader fullScreen message="Loading reports..." />;
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <FaChartBar className="me-2" />
            Reports & Analytics
          </h2>
          <Button variant="outline-primary" onClick={handleDownloadReport}>
            <FaDownload className="me-2" />
            Download Report
          </Button>
        </div>

        {/* Report Filters */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="appointments">Appointments</option>
                    <option value="revenue">Revenue</option>
                    <option value="services">Services</option>
                    <option value="performance">Employee Performance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Charts Section */}
        <Row className="g-4 mb-4">
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">Appointments Overview</h5>
              </Card.Header>
              <Card.Body>
                <Bar data={appointmentsData} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">Revenue Trend</h5>
              </Card.Header>
              <Card.Body>
                <Line data={revenueData} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">Services Distribution</h5>
              </Card.Header>
              <Card.Body>
                <Pie data={servicesData} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">Employee Performance</h5>
              </Card.Header>
              <Card.Body>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Appointments</th>
                      <th>Revenue</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeePerformanceData.map((employee, index) => (
                      <tr key={index}>
                        <td>{employee.name}</td>
                        <td>{employee.appointments}</td>
                        <td>${employee.revenue.toLocaleString()}</td>
                        <td>{employee.rating}/5</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row className="g-4 mt-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm text-white bg-primary">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">137</h3>
                    <p className="mb-0">Total Appointments</p>
                  </div>
                  <FaCalendarAlt size={32} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm text-white bg-success">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">$67,500</h3>
                    <p className="mb-0">Total Revenue</p>
                  </div>
                  <FaDollarSign size={32} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm text-white bg-info">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">24</h3>
                    <p className="mb-0">Active Employees</p>
                  </div>
                  <FaUser size={32} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="border-0 shadow-sm text-white bg-warning">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">4.7</h3>
                    <p className="mb-0">Avg. Rating</p>
                  </div>
                  <FaStar size={32} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Reports;