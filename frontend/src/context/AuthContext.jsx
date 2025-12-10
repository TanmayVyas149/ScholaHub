import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token) {
      setAuthenticated(true);
    }
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  
const login = (data) => {
  setAuthenticated(true);
  setUser(data.user);
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

  const logout = () => {
    setAuthenticated(false); 
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
