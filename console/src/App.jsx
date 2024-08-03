import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import PageNotFound from "./pages/PageNotFound.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Unit from "./pages/unit/Unit.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {QUERY_STALE_TIME} from "./utils.jsx";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import Category from "./pages/category/Category.jsx";
import Product from "./pages/product/Product.jsx";
import ServiceCatalog from "./pages/serviceCatalog/serviceCatalog.jsx";
import Expense from "./pages/expense/Expense.jsx";
import Customer from "./pages/customer/Customer.jsx";


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
                        <Route path="expense" element={<Expense />} />
                        <Route path="settings/units" element={<Unit/>}/>
                        <Route path="settings/categories" element={<Category/>}/>
                        <Route path="settings/customers" element={<Customer/>}/>
                        <Route path="settings/products" element={<Product/>}/>
                        <Route path="settings/service-catalogs" element={<ServiceCatalog/>}/>
                    </Route>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
