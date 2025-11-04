import { createContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { showError } from '../utils/toast';

// Create the context
const SocketContext = createContext();

// Socket provider component
export const SocketProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connectSocket = useCallback(() => {
    // Only connect if user is authenticated
    if (user) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5
      });

      newSocket.on('connect', () => {
        setConnected(true);
        setReconnectAttempts(0);
        console.log('Socket connected');
        
        // Join room based on user role
        newSocket.emit('joinRoom', user.role);
      });

      newSocket.on('disconnect', (reason) => {
        setConnected(false);
        console.log('Socket disconnected:', reason);
        
        // Show error only for unexpected disconnections
        if (reason === 'io server disconnect') {
          showError('Connection lost. Attempting to reconnect...');
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setReconnectAttempts(prev => prev + 1);
        
        // We need to use the previous state to track reconnect attempts properly
        // The error will be shown in the useEffect below
      });

      newSocket.on('reconnect', (attempt) => {
        console.log('Socket reconnected on attempt:', attempt);
        setConnected(true);
      });

      newSocket.on('reconnect_failed', () => {
        console.error('Socket reconnection failed');
        showError('Connection failed. Please refresh the page.');
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  useEffect(() => {
    const cleanup = connectSocket();
    return cleanup;
  }, [connectSocket]);

  // Handle reconnect attempts
  useEffect(() => {
    if (reconnectAttempts >= 5) {
      showError('Failed to establish connection. Please refresh the page.');
    }
  }, [reconnectAttempts]);

  // Context value
  const value = {
    socket,
    connected,
    reconnectAttempts
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;