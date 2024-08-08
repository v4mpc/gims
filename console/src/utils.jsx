import { notification, DatePicker } from "antd";
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

const { RangePicker } = DatePicker;

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const API_ROUTES = {
  products: "products",
  expenses: "expenses",
  dashboard: "dashboard",
  sales: "sales",
  paints: "paints",
  stockOnhand: "stock-on-hand",
  adjust: "stock-on-hand/adjust",
  stockOnhandAll: "stock-on-hand/all",
  units: "units",
  vehicles: "vehicles",
  vehiclesAll: "vehicles/all",
  serviceCatalogs: "serviceCatalogs",
  serviceCatalogsAll: "serviceCatalogs/all",
  paymentCatalog: "paymentCatalog",
  paymentCatalogAll: "paymentCatalog/all",
  customers: "customers",
  customersAll: "customers/all",
  customerCars: "customers/cars",
  categories: "categories",
  categoriesAll: "categories/all",
  unitsAll: "units/all",
  bulkSale: "sales/bulk",
  customReport: "custom-report",
  productAll: "products/all",
  fetchReportData: "custom-report/fetch-report",
  users: "users",
  login: "auth/login",
  logout: "auth/logout",
  authStatus: "auth/status",
};

export function openNotification(key, type, title, description) {
  notification[type]({
    key: key,
    message: title,
    description: description,
  });
}

export function toCustomerCars(customers) {
  const listOfListOfcars = customers.map((customer) => {
    return customer.cars.map((car) => ({
      id: car.id,
      customerName: customer.name,
      plateNumber: car.plateNumber,
      make: car.make,
      model: car.model,
      name: `${car.plateNumber}-${car.make}-${car.model}-${customer.name}`,
    }));
  });

  return listOfListOfcars.reduce((acc, curr) => acc.concat(curr), []);
}

const getItemParams = (tableParams, searchQuery, searchCategory) => ({
  size: tableParams.pagination?.pageSize,
  page: tableParams.pagination?.current - 1,
  q: searchQuery,
  c: searchCategory,
});

export function thousanSeparatorformatter(value) {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function thousanSeparatorparser(value) {
  return value.replace(/\$\s?|(,*)/g, "");
}

export async function getData(
  listPath,
  tableParams,
  searchQuery,
  searchCategory,
) {
  const resp = await fetch(
    `${BASE_URL}/${listPath}?${qs.stringify(getItemParams(tableParams, searchQuery, searchCategory))}`,
  );

  if (!resp.ok) {
    throw new Error("Network response was not ok");
  }
  return resp.json();
}

export async function getLookupData(listPath) {
  const resp = await fetch(`${BASE_URL}/${listPath}`);

  if (!resp.ok) {
    throw new Error("Network response was not ok");
  }
  return resp.json();
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

  if (Object.hasOwn(modifiedData, "initialPaymentDate") &&  data.values.initialPaymentDate != null) {
    Date.prototype.toISOString = function () {
      return dayjs(this).format(DATE_FORMAT);
    };
    modifiedData = {
      ...modifiedData,
      initialPaymentDate: data.values.initialPaymentDate.format(DATE_FORMAT),
    };
  }

  if (
    Object.hasOwn(modifiedData, "finalPaymentDate") &&
    data.values.finalPaymentDate != null
  ) {
    Date.prototype.toISOString = function () {
      return dayjs(this).format(DATE_FORMAT);
    };
    modifiedData = {
      ...modifiedData,
      finalPaymentDate: data.values.finalPaymentDate.format(DATE_FORMAT),
    };
  }

  if (Object.hasOwn(modifiedData, "unitOfMeasure")) {
    modifiedData = {
      ...modifiedData,
      unitOfMeasure: { id: modifiedData.unitOfMeasure },
    };
  }



    if (Object.hasOwn(modifiedData, "customerCar")) {
        modifiedData = {
            ...modifiedData,
            customerCar: { id: modifiedData.customerCar },
        };
    }



    if (Object.hasOwn(modifiedData, "paymentMethod")) {
        modifiedData = {
            ...modifiedData,
            paymentMethod: { id: modifiedData.paymentMethod },
        };
    }

  if (Object.hasOwn(modifiedData, "category")) {
    modifiedData = {
      ...modifiedData,
      category: { id: modifiedData.category },
    };
  }

  initData.body = JSON.stringify(modifiedData);

  const resp = await fetch(`${BASE_URL}/${data.urlPath}`, initData);
  if (!resp.ok) {
    throw new Error("Network response was not ok");
  }
  return resp.json();
}

export async function bulkTx(data) {
  Date.prototype.toISOString = function () {
    return dayjs(this).format(DATE_FORMAT);
  };

  const resp = await fetch(`${BASE_URL}/${API_ROUTES.bulkSale}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toSalePayload(data.postData, data.isSale)),
  });

  if (!resp.ok) {
    throw new Error("Network response was not ok");
  }

  return resp.json();
}
