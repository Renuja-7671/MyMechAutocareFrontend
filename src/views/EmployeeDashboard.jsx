import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { FaTasks, FaClock, FaCheckCircle, FaExclamationCircle, FaPlay, FaList, FaComments, FaUser, FaTools, FaHistory } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { showInfo, showSuccess } from '../utils/toast';
import NavbarComponent from '../components/common/Navbar';
import StatCard from '../components/common/StatCard';
import Loader from '../components/Loader';

const EmployeeDashboard = () => {
  const { user, loading } = useAuth();
  const { socket } = useSocket();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    hoursToday: 0,
    completed: 0,
    pending: 0
  });

  // Mock data for tasks
  const tasks = [
    {
      id: 1,
      title: 'Oil Change - Toyota Camry',
      customer: 'John Doe',
      vehicle: '2018 Toyota Camry',
      status: 'in-progress',
      progress: 60,
      priority: 'medium',
      estimatedTime: '30 min'
    },
    {
      id: 2,
      title: 'Brake Inspection - Ford F-150',
      customer: 'Jane Smith',
      vehicle: '2020 Ford F-150',
      status: 'scheduled',
      progress: 0,
      priority: 'high',
      estimatedTime: '60 min'
    },
    {
      id: 3,
      title: 'Engine Diagnostic - Honda Civic',
      customer: 'Robert Johnson',
      vehicle: '2019 Honda Civic',
      status: 'completed',
      progress: 100,
      priority: 'low',
      estimatedTime: '90 min'
    }
  ];

  useEffect(() => {
    // Load mock data
    setStats({
      assigned: 5,
      hoursToday: 4.5,
      completed: 3,
      pending: 2
    });
    
    setAssignedTasks(tasks);
    
    setWorkLogs([
      {
        id: 1,
        task: 'Oil Change',
        startTime: '09:00 AM',
        endTime: '09:30 AM',
        duration: '30 min'
      },
      {
        id: 2,
        task: 'Tire Rotation',
        startTime: '10:00 AM',
        endTime: '10:45 AM',
        duration: '45 min'
      }
    ]);
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      const handleServiceUpdate = (data) => {
        // Update task status in real-time
        setAssignedTasks(prev => prev.map(task => 
          task.id === data.taskId ? { ...task, status: data.status, progress: data.progress } : task
        ));
        
        // Show notification
        showInfo(`Task ${data.taskId} updated to: ${data.status}`);
      };

      const handleMessage = (data) => {
        // Handle incoming messages
        console.log('New message:', data);
        showSuccess('New message received');
      };

      socket.on('serviceUpdate', handleServiceUpdate);
      socket.on('message', handleMessage);

      return () => {
        socket.off('serviceUpdate', handleServiceUpdate);
        socket.off('message', handleMessage);
      };
    }
  }, [socket]);

  if (loading) {
    return <Loader fullScreen message="Loading dashboard..." />;
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
              value={stats.assigned}
              iconBg="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaClock />}
              title="Hours Today"
              value={`${stats.hoursToday}h`}
              iconBg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaCheckCircle />}
              title="Completed"
              value={stats.completed}
              iconBg="linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              icon={<FaExclamationCircle />}
              title="Pending"
              value={stats.pending}
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
                {assignedTasks.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FaTasks size={48} className="mb-3 opacity-50" />
                    <p className="mb-0">No tasks assigned yet</p>
                    <small>Your assigned tasks will appear here</small>
                  </div>
                ) : (
                  <div className="d-grid gap-3">
                    {assignedTasks.map((task) => (
                      <div key={task.id} className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="fw-bold">{task.title}</div>
                            <div className="text-muted small">{task.customer} - {task.vehicle}</div>
                          </div>
                          <Badge bg={
                            task.status === 'scheduled' ? 'warning' :
                            task.status === 'in-progress' ? 'primary' :
                            task.status === 'completed' ? 'success' : 'secondary'
                          }>
                            {task.status}
                          </Badge>
                        </div>
                        
                        <ProgressBar 
                          now={task.progress} 
                          className="mb-2" 
                          variant={
                            task.status === 'scheduled' ? 'warning' :
                            task.status === 'in-progress' ? 'primary' :
                            task.status === 'completed' ? 'success' : 'secondary'
                          }
                        />
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <FaClock className="me-1" /> {task.estimatedTime}
                          </small>
                          <div>
                            <Button variant="outline-primary" size="sm" className="me-2">
                              <FaPlay /> Start
                            </Button>
                            <Button variant="outline-success" size="sm">
                              <FaCheckCircle /> Complete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
            {workLogs.length === 0 ? (
              <div className="text-center text-muted py-5">
                <FaHistory size={48} className="mb-3 opacity-50" />
                <p className="mb-0">No work history</p>
                <small>Your completed tasks will appear here</small>
              </div>
            ) : (
              <div className="d-grid gap-3">
                {workLogs.map((log) => (
                  <div key={log.id} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                    <div>
                      <div className="fw-bold">{log.task}</div>
                      <div className="text-muted small">{log.startTime} - {log.endTime}</div>
                    </div>
                    <Badge bg="success">{log.duration}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EmployeeDashboard;