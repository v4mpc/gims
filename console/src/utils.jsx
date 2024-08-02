import {notification, DatePicker} from "antd";
import dayjs from "dayjs";
import qs from "qs";

// export const BASE_URL = "http://localhost:3000";
export const BASE_URL = "http://localhost:8080/api";
// export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const DEFAULT_PAGE_SIZE = 10;

export const SEARCH_BOX_WIDTH = 300;

// in minutes
export const QUERY_STALE_TIME = 1;

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
    categories: "categories",
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


const getItemParams = (tableParams, searchQuery) => (
    {
        size: tableParams.pagination?.pageSize,
        page: tableParams.pagination?.current - 1,
        q: searchQuery,
    }
);


export async function getData(listPath, tableParams, searchQuery) {
    const resp = await fetch(
        `${BASE_URL}/${listPath}?${qs.stringify(getItemParams(tableParams, searchQuery))}`,
    );

    if (!resp.ok) {
        throw new Error("Network response was not ok");
    }
    return resp.json();
}


export async function putItem(data) {

    let initData = {
        method: data.method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    };
    let modifiedData = data.values;
    if (Object.hasOwn(modifiedData, "createdAt")) {
        Date.prototype.toISOString = function () {
            return dayjs(this).format(DATE_FORMAT);
        };
        modifiedData = {
            ...modifiedData,
            createdAt: data.values.createdAt.format(DATE_FORMAT),
        };
    }

    if (Object.hasOwn(modifiedData, "unitOfMeasure")) {
        modifiedData = {
            ...modifiedData,
            unitOfMeasure: {id: modifiedData.unitOfMeasure},
        };
    }
    initData.body = JSON.stringify(modifiedData);


    const resp = await fetch(`${BASE_URL}/${data.urlPath}`, initData);
    if (!resp.ok) {
        throw new Error("Network response was not ok");
    }
    return resp.json();
}



