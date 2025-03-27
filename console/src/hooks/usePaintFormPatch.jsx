import { useEffect } from "react";
import { API_ROUTES, getLookupData } from "../utils.jsx";
import dayjs from "dayjs";
import { useQueries } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

// This hook only work is to update form values from api
export function usePaintFormPatch(form, id) {
  const { pathname } = useLocation();
  const results = useQueries({
    queries: [
      {
        queryKey: ["singlePaint", id],
        placeholderData: [],
        enabled:
          (pathname.toLowerCase().endsWith("edit") && id !== undefined) ||
          (pathname.toLowerCase().endsWith("view") && id !== undefined),
        queryFn: () => getLookupData(`${API_ROUTES.paints}/${id}`),
      },
    ],
  });
  const [paintQuery] = results;

  const editMode = pathname.toLowerCase().endsWith("edit") && id !== undefined;
  const viewMode =
    pathname.toLowerCase().endsWith("edit") &&
    id !== undefined &&
    paintQuery.data.service?.status === "FINALIZED";

  useEffect(() => {
    form.setFieldsValue({
      payments: [],
      paints: [],
      status: "DRAFT",
    });
  }, []);

  useEffect(() => {

    if ((editMode || viewMode) && paintQuery.data) {
      form.setFieldsValue({
        customerName: paintQuery.data.customerName,
        customerPhone: paintQuery.data.customerPhone,
        customerCar: paintQuery.data.paint?.customerCar.id,
        plateNumber: paintQuery.data.paint?.customerCar.plateNumber,
        model: paintQuery.data.paint?.customerCar.model,
        make: paintQuery.data.paint?.customerCar.make,
        status: paintQuery.data.paint?.status,
          paints: paintQuery.data.paint?.paints.map((p) => ({
              ...p,
              total: p.quantity * p.price,
          })),
        payments: paintQuery.data.paint?.payments.map((p) => {
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
  }, [editMode, viewMode, form, paintQuery.data]);

  return { paintQuery, editMode, viewMode };
}
