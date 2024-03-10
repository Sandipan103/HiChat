import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, server }}>
      {children}
    </AuthContext.Provider>
  );
};

const server =  "http://localhost:4000/api/v1";
export { AuthContext, AuthProvider, server };