import { createContext, useState } from 'react';

const AuthContext = createContext();

const mockUsers = [
  { email: 'admin@autoservice.com', password: 'password123', role: 'admin' },
  { email: 'mike.johnson@autoservice.com', password: 'password123', role: 'employee' },
  { email: 'john.doe@email.com', password: 'password123', role: 'customer' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = async ({ email, password }) => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    localStorage.setItem('user', JSON.stringify(foundUser));
    setUser(foundUser);
    setIsAuthenticated(true);

    return { success: true, user: foundUser };
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = { user, isAuthenticated, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
