import {
  Navigate,
} from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.jsx";
import AppLayout from "./AppLayout.jsx";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  let next = "/login";
  return isAuthenticated ? <AppLayout /> : <Navigate to={next} />;
};

export default PrivateRoute;
