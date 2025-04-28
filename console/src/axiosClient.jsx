import axios from "axios";
import {BASE_URL} from "./utils.jsx";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});


// axiosClient.interceptors.request.use(
//     config => {
//         const token = localStorage.getItem("jwt");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     error => {
//         // request setup error
//         return Promise.reject(error);
//     }
// );


axiosClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.log(error.response);
            const {status} = error.response;
            if (status === 401 || status === 403) {
                localStorage.removeItem("jwt");
                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }

            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
