import { notification, DatePicker,Form } from "antd";
import dayjs from "dayjs";
import qs from "qs";
import ProductSelect from "./components/ProductSelect.jsx";

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
  services: "services",
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

export function serviceGrandTotal(form, fields, sparefields) {
  const grandTotal = sparefields.reduce((acc, curr) => {
    const qty = form.getFieldValue(`quantity_${curr.key}`) ?? 0;
    const price = form.getFieldValue(`price_${curr.key}`) ?? 0;
    return acc + qty * price;
  }, 0);

  const sgrandTotal = fields.reduce((acc, curr) => {
    const qty = form.getFieldValue(`squantity_${curr.key}`) ?? 0;
    const price = form.getFieldValue(`sprice_${curr.key}`) ?? 0;
    return acc + qty * price;
  }, 0);

  return sgrandTotal + grandTotal;
}

export function toCustomerCars(customers) {
  const listOfListOfcars = customers.map((customer) => {
    return customer.cars.map((car) => ({
      id: car.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      plateNumber: car.plateNumber,
      make: car.make,
      model: car.model,
      name: `${car.plateNumber}-${car.make}-${car.model}-${customer.name}`,
    }));
  });

  return listOfListOfcars.reduce((acc, curr) => acc.concat(curr), []);
}

export function toFormList(services, spares, dbSpares) {
  const formFields = services.map((s, index) => ({
    key: index,
    names: [
      `sitemName_${index}`,
      `sprice_${index}`,
      `squantity_${index}`,
      `stotal_${index}`,
    ],
  }));

  const _serviceValues = services.flatMap((s, index) => ({
    [`sitemName_${index}`]: s.item,
    [`sprice_${index}`]: s.price,
    [`squantity_${index}`]: s.quantity,
    [`stotal_${index}`]: s.quantity * s.price,
  }));


    const serviceValues = _serviceValues.reduce((acc, obj) => {
        return { ...acc, ...obj };
    }, {});



  const _spareValues = spares.map((s, index) => {
    const [itemSoh] = dbSpares
      .filter((fc) => fc.product.id === s.itemId)
      .map((ms) => ms.stockOnhand);

    return {
      [`itemId_${index}`]: s.itemId,
      [`itemName_${index}`]: s.item,
      [`price_${index}`]: s.price,
      [`unit_${index}`]: s.unit,
      [`soh_${index}`]: itemSoh ?? 0,
      [`quantity_${index}`]: s.quantity,
      [`currentKm_${index}`]: s.currentKm,
      [`nextKm_${index}`]: s.nextKm,
      [`total_${index}`]: s.quantity * s.price,
    };
  });

  const formSpareFields = spares.map((s, index) => ({
    key: index,
    names: [
      `itemId_${index}`,
      `itemName_${index}`,
      `unit_${index}`,
      `price_${index}`,
      `soh_${index}`,
      `quantity_${index}`,
      `total_${index}`,
      `currentKm_${index}`,
      `nextKm_${index}`,
    ],
  }));

  // console.log(_spareValues);

  const spareValues = _spareValues.reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});


  return { formFields, formSpareFields, serviceValues, spareValues };
}

export function toModelList(form, fields, sparefields) {
  const servicesList = fields.map((f) => ({
    item: form.getFieldValue(`sitemName_${f.key}`),
    price: form.getFieldValue(`sprice_${f.key}`),
    quantity: form.getFieldValue(`squantity_${f.key}`),
  }));

  const spareList = sparefields.map((f) => ({
    itemId: form.getFieldValue(`itemId_${f.key}`),
    item: form.getFieldValue(`itemName_${f.key}`),
    price: form.getFieldValue(`price_${f.key}`),
    unit: form.getFieldValue(`unit_${f.key}`),
    quantity: form.getFieldValue(`quantity_${f.key}`),
    currentKm: form.getFieldValue(`currentKm_${f.key}`),
    nextKm: form.getFieldValue(`nextKm_${f.key}`),
  }));

  return { servicesList, spareList };
}

const getItemParams = (tableParams, searchQuery, searchCategory) => ({
  size: tableParams.pagination?.pageSize,
  page: tableParams.pagination?.current - 1,
  sort: "id,desc",
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

  if (
    Object.hasOwn(modifiedData, "initialPaymentDate") &&
    data.values.initialPaymentDate != null
  ) {
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

export function optionLabelFilter(input, option) {
  return option.label.toLowerCase().includes(input.toLowerCase());
}

export function filterOption(input, option) {
    return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
}

export function toObject(data) {
    return JSON.parse(data);
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

export function generateFilter(filter) {
    if (filter.name === "product") {
        return <ProductSelect key="product-select" />;
    } else if (filter.name === "dateRange") {
        return (
            <Form.Item
                label="Date range"
                key="dateRange"
                name="dateRange"
                rules={[
                    {
                        required: true,
                        message: "Please date",
                    },
                ]}
            >
                <RangePicker style={{ width: "100%" }} />
            </Form.Item>
        );
    }
    return null;
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
