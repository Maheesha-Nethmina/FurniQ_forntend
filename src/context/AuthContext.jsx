import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  
  // Derived state: crucial for determining user access levels
  const isAuthenticated = !!token;
  const userRole = user ? user.role : null;
  // FIX: Comparing against the assumed backend value 'ADMIN' (uppercase)
  const isAdmin = userRole === 'ADMIN'; 

  useEffect(() => {
    // Load user details from local storage on initial load
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole"); // Will store "ADMIN" or "USER"
    const storedUsername = localStorage.getItem("username"); 

    if (storedToken && storedEmail && storedRole && storedUsername) {
      setToken(storedToken);
      // Construct the full user object
      setUser({ email: storedEmail, role: storedRole, username: storedUsername });
    }
  }, []);

  const login = (data) => {
    // Destructure required fields from login data
    const { token, email, role, username } = data;
    
    // Save to localStorage (saving the backend's role string, e.g., 'ADMIN')
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
    localStorage.setItem("username", username);
    
    setToken(token);
    // Set the full user object
    setUser({ email, role, username });
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        token, 
        isAuthenticated, 
        userRole,        
        isAdmin,        
        login, 
        logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};