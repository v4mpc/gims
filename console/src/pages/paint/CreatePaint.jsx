import {
  Button,
  Divider,
  Flex,
  Form,
  Space,
} from "antd";
import {
  API_ROUTES,
  DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  getLookupData,
  openNotification,
  putItem,
  toCustomerCars,

} from "../../utils.jsx";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { StatusTag } from "../../components/StatusTag.jsx";
import CustomerSection from "../../components/CustomerSection.jsx";
import ListSection from "../../components/ListSection.jsx";
import PaymentSection from "../../components/PaymentSection.jsx";
import PaymentMethodSection from "../../components/PaymentMethodSection.jsx";
import CollapseSection from "../../components/CollapseSection.jsx";

const CreatePaint = () => {
  const [form] = Form.useForm();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payViaInsurance, setPayViaInsurance] = useState(false);
  const [saveOnlyValidations, setSaveOnlyValidation] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const editMode = id !== undefined;

  const results = useQueries({
    queries: [
      {
        queryKey: ["customerAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.customersAll),
      },

      {
        queryKey: ["paymentCatalogAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.paymentCatalogAll),
      },

      {
        queryKey: ["singlePaint", id],
        placeholderData: [],
        enabled: editMode,
        queryFn: () => getLookupData(`${API_ROUTES.paints}/${id}`),
      },
    ],
  });
  const [customerQuery, paymentCatalogQuery, paintQuery] = results;
  const customers = toCustomerCars(customerQuery.data);

  let editValues = {
    initialPayment: 0,
    finalPayment: 0,
    grandTotal: 0,
    netProfit: 0,
    status: "DRAFT",
  };

  useEffect(() => {
    if (editMode && !paintQuery.isLoading) {
      const grandTotal = paintQuery.data.paint?.paints.reduce(
        (acc, cr) => acc + cr.quantity * cr.price,
        0,
      );
      const [selectedPayment] = paymentCatalogQuery.data.filter(
        (pc) => pc.id === paintQuery.data.paint?.paymentMethod.id,
      );
      setSelectedPayment(selectedPayment);
      setPayViaInsurance(paintQuery.data.paint?.payViaInsurance);
      form.setFieldsValue({
        customerName: paintQuery.data.customerName,
        customerPhone: paintQuery.data.customerPhone,
        customerCar: paintQuery.data.paint?.customerCar.id,
        plateNumber: paintQuery.data.paint?.customerCar.plateNumber,
        model: paintQuery.data.paint?.customerCar.model,
        make: paintQuery.data.paint?.customerCar.make,
        initialPayment: paintQuery.data.paint?.initialPayment,
        paints: paintQuery.data.paint?.paints.map((p) => ({
          ...p,
          total: p.quantity * p.price,
        })),
        initialPaymentDate:
          paintQuery.data.paint?.initialPaymentDate !== null
            ? dayjs(paintQuery.data.paint?.initialPaymentDate, DATE_FORMAT)
            : null,
        finalPaymentDate:
          paintQuery.data.paint?.finalPaymentDate !== null
            ? dayjs(paintQuery.data.paint?.finalPaymentDate, DATE_FORMAT)
            : null,
        finalPayment: paintQuery.data.paint?.finalPayment,
        estimateAmount: paintQuery.data.paint?.estimateAmount,
        paymentMethod: paintQuery.data.paint?.paymentMethod.id,
        status: paintQuery.data.paint?.status,
        grandTotal: grandTotal,
        netProfit: paintQuery.data.paint?.estimateAmount - grandTotal,
        insuranceName: paintQuery.data.paint?.insuranceName,
        payViaInsurance: paintQuery.data.paint?.payViaInsurance,
        accountNumber: paintQuery.data.paint?.paymentMethod.accountNumber,
        accountName: paintQuery.data.paint?.paymentMethod.accountName,
      });
    }
  }, [paintQuery, form, editMode, paymentCatalogQuery.data]);

  const { mutate: createItem, isLoading: isCreating } = useMutation({
    mutationFn: putItem,
    onSuccess: () => {
      form?.resetFields();
      navigate(`/paint?page=1&size=${DEFAULT_PAGE_SIZE}`);
      openNotification(
        "post-success",
        "success",
        "Success",
        "Record save successfully",
      );
      queryClient.invalidateQueries("paints");
    },
    onError: (error) => {
      console.log("there was an error " + error);
    },
  });

  const { mutate: updateItem, isLoading: isEditing } = useMutation({
    mutationFn: putItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["singlePaint", id] });
      queryClient.invalidateQueries("paints");

      form?.resetFields();
      navigate(`/paint?page=1&size=${DEFAULT_PAGE_SIZE}`);
      openNotification(
        "post-success",
        "success",
        "Success",
        "Record updated successfully",
      );
    },
    onError: (error) => {
      console.log("there was an error " + error);
    },
  });

  const onSelectChange = (value) => {
    const [filteredCustomer] = customers.filter(
      (c) => Number(c.id) === Number(value),
    );
    form.setFieldsValue({
      customerName: filteredCustomer.customerName,
      customerPhone: filteredCustomer.customerPhone,
      plateNumber: filteredCustomer.plateNumber,
      make: filteredCustomer.make,
      model: filteredCustomer.model,
    });
  };

  const onPriceChange = (e, key) => {
    const _paints = form.getFieldValue("paints");

    if (_paints[key].quantity) {
      form.setFieldsValue({
        paints: _paints.map((s, index) =>
          index === key
            ? {
                ...s,
                total: e * _paints[key].quantity,
              }
            : s,
        ),
      });
    }
  };

  const onQuantityChange = (e, key) => {
    const _paints = form.getFieldValue("paints");
    if (_paints[key].price) {
      form.setFieldsValue({
        paints: _paints.map((s, index) =>
          index === key
            ? {
                ...s,
                total: e * _paints[key].price,
              }
            : s,
        ),
      });
    }
  };

  const onPaymentChanged = (paymentId) => {
    const [selectedPayment] = paymentCatalogQuery.data.filter(
      (pc) => pc.id === paymentId,
    );
    setSelectedPayment(selectedPayment);

    if (selectedPayment.accountNumber !== null) {
      form.setFieldsValue({
        accountNumber: selectedPayment.accountNumber,
      });
    }
  };

  const onPayViaInsuranceChanged = (e) => {
    setPayViaInsurance(e.target.checked);
  };

  const onValuesChanged = (changedValues, allValues) => {
    if (allValues.estimateAmount != null) {
      form.setFieldsValue({
        //   TODO; there some errors in calculating netprofit
        netProfit: allValues.estimateAmount - allValues.grandTotal,
      });
    }

    if (Object.hasOwn(changedValues, "paints")) {
      const totalQuantity = allValues.paints.reduce(
        (accumulator, currentValue) => {
          return (
            accumulator +
            (currentValue?.quantity ?? 0) * (currentValue?.price ?? 0)
          );
        },
        0,
      );
      form.setFieldsValue({
        grandTotal: isNaN(totalQuantity) ? 0 : totalQuantity,
      });
    }
  };

  const saveForLater = () => {
    setSaveOnlyValidation(true);

    form.setFields([
      {
        name: "paints",
        errors: [], // Clear any existing errors
      },
      {
        name: "initialPayment",
        errors: [],
      },

      {
        name: "initialPaymentDate",
        errors: [],
      },

      {
        name: "finalPaymentDate",
        errors: [],
      },
    ]);

    const fields = form.getFieldValue("paints") || [];
    // TODO understand flatmap
    form.setFields(
      fields.flatMap((_, index) => [
        { name: ["paints", index, "item"], errors: [] },
        { name: ["paints", index, "price"], errors: [] },
        { name: ["paints", index, "quantity"], errors: [] },
      ]),
    );

    setTimeout(() => {
      form
        .validateFields()
        .then((values) => {
          let status = "DRAFT";
          const { estimateAmount, initialPayment, finalPayment } = values;
          if (initialPayment + finalPayment < estimateAmount) {
            status = "PARTIALLY_PAID";
          }
          if (initialPayment + finalPayment === 0) {
            status = "UNPAID";
          }

          if (!editMode) {
            const updatedValues = { ...values, status: status };
            const data = {
              values: updatedValues,
              urlPath: API_ROUTES.paints,
              method: "POST",
            };
            createItem(data);
          } else {
            const updatedValues = { ...values, status: status };
            const data = {
              values: updatedValues,
              urlPath: `${API_ROUTES.paints}/${id}`,
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

  const finalize = async () => {
    setSaveOnlyValidation(false);

    setTimeout(() => {
      form
        .validateFields()
        .then((values) => {
          if (!editMode) {
            const updatedValues = { ...values, status: "PAID" };
            const data = {
              values: updatedValues,
              urlPath: API_ROUTES.paints,
              method: "POST",
            };
            createItem(data);
          } else {
            const updatedValues = { ...values, status: "PAID" };
            const data = {
              values: updatedValues,
              urlPath: `${API_ROUTES.paints}/${id}`,
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

  return (
    <Form
      key="serviceForm"
      variant="outlined"
      form={form}
      layout="vertical"
      initialValues={editValues}
      autoComplete="off"
      onValuesChange={onValuesChanged}
    >
      <Flex justify="flex-end">
        <StatusTag status={form.getFieldValue("status")} />
      </Flex>
      <Divider orientation="left" plain>
        Customer car
      </Divider>

      <CustomerSection
        customerQuery={customerQuery}
        onCustomerVehicleChanged={onSelectChange}
      />

      <Divider orientation="left" plain>
        Items
      </Divider>

     <ListSection saveOnlyValidations={saveOnlyValidations} onPriceChange={onPriceChange} onQuantityChange={onQuantityChange}/>

        <CollapseSection/>
      <Divider orientation="left" plain>
        Payments
      </Divider>
        <PaymentSection saveOnlyValidations={saveOnlyValidations}/>
      <Divider orientation="left" plain>
        Payment method
      </Divider>

      <PaymentMethodSection onPaymentChanged={onPaymentChanged} selectedPayment={selectedPayment} paymentCatalogQuery={paymentCatalogQuery} onPayViaInsuranceChanged={onPayViaInsuranceChanged} payViaInsurance={payViaInsurance}/>
      <Divider orientation="left" plain />

      <Flex justify="space-between">
        <Space>
          <Button
            htmlType="button"
            onClick={() => navigate(`/paint?page=1&size=${DEFAULT_PAGE_SIZE}`)}
          >
            Cancel
          </Button>

          <Button htmlType="button" onClick={form.resetFields}>
            Reset
          </Button>
        </Space>
        <Space>
          <Button type="dashed" onClick={finalize} htmlType="button">
            Print invoice
          </Button>

          <Button type="primary" onClick={saveForLater} htmlType="button">
            Save for later
          </Button>

          <Button type="primary" htmlType="button" onClick={finalize}>
            Finalize
          </Button>
        </Space>
      </Flex>
    </Form>
  );
};
export default CreatePaint;
