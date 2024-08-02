import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import PageNotFound from "./pages/PageNotFound.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Unit from "./pages/unit/Unit.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {QUERY_STALE_TIME} from "./utils.jsx";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import Category from "./pages/category/Category.jsx";


const queryClient = new QueryClient(
    {
        defaultOptions: {
            queries: {
                staleTime: QUERY_STALE_TIME * 60 * 1000,

            }
        }
    }
);

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false}/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppLayout/>}>
                        <Route index element={<Navigate to="settings/units"/>}/>
                        <Route path="settings/units" element={<Unit/>}/>
                        <Route path="settings/categories" element={<Category/>}/>
                    </Route>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
