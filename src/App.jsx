import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PageNotFound from "./pages/PageNotFound.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Unit from "./pages/unit/Unit.jsx";


export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<Navigate to="units" />} />
                        <Route path="units" element={<Unit />} />
                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
