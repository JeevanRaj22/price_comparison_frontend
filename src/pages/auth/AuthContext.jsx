import { createContext, useState } from 'react';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  // Simulate login
  const login = (id, username) => {
    setUserId(id);
    setUser(username);
    console.log('Logged in:', { id, username });
  };

  // Simulate logout
  const logout = () => {
    setUserId(null);  // Also reset userId on logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ userId, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
