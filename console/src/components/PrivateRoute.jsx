import {
    Navigate,
} from "react-router-dom";
import {useAuth} from "../providers/AuthProvider.jsx";
import AppLayout from "./AppLayout.jsx";
import {Spin} from "antd";

const PrivateRoute = () => {
    const {isAuthenticated, loading} = useAuth();
    if (loading) {
        return <Spin tip="Checking authentication..." fullscreen/>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <AppLayout/>;
};

export default PrivateRoute;
