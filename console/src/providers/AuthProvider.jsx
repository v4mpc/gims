import { createContext, useContext } from "react";
import { useStorage } from "../hooks/useStorage.jsx";

const AuthContext = createContext();

export const AuthProvider=({ children }) =>{
  const [isAuthenticated, setIsAuthenticated] = useStorage(
    true,
    "isAuthenticated",
  );

  const login = () => {
    // Simulate authentication logic
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Simulate logout logic
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>

}


export const useAuth = () => {
  return useContext(AuthContext);
};
