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
import PaymentCatalog from "./pages/paymentCatalog/PaymentCatalog.jsx";
import Vehicle from "./pages/vehicle/Vehicle.jsx";
import StockOnhand from "./pages/stockOnhand/StockOnhand.jsx";
import Buy from "./pages/Buy.jsx";
import BuySuccess from "./pages/BuySuccess.jsx";
import Sell from "./pages/Sell.jsx";
import CreateService from "./pages/Service/CreateService.jsx";
import CreatePaint from "./pages/paint/CreatePaint.jsx";
import ListPaint from "./pages/paint/ListPaint.jsx";
import ListService from "./pages/service/ListService.jsx";
import Dashboard from "./pages/Dashboard.jsx";


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
                        <Route index element={<Navigate to="dashboard"/>}/>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="expense" element={<Expense />} />
                        <Route path="tx-success" element={<BuySuccess />} />
                        <Route path="stock-on-hand" element={<StockOnhand />} />
                        <Route path="buy" element={<Buy />} />
                        <Route path="sell" element={<Sell />} />

                        <Route path="paint" element={<ListPaint />} />
                        <Route path="paint/:id" element={<CreatePaint />} />
                        <Route path="paint/create" element={<CreatePaint />} />

                        <Route path="service" element={<ListService />} />
                        <Route path="service/:id" element={<CreateService />} />
                        <Route path="service/create" element={<CreateService />} />

                        <Route path="settings/units" element={<Unit/>}/>
                        <Route path="settings/categories" element={<Category/>}/>
                        <Route path="settings/customers" element={<Customer/>}/>
                        <Route path="settings/products" element={<Product/>}/>
                        <Route path="settings/payment-catalog" element={<PaymentCatalog/>}/>
                        <Route path="settings/GService-catalogs" element={<ServiceCatalog/>}/>
                        <Route path="settings/vehicles" element={<Vehicle/>}/>
                    </Route>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
