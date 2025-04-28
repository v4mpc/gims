import {createContext, useContext, useState, useEffect} from "react";
import axiosClient from "../axiosClient.jsx";
import {API_ROUTES, BASE_URL, isJwtValid, openNotification} from "../utils.jsx";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token && isJwtValid(token)) {
            setIsAuthenticated(true);
            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);


    const logout = () => {
        localStorage.removeItem("jwt");
        delete axiosClient.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
        navigate("/login");
    };


    const login = async (username, password) => {


        try {
            const {data} = await axiosClient.post(`${BASE_URL}/${API_ROUTES.login}`, {
                username,
                password,
            });
            localStorage.setItem("jwt", data.token);

            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            setIsAuthenticated(true);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            openNotification("login-failed", "error", "Error", "Login failed",);
        }

    };

    return <AuthContext.Provider
        value={{isAuthenticated, login, loading, logout}}>{children}</AuthContext.Provider>

}


export const useAuth = () => {
    return useContext(AuthContext);
};
