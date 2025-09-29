export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    return null;
  }
};

export const getUserRole = () => {
  const user = getUserFromToken();
  return user?.role || null;
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const user = getUserFromToken();
  if (!user) return false;

  // Check if token is expired
  const currentTime = Date.now() / 1000;
  return user.exp > currentTime;
};