import { useEffect } from "react";
import { API_ROUTES, getLookupData} from "../utils.jsx";
import dayjs from "dayjs";
import { useQueries } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

// This hook only work is to update form values from api
export function useFormPatch(form, id, setSpares, setServices) {
  const { pathname } = useLocation();
  const results = useQueries({
    queries: [
      {
        queryKey: ["singleService", id],
        placeholderData: [],
        enabled:
          (pathname.toLowerCase().endsWith("edit") && id !== undefined) ||
          (pathname.toLowerCase().endsWith("view") && id !== undefined),
        queryFn: () => getLookupData(`${API_ROUTES.services}/${id}`),
      },
      {
        queryKey: ["spareAll"],
        placeholderData: [],
        queryFn: () =>
          getLookupData(`${API_ROUTES.stockOnhandAll}?nonZeroSoh=false`),
      },

      {
        queryKey: ["serviceAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.serviceCatalogsAll),
      },
    ],
  });
  const [serviceQuery, spareCatalogQuery, serviceCatalogQuery] = results;

  const editMode = pathname.toLowerCase().endsWith("edit") && id !== undefined;
  const viewMode =
    pathname.toLowerCase().endsWith("edit") &&
    id !== undefined &&
    serviceQuery.data.service?.status==="FINALIZED";

  useEffect(() => {
    form.setFieldsValue({
      spares: [],
      payments: [],
      services: [],
      totals: [{ amount: 0 }, { amount: 0 }, { amount: 0 }],
      status: "DRAFT",
    });
  }, []);

  useEffect(() => {
    const selectedServiceNames = serviceQuery.data.service?.services.map(
      (s) => s.item,
    );

    setServices(
      serviceCatalogQuery.data.filter(
        (s) => !selectedServiceNames?.includes(s.name),
      ),
    );

    const selectedSpareIds = serviceQuery.data.service?.spares.map(
      (s) => s.itemId,
    );

    setSpares(
      spareCatalogQuery.data.filter(
        (s) => !selectedSpareIds?.includes(s.product.id),
      ),
    );

    if ((editMode || viewMode) && serviceQuery.data) {
      form.setFieldsValue({
        customerName: serviceQuery.data.customerName,
        customerPhone: serviceQuery.data.customerPhone,
        customerCar: serviceQuery.data.service?.customerCar.id,
        plateNumber: serviceQuery.data.service?.customerCar.plateNumber,
        model: serviceQuery.data.service?.customerCar.model,
        make: serviceQuery.data.service?.customerCar.make,
        status: serviceQuery.data.service?.status,
        spares: serviceQuery.data.service?.spares.map((s) => {
          const [spareObject] = spareCatalogQuery.data.filter(
            (fc) => fc.product.id === s.itemId,
          );
          return {
            id: s.itemId,
            itemId: s.itemId,
            item: s.item,
            price: s.price,
            quantity: s.quantity,
            total: s.quantity * s.price,
            unit: s.unit,
            soh: spareObject.stockOnhand,
            currentKm: s.currentKm,
            nextKm: s.nextKm,
          };
        }),
        services: serviceQuery.data.service?.services.map((s) => ({
          id: s.id,
          item: s.item,
          price: s.price,
          quantity: s.quantity,
          total: s.quantity * s.price,
        })),
        payments: serviceQuery.data.service?.payments.map((p) => {
          return {
            payment_date: dayjs(p.paymentDate),
            amount: p.amount,
            payment_method_id: p.paymentMethod.id,
            accountName: p.paymentMethod.accountName,
            accountNumber: p.paymentMethod.accountNumber,
            insuranceName: p.insuranceName,
          };
        }),
      });
    }
  }, [editMode, viewMode, form, serviceQuery.data]);

  return { serviceQuery, editMode, viewMode };
}
