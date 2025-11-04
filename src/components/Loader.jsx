import { Spinner } from 'react-bootstrap';

const Loader = ({ fullScreen = false, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">{message}</p>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="primary" size="sm" />
      <span className="ms-2 text-muted">{message}</span>
    </div>
  );
};

export default Loader;