import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PageNotFound from "./pages/PageNotFound.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Unit from "./pages/unit/Unit.jsx";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import {QUERY_STALE_TIME} from "./utils.jsx";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";


const queryClient=new QueryClient(
    {
        defaultOptions:{
            queries:{
                staleTime:QUERY_STALE_TIME,

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
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<Navigate to="units" />} />
                        <Route path="units" element={<Unit />} />
                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
