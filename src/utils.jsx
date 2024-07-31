import {notification, DatePicker} from "antd";
import dayjs from "dayjs";
import qs from "qs";

export const BASE_URL = "http://localhost:3000";
// export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const DEFAULT_PAGE_SIZE = 20;
export const QUERY_STALE_TIME = 60 * 1000;

export const DATE_FORMAT = "YYYY-MM-DD";

export const DASHBOARD_METRICS_PRECISION = 0;
export const DASHBOARD_DIVIDER_ORIENTATION = "left";
export const LINE_TENSION = 0.3;

const {RangePicker} = DatePicker;

export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

export const API_ROUTES = {
    products: "products",
    expenses: "expenses",
    dashboard: "dashboard",
    sales: "sales",
    stockOnhand: "stock-on-hand",
    adjust: "stock-on-hand/adjust",
    stockOnhandAll: "stock-on-hand/all",
    units: "units",
    unitsAll: "units/all",
    bulkSale: "sales/bulk",
    customReport: "custom-report",
    productAll: "products/all",
    fetchReportData: "custom-report/fetch-report",
    users: "users",
    login: "auth/login",
    logout: "auth/logout",
    authStatus: "auth/status"
};

export function openNotification(key, type, title, description) {
    notification[type]({
        key: key,
        message: title,
        description: description,
    });
}

export function fetchWithCredentials(url, options = {}) {
    options.credentials = "include";
    return fetch(url, options);
}

export function toObject(data) {
    return JSON.parse(data);
}


const getItemParams = (params) =>
    params.filters.name
        ? {
            size: params.pagination?.pageSize,
            page: params.pagination?.current - 1,
            name: params.filters.name[0],
        }
        : {
            size: params.pagination?.pageSize,
            page: params.pagination?.current - 1,
        };


export async function getData(listPath, tableParams) {
    const resp = await fetch(
        `${BASE_URL}/${listPath}?${qs.stringify(getItemParams(tableParams))}`,
    );

    if (!resp.ok) {
        throw new Error("Network response was not ok");
    }
    return resp.json();
}


export function generateColumns(stringColumns) {
    let objectColumns = toObject(stringColumns);
    return objectColumns.map((column) => ({
        title: column.displayName,
        dataIndex: column.name,
        key: column.name,
        width: column.width,
    }));
}

export function filterOption(input, option) {
    return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
}


export function toSalePayload(data, isSale) {
    return data.map((item) => ({
        productId: item.id,
        isSale: isSale,
        saleAdjustment: 0,
        adjustmentQuantity: item.saleQuantity,
        adjustmentDate: dayjs(item.saleDate, DATE_FORMAT),
    }));
}

export async function fetchData(
    data,
    path,
    setIsLoading,
    setError,
    method = "GET",
    setData = null,
    form = null,
    successCallback,
) {
    let initData = {
        method: method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (method === "POST" || method === "PUT") {
        let modifiedData = data;
        if (Object.hasOwn(modifiedData, "createdAt")) {
            Date.prototype.toISOString = function () {
                return dayjs(this).format(DATE_FORMAT);
            };
            modifiedData = {
                ...modifiedData,
                createdAt: data.createdAt.format(DATE_FORMAT),
            };
        }

        if (Object.hasOwn(modifiedData, "unitOfMeasure")) {
            modifiedData = {
                ...modifiedData,
                unitOfMeasure: {id: modifiedData.unitOfMeasure},
            };
        }
        initData.body = JSON.stringify(modifiedData);
    }

    try {
        setIsLoading(true);
        setError("");
        const resp = await fetch(`${BASE_URL}/${path}`, initData);
        if (!resp.ok) {
            throw new Error("Network response was not ok");
        }
        const respData = await resp.json();
        if (method === "GET") {
            setData(respData);
        }
        if (method === "POST" || method === "PUT") {
            form?.resetFields();
            openNotification(
                "post-success",
                "success",
                "Success",
                "Record save successfully",
            );
            if (successCallback) {
                successCallback();
            }
        }
    } catch (e) {
        console.error(e);
        openNotification(e.message, "error", "Error", e.message);
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
}
