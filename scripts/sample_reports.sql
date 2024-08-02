--
-- PostgreSQL database dump
--

-- Dumped from database version 13.0
-- Dumped by pg_dump version 15.4


INSERT INTO public.custom_reports VALUES (2, '2024-05-22', '2024-05-22', true, '[{"name":"date","displayName":"Date"},{"name":"product_name","displayName":"Product"},{"name":"sale_price","displayName":"Sell price"},{"name":"quantity","displayName":"Quantity"},{"name":"total_amount","displayName":"Total"}]', NULL, 2, '[{"name":"dateRange"}]', 'select s.created_at date, s.product_name,s.sale_price,s.quantity,round(s.sale_price*s.quantity) total_amount
from sales s where s.is_sale=true and s.created_at>=''${dateFrom}'' and s.created_at<=''${dateTo}''', 'sales_report', 'Sales report');
INSERT INTO public.custom_reports VALUES (1, '2024-05-22', '2024-05-22', true, '[{"name":"date","displayName":"Date"},{"name":"product_name","displayName":"Product"},{"name":"buy_price","displayName":"Buy price"},{"name":"quantity","displayName":"Quantity"},{"name":"total_amount","displayName":"Total"}]', NULL, 1, '[{"name":"dateRange"}]', 'select s.created_at date, s.product_name,s.buy_price,s.quantity,round(s.buy_price*s.quantity) total_amount
from sales s where s.is_sale=false and s.created_at>=''${dateFrom}'' and s.created_at<=''${dateTo}''', 'buy_reports', 'Purchases report');
INSERT INTO public.custom_reports VALUES (3, '2024-05-22', '2024-05-22', true, '[{"name":"date","displayName":"Date"},{"name":"name","displayName":"Expense"},{"name":"total_amount","displayName":"Amount"}]', NULL, 3, '[{"name":"dateRange"}]', 'select e.created_at date, e.name,e.amount total_amount
from expenses e where  e.created_at>=''${dateFrom}'' and e.created_at<=''${dateTo}''', 'expense_report', 'Expense report');
