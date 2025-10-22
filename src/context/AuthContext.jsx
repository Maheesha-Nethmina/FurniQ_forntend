// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    // Check for username on initial load
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");
    // --- MODIFICATION ---
    const storedUsername = localStorage.getItem("username"); 

    if (storedToken && storedEmail && storedRole && storedUsername) {
      setToken(storedToken);
      // Add username to user object
      setUser({ email: storedEmail, role: storedRole, username: storedUsername });
    }
    // --- END MODIFICATION ---
  }, []);

  const login = (data) => {
    // --- MODIFICATION ---
    // Destructure username from login data
    const { token, email, role, username } = data;
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
    // Save username to localStorage
    localStorage.setItem("username", username);
    setToken(token);
    // Add username to user object
    setUser({ email, role, username });
    // --- END MODIFICATION ---
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};