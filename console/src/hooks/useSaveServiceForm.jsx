import { API_ROUTES, BASE_URL, openNotification } from "../utils.jsx";
import { useServiceMutation } from "./useServiceMutation.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import createPaint from "../pages/paint/CreatePaint.jsx";

export function useSaveServiceForm(form, id, editMode) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function createItemSuccessCallBack(jsonResponse) {
    navigate(`/service/${jsonResponse.data}/edit`);
    openNotification(
      "post-success",
      "success",
      "Success",
      "Record save successfully",
    );
    queryClient.invalidateQueries("services");
  }

  function createPaintItemSuccessCallBack(jsonResponse) {
    navigate(`/paint/${jsonResponse.data}/edit`);
    openNotification(
      "post-success",
      "success",
      "Success",
      "Record save successfully",
    );
    queryClient.invalidateQueries("paints");
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

  function updateItemSuccessCallBack() {
    queryClient.invalidateQueries({ queryKey: ["singleService", id] });
    queryClient.invalidateQueries("services");
    openNotification(
      "post-success",
      "success",
      "Success",
      "Record updated successfully",
    );
  }

  function updatePaintItemSuccessCallBack() {
    queryClient.invalidateQueries({ queryKey: ["singlePaint", id] });
    queryClient.invalidateQueries("paints");
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

  const { mutate: createPaintItem } = useServiceMutation({
    successCallBack: createPaintItemSuccessCallBack,
  });

  // const { mutate: createFinalize } = useServiceMutation({
  //   successCallBack: createItemSuccessCallBack,
  // });

  const { mutate: editPrintMutation } = useServiceMutation({
    successCallBack: editPrintSuccessCallBack,
  });

  const { mutate: createPrintMutation } = useServiceMutation({
    successCallBack: createPrintSuccessCallBack,
  });

  const { mutate: updateItem } = useServiceMutation({
    successCallBack: updateItemSuccessCallBack,
  });

  const { mutate: updatePaintItem } = useServiceMutation({
    successCallBack: updatePaintItemSuccessCallBack,
  });

  function createPayload(values, url, httpMethod, status = "DRAFT") {
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

  function createPaintPayload(values, url, httpMethod, status = "DRAFT") {
    const updatedValues = {
      ...values,
      status: status,
    };
    return {
      values: updatedValues,
      urlPath: url,
      method: httpMethod,
    };
  }

  const saveAndPrint = async () => {
    try {
      const values = await form.validateFields();
      if (
        (!values.services || values.services.length === 0) &&
        (!values.spares || values.spares.length === 0)
      ) {
        openNotification(
          "service-form-error",
          "error",
          "Error",
          "At least one service/spare is required",
        );
        throw new Error("Validation errors found");
      }

      if (!editMode) {
        const data = createPayload(values, API_ROUTES.services, "POST");
        createPrintMutation(data);
      } else {
        const data = createPayload(
          values,
          `${API_ROUTES.services}/${id}`,
          "PUT",
          values.status,
        );

        console.log(values);

        editPrintMutation(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const savePaintForLater = async () => {
    try {
      const values = await form.validateFields();
      if (!editMode) {
        const data = createPaintPayload(values, API_ROUTES.paints, "POST");
        createPaintItem(data);
      } else {
        const data = createPaintPayload(
          values,
          `${API_ROUTES.paints}/${id}`,
          "PUT",
        );
        updatePaintItem(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveForLater = async () => {
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

  const finalizePaint = async () => {
    try {
      const values = await form.validateFields();
      if (!values.paints || values.paints.length === 0) {
        form.setFields([
          {
            name: "paints",
            errors: ["At least one item  is required"],
          },
        ]);
        throw new Error("paint atleast one Validation errors found");
      } else {
        form.setFields([
          {
            name: "paints",
            errors: [],
          },
        ]);
      }

      const paintTotal = values.paints.reduce(
        (acc, curr) =>
          Number(acc) + Number(curr?.quantity ?? 0) * Number(curr?.price ?? 0),
        0,
      );

      if (
        !values.payments ||
        values.payments.length === 0 ||
        (values.payments &&
          values.payments.length > 0 &&
          values.payments.reduce((acc, curr) => acc + curr.amount, 0) <
            paintTotal &&
          !values.includeEstimateAmount)
      ) {
        form.setFields([
          {
            name: "payments",
            errors: [
              "To Finalize, Payments must be greater or equal to Total cost",
            ],
          },
        ]);
        throw new Error("payments Validation errors found");
      } else if (
        !values.payments ||
        values.payments.length === 0 ||
        (values.payments &&
          values.payments.length > 0 &&
          values.includeEstimateAmount &&
          values.payments.reduce((acc, curr) => acc + curr.amount, 0) <
            (values.estimateAmount ?? 0))
      ) {
        form.setFields([
          {
            name: "payments",
            errors: [
              "To Finalize, Payments must be greater or equal to Estimate cost",
            ],
          },
        ]);
        throw new Error("payments Validation errors found");
      } else {
        form.setFields([
          {
            name: "payments",
            errors: [],
          },
        ]);
      }

      if (!editMode) {
        const data = createPaintPayload(
          values,
          API_ROUTES.paints,
          "POST",
          "FINALIZED",
        );
        createPaintItem(data);
      } else {
        const data = createPaintPayload(
          values,
          `${API_ROUTES.paints}/${id}`,
          "PUT",
          "FINALIZED",
        );
        updatePaintItem(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const finalize = async () => {
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
        throw new Error("service/spare atleast one Validation errors found");
      } else {
        form.setFields([
          {
            name: "services",
            errors: [],
          },
        ]);
      }

      const serviceTotal = values.services.reduce(
        (acc, curr) =>
          Number(acc) + Number(curr?.quantity ?? 0) * Number(curr?.price ?? 0),
        0,
      );
      const spareTotal =
        values.spares.reduce(
          (acc, curr) =>
            Number(acc) +
            Number(curr?.quantity ?? 0) * Number(curr?.price ?? 0),
          0,
        ) ?? 0;

      if (
        !values.payments ||
        values.payments.length === 0 ||
        (values.payments &&
          values.payments.length > 0 &&
          values.payments.reduce((acc, curr) => acc + curr.amount, 0) <
            spareTotal + serviceTotal)
      ) {
        form.setFields([
          {
            name: "payments",
            errors: [
              "To Finalize, Payments must be greater or equal to Service and Spare cost",
            ],
          },
        ]);
        throw new Error("payments Validation errors found");
      } else {
        form.setFields([
          {
            name: "payments",
            errors: [],
          },
        ]);
      }

      if (!editMode) {
        const data = createPayload(
          values,
          API_ROUTES.services,
          "POST",
          "FINALIZED",
        );
        createItem(data);
      } else {
        const data = createPayload(
          values,
          `${API_ROUTES.services}/${id}`,
          "PUT",
          "FINALIZED",
        );
        updateItem(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    saveForLater,
    editPrint: saveAndPrint,
    finalize,
    savePaintForLater,
    finalizePaint,
  };
}
