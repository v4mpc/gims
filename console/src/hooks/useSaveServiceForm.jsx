import { useState } from "react";
import { API_ROUTES, toModelList } from "../utils.jsx";
import { useServiceMutation } from "./useServiceMutation.jsx";

export default function useSaveServiceForm(form, id,editMode) {
  const [saveOnlyValidations, setSaveOnlyValidation] = useState(true);
  const { mutation: createItem } = useServiceMutation({});
  const { mutation: updateItem } = useServiceMutation({});

  const saveForLater = () => {
    setSaveOnlyValidation(true);
    form.setFields([
      {
        name: "selectedService",
        errors: [],
      },
    ]);

    setTimeout(() => {
      form
        .validateFields()
        .then((values) => {
          let status = "DRAFT";
          const { totals } = values;
          const [totalCost, totalPaid] = totals;
          if (totalPaid < totalCost) {
            status = "PARTIALLY_PAID";
          }
          if (totalPaid === 0) {
            status = "UNPAID";
          }

          const { services, spares } = values;
          const _services = services.map((s) => ({
            item: s.item,
            price: s.price,
            quantity: s.quantity,
          }));

          const _spares = spares.map((s) => ({
            itemId: s.itemId,
            item: s.item,
            price: s.price,
            unit: s.unit,
            quantity: s.quantity,
            currentKm: s.currentKm,
            nextKm: s.nextKm,
          }));

          if (!editMode) {
            const updatedValues = {
              ...values,
              services: _services,
              spares: _spares,
              status: status,
            };
            const data = {
              values: updatedValues,
              urlPath: API_ROUTES.services,
              method: "POST",
            };
            createItem(data);
          } else {
            const updatedValues = {
              ...values,
              services: _services,
              spares: _spares,
              status: status,
            };
            const data = {
              values: updatedValues,
              urlPath: `${API_ROUTES.services}/${id}`,
              method: "PUT",
            };
            updateItem(data);
          }
        })
        .catch((errorInfo) => {
          console.error("Validation failed:", errorInfo);
        });
    }, 0);
  };

  const finalize = () => {
    setSaveOnlyValidation(false);
    setTimeout(() => {
      form
        .validateFields()
        .then((values) => {
          const { servicesList, spareList } = toModelList(
            form,
            fields,
            spareFields,
          );
          if (!editMode) {
            const updatedValues = {
              ...values,
              services: servicesList,
              spares: spareList,
              status: "PAID",
            };
            const data = {
              values: updatedValues,
              urlPath: API_ROUTES.services,
              method: "POST",
            };

            createItem(data);
          } else {
            const updatedValues = {
              ...values,
              services: servicesList,
              spares: spareList,
              status: "PAID",
            };
            const data = {
              values: updatedValues,
              urlPath: `${API_ROUTES.services}/${id}`,
              method: "PUT",
            };
            updateItem(data);
          }
          console.log("Form values:", values);
        })
        .catch((errorInfo) => {
          console.error("Validation failed:", errorInfo);
        });
    }, 0);
  };

  return { saveOnlyValidations, saveForLater, finalize };
}
