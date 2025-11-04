import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import router from './router';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
