import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { FaUser, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

const Profile = () => {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setFormData({
        firstName: user.customer?.firstName || user.employee?.firstName || '',
        lastName: user.customer?.lastName || user.employee?.lastName || '',
        email: user.email || '',
        phone: user.customer?.phone || user.employee?.phone || '',
        address: user.customer?.address || user.employee?.address || '',
        position: user.employee?.position || '',
        department: user.employee?.department || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      firstName: profileData.customer?.firstName || profileData.employee?.firstName || '',
      lastName: profileData.customer?.lastName || profileData.employee?.lastName || '',
      email: profileData.email || '',
      phone: profileData.customer?.phone || profileData.employee?.phone || '',
      address: profileData.customer?.address || profileData.employee?.address || '',
      position: profileData.employee?.position || '',
      department: profileData.employee?.department || ''
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, you would call an API to update the profile
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setProfileData({
        ...profileData,
        customer: profileData.customer ? {
          ...profileData.customer,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address
        } : profileData.customer,
        employee: profileData.employee ? {
          ...profileData.employee,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          position: formData.position,
          department: formData.department
        } : profileData.employee,
        email: formData.email
      });
      
      setEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Reload user data
      loadUser();
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    // Handle avatar upload
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just show a success message
      setSuccess('Avatar updated successfully!');
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading profile..." />;
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            <FaUser className="me-2" />
            My Profile
          </h2>
          {!editing && (
            <Button variant="primary" onClick={handleEdit}>
              <FaEdit className="me-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Row className="g-4">
          {/* Profile Card */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="position-relative d-inline-block mb-3">
                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto" 
                       style={{ width: '120px', height: '120px' }}>
                    <FaUser className="text-white" size={60} />
                  </div>
                  {editing && (
                    <div className="position-absolute bottom-0 end-0">
                      <label htmlFor="avatar-upload" className="btn btn-primary rounded-circle p-2">
                        <FaCamera />
                      </label>
                      <input 
                        type="file" 
                        id="avatar-upload" 
                        className="d-none" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  )}
                </div>
                
                <h4 className="mb-1">
                  {profileData.customer 
                    ? `${profileData.customer.firstName} ${profileData.customer.lastName}`
                    : profileData.employee 
                      ? `${profileData.employee.firstName} ${profileData.employee.lastName}`
                      : 'Admin User'}
                </h4>
                <p className="text-muted mb-3">
                  {profileData.role?.charAt(0).toUpperCase() + profileData.role?.slice(1)}
                </p>
                
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm">
                    Change Password
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    Notification Settings
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Account Stats */}
            <Card className="border-0 shadow-sm mt-4">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">Account Statistics</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Member Since</span>
                    <strong>Jan 15, 2023</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Last Login</span>
                    <strong>2 hours ago</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Total Appointments</span>
                    <strong>12</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Account Status</span>
                    <span className="badge bg-success">Active</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Profile Details */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">Profile Information</h5>
              </Card.Header>
              <Card.Body>
                {editing ? (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    {profileData.employee && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Position</Form.Label>
                          <Form.Control
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Department</Form.Label>
                          <Form.Control
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </>
                    )}

                    <div className="d-flex gap-2 mt-4">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        <FaTimes className="me-2" />
                        Cancel
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <small className="text-muted d-block">Full Name</small>
                      <strong>
                        {profileData.customer 
                          ? `${profileData.customer.firstName} ${profileData.customer.lastName}`
                          : profileData.employee 
                            ? `${profileData.employee.firstName} ${profileData.employee.lastName}`
                            : 'Admin User'}
                      </strong>
                    </div>
                    <div className="col-md-6 mb-3">
                      <small className="text-muted d-block">Email</small>
                      <strong>{profileData.email}</strong>
                    </div>
                    <div className="col-md-6 mb-3">
                      <small className="text-muted d-block">Phone</small>
                      <strong>{profileData.customer?.phone || profileData.employee?.phone || 'Not provided'}</strong>
                    </div>
                    <div className="col-md-6 mb-3">
                      <small className="text-muted d-block">Address</small>
                      <strong>{profileData.customer?.address || profileData.employee?.address || 'Not provided'}</strong>
                    </div>
                    
                    {profileData.employee && (
                      <>
                        <div className="col-md-6 mb-3">
                          <small className="text-muted d-block">Position</small>
                          <strong>{profileData.employee.position || 'Not provided'}</strong>
                        </div>
                        <div className="col-md-6 mb-3">
                          <small className="text-muted d-block">Department</small>
                          <strong>{profileData.employee.department || 'Not provided'}</strong>
                        </div>
                      </>
                    )}
                    
                    <div className="col-md-6 mb-3">
                      <small className="text-muted d-block">Role</small>
                      <strong className="text-capitalize">{profileData.role}</strong>
                    </div>
                    <div className="col-md-6 mb-3">
                      <small className="text-muted d-block">Account Status</small>
                      <span className="badge bg-success">Active</span>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-sm mt-4">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">Recent Activity</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-3">
                  <div className="d-flex">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                      <FaUser className="text-white" size={16} />
                    </div>
                    <div>
                      <div className="fw-bold">Profile updated</div>
                      <small className="text-muted">2 hours ago</small>
                    </div>
                  </div>
                  
                  <div className="d-flex">
                    <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                      <FaCalendarAlt className="text-white" size={16} />
                    </div>
                    <div>
                      <div className="fw-bold">Appointment booked</div>
                      <small className="text-muted">1 day ago</small>
                    </div>
                  </div>
                  
                  <div className="d-flex">
                    <div className="rounded-circle bg-info d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                      <FaTools className="text-white" size={16} />
                    </div>
                    <div>
                      <div className="fw-bold">Service completed</div>
                      <small className="text-muted">3 days ago</small>
                    </div>
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

export default Profile;