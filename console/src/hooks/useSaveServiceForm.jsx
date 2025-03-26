import { useState } from "react";
import {
  API_ROUTES,
  BASE_URL,
  DEFAULT_PAGE_SIZE,
  openNotification,
} from "../utils.jsx";
import { useServiceMutation } from "./useServiceMutation.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useSaveServiceForm(form, id, editMode) {
  const [saveOnlyValidations, setSaveOnlyValidation] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function createItemSuccessCallBack() {
    form?.resetFields();
    navigate(`/service?page=1&size=${DEFAULT_PAGE_SIZE}`);
    openNotification(
      "post-success",
      "success",
      "Success",
      "Record save successfully",
    );
    queryClient.invalidateQueries("services");
  }

  function editPrintSuccessCallBack(jsonResponse) {
    window.open(
      `${BASE_URL}/${API_ROUTES.exportInvoice}/GARAGE_SERVICE/${jsonResponse.data}`,
      "_blank",
    );
  }

  function createPrintSuccessCallBack(jsonResponse) {
    navigate(`/service/${jsonResponse.data}/edit`);
    window.open(
      `${BASE_URL}/${API_ROUTES.exportInvoice}/GARAGE_SERVICE/${jsonResponse.data}`,
      "_blank",
    );
  }

  function updateItemSuccessCallBack(jsonResponse) {
    queryClient.invalidateQueries({ queryKey: ["singleService", id] });
    queryClient.invalidateQueries("services");
    form?.resetFields();
    navigate(`/service?page=1&size=${DEFAULT_PAGE_SIZE}`);
    openNotification(
      "post-success",
      "success",
      "Success",
      "Record updated successfully",
    );
  }

  const { mutate: createItem } = useServiceMutation({
    successCallBack: createItemSuccessCallBack,
  });

  const { mutate: editPrintMutation } = useServiceMutation({
    successCallBack: editPrintSuccessCallBack,
  });

  const { mutate: createPrintMutation } = useServiceMutation({
    successCallBack: createPrintSuccessCallBack,
  });

  const { mutate: updateItem } = useServiceMutation({
    successCallBack: updateItemSuccessCallBack,
  });

  function createPayload(values, url, httpMethod) {
    const status = "DRAFT";
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

    const updatedValues = {
      ...values,
      services: _services,
      spares: _spares,
      status: status,
    };
    return {
      values: updatedValues,
      urlPath: url,
      method: httpMethod,
    };
  }

  const editPrint = async () => {
    const errors = [];

    try {
      const values = await form.validateFields();
      if (
        (!values.services || values.services.length === 0) &&
        (!values.spares || values.spares.length === 0)
      ) {
        form.setFields([
          {
            name: "services",
            errors: ["At least one service/spare is required"],
          },
        ]);
        throw new Error("Validation errors found");
      } else {
        form.setFields([
          {
            name: "services",
            errors: [],
          },
        ]);
      }

      if (!editMode) {
        const data = createPayload(values, API_ROUTES.services, "POST");
        createPrintMutation(data);
      } else {
        const data = createPayload(
          values,
          `${API_ROUTES.services}/${id}`,
          "PUT",
        );
        editPrintMutation(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveForLater = async () => {
    setSaveOnlyValidation(true);
    form.setFields([
      {
        name: "selectedService",
        errors: [],
      },
    ]);

    try {
      const values = await form.validateFields();
      if (!editMode) {
        const data = createPayload(values, API_ROUTES.services, "POST");
        createItem(data);
      } else {
        const data = createPayload(
          values,
          `${API_ROUTES.services}/${id}`,
          "PUT",
        );
        updateItem(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // const finalize = () => {
  //   setSaveOnlyValidation(false);
  //   setTimeout(() => {
  //     form
  //       .validateFields()
  //       .then((values) => {
  //         const { servicesList, spareList } = toModelList(
  //           form,
  //           fields,
  //           spareFields,
  //         );
  //         if (!editMode) {
  //           const updatedValues = {
  //             ...values,
  //             services: servicesList,
  //             spares: spareList,
  //             status: "PAID",
  //           };
  //           const data = {
  //             values: updatedValues,
  //             urlPath: API_ROUTES.services,
  //             method: "POST",
  //           };
  //
  //           createItem(data);
  //         } else {
  //           const updatedValues = {
  //             ...values,
  //             services: servicesList,
  //             spares: spareList,
  //             status: "PAID",
  //           };
  //           const data = {
  //             values: updatedValues,
  //             urlPath: `${API_ROUTES.services}/${id}`,
  //             method: "PUT",
  //           };
  //           updateItem(data);
  //         }
  //         console.log("Form values:", values);
  //       })
  //       .catch((errorInfo) => {
  //         console.error("Validation failed:", errorInfo);
  //       });
  //   }, 0);
  // };

  return { saveOnlyValidations, saveForLater, editPrint };
}
