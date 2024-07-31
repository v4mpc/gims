import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PageNotFound from "./pages/PageNotFound.jsx";
import AppLayout from "./components/AppLayout.jsx";


export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<Navigate to="dashboard" />} />
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
