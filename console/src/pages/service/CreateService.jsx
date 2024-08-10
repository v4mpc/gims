import { Button, Divider, Flex, Form, Space } from "antd";

import ServiceSection from "../../components/ServiceSection.jsx";
import SpareSection from "../../components/SpareSection.jsx";
import CustomerSection from "../../components/CustomerSection.jsx";
import PaymentMethodSection from "../../components/PaymentMethodSection.jsx";
import PaymentSection from "../../components/PaymentSection.jsx";
import {
    API_ROUTES, DATE_FORMAT,
    DEFAULT_PAGE_SIZE,
    getLookupData,
    openNotification,
    putItem,
    serviceGrandTotal,
} from "../../utils.jsx";
import { useNavigate, useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { StatusTag } from "../../components/StatusTag.jsx";

const CreateService = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const { id } = useParams();
  const [saveOnlyValidations, setSaveOnlyValidation] = useState(true);
  const queryClient = useQueryClient();
  const [sparefields, setSparefields] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payViaInsurance, setPayViaInsurance] = useState(false);

  const editMode = id !== undefined;

  const results = useQueries({
    queries: [
      {
        queryKey: ["paymentCatalogAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.paymentCatalogAll),
      },

      {
        queryKey: ["singleService", id],
        placeholderData: [],
          staleTime: 1000 * 60 * 20,
          enabled: editMode,
        queryFn: () => getLookupData(`${API_ROUTES.services}/${id}`),
      },
    ],
  });
  const [paymentCatalogQuery, serviceQuery] = results;

  let editValues = {
    initialPayment: 0,
    finalPayment: 0,
    grandTotal: 0,
    status: "DRAFT",
  };



    useEffect(() => {
    if (editMode && !serQuery.isLoading) {
        const grandTotal = serviceQuery.data.service?.services.reduce(
            (acc, cr) => acc + cr.quantity * cr.price,
            0,
        );
        const [selectedPayment] = paymentCatalogQuery.data.filter(
            (pc) => pc.id === serviceQuery.data.service?.paymentMethod.id,
        );
        setSelectedPayment(selectedPayment);
        setPayViaInsurance(serviceQuery.data.service?.payViaInsurance);
        form.setFieldsValue({
            customerName: serviceQuery.data.customerName,
            customerPhone: serviceQuery.data.customerPhone,
            customerCar: serviceQuery.data.service?.customerCar.id,
            plateNumber: serviceQuery.data.service?.customerCar.plateNumber,
            model: serviceQuery.data.service?.customerCar.model,
            make: serviceQuery.data.service?.customerCar.make,
            initialPayment: serviceQuery.data.service?.initialPayment,
            services: serviceQuery.data.service?.services.map((p) => ({
                ...p,
                total: p.quantity * p.price,
            })),
            initialPaymentDate:
                serviceQuery.data.service?.initialPaymentDate !== null
                    ? dayjs(serviceQuery.data.service?.initialPaymentDate, DATE_FORMAT)
                    : null,
            finalPaymentDate:
                serviceQuery.data.service?.finalPaymentDate !== null
                    ? dayjs(serviceQuery.data.service?.finalPaymentDate, DATE_FORMAT)
                    : null,
            finalPayment: serviceQuery.data.service?.finalPayment,

            paymentMethod: serviceQuery.data.service?.paymentMethod.id,
            status: serviceQuery.data.service?.status,
            grandTotal: grandTotal,
            insuranceName: serviceQuery.data.service?.insuranceName,
            payViaInsurance: serviceQuery.data.service?.payViaInsurance,
            accountNumber: serviceQuery.data.service?.paymentMethod.accountNumber,
            accountName: serviceQuery.data.service?.paymentMethod.accountName,
        });
    }
}, [serviceQuery, form, editMode, paymentCatalogQuery.data]);








  const { mutate: createItem, isLoading: isCreating } = useMutation({
    mutationFn: putItem,
    onSuccess: () => {
      form?.resetFields();
      navigate(`/service?page=1&size=${DEFAULT_PAGE_SIZE}`);
      openNotification(
        "post-success",
        "success",
        "Success",
        "Record save successfully",
      );
      queryClient.invalidateQueries("services");
    },
    onError: (error) => {
      console.log("there was an error " + error);
    },
  });

  const { mutate: updateItem, isLoading: isEditing } = useMutation({
    mutationFn: putItem,
    onSuccess: () => {
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
    },
    onError: (error) => {
      console.log("there was an error " + error);
    },
  });



  
  
  
  
  
  
  
  
  
  
  const onValueChanged = (_, _) => {
    // console.log(changed,all)
    form.setFieldsValue({
      grandTotal: serviceGrandTotal(form, fields, sparefields),
    });
  };

  const saveForLater = () => {
    setSaveOnlyValidation(true);

    form.setFields([
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

      {
        name: "selectedService",
        errors: [],
      },
    ]);

    form.setFields(
      fields.flatMap((f) => [
        { name: `itemName_${f.key}`, errors: [] },
        { name: `price_${f.key}`, errors: [] },
        { name: `quantity_${f.key}`, errors: [] },
      ]),
    );

    form.setFields(
      sparefields.flatMap((f) => [
        { name: `itemName_${f.key}`, errors: [] },
        { name: `price_${f.key}`, errors: [] },
        { name: `quantity_${f.key}`, errors: [] },
        { name: `currentKm_${f.key}`, errors: [] },
        { name: `nextKm_${f.key}`, errors: [] },
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
              urlPath: API_ROUTES.services,
              method: "POST",
            };
            createItem(data);
          } else {
            const updatedValues = { ...values, status: status };
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
            console.log(editMode);
          if (!editMode) {
              const updatedValues = { ...values, status: "PAID" };
              const data = {
                  values: updatedValues,
                  urlPath: API_ROUTES.services,
                  method: "POST",
              };

              console.log(data);
              createItem(data);
          } else {
              const updatedValues = { ...values, status: "PAID" };
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

  return (
    <Form
      key="serviceForm"
      variant="outlined"
      form={form}
      initialValues={editValues}
      onValuesChange={onValueChanged}
      layout="vertical"
      autoComplete="off"
    >
      <Flex justify="flex-end">
        <StatusTag status={form?.getFieldValue("status")} />
      </Flex>
      <Divider orientation="left" plain>
        Customer
      </Divider>
      <CustomerSection form={form} />

      <Divider orientation="left" plain>
        Services
      </Divider>

      <ServiceSection
        form={form}
        saveOnlyValidations={saveOnlyValidations}
        editMode={editMode}
        fields={fields}
        setFields={setFields}
      />

      <Divider orientation="left" plain>
        Spares
      </Divider>

      <SpareSection
        form={form}
        saveOnlyValidations={saveOnlyValidations}
        setSparefields={setSparefields}
        sparefields={sparefields}
      />
      <Divider orientation="left" plain>
        Payments
      </Divider>
      <PaymentSection saveOnlyValidations={saveOnlyValidations} />

      <Divider orientation="left" plain>
        Payment method
      </Divider>

      <PaymentMethodSection
        onPaymentChanged={onPaymentChanged}
        selectedPayment={selectedPayment}
        paymentCatalogQuery={paymentCatalogQuery}
        onPayViaInsuranceChanged={onPayViaInsuranceChanged}
        payViaInsurance={payViaInsurance}
      />

      <Divider orientation="left" plain />

      <Flex justify="space-between">
        <Space>
          <Button
            htmlType="button"
            onClick={() => navigate(`/service?page=1&size=${DEFAULT_PAGE_SIZE}`)}
          >
            Cancel
          </Button>

          <Button htmlType="button" onClick={form.resetFields}>
            Reset
          </Button>
        </Space>
        <Space>
          {/*<Button type="dashed" onClick={finalize} htmlType="button">*/}
          {/*    Print invoice*/}
          {/*</Button>*/}

          <Button type="primary" onClick={saveForLater} htmlType="button">
            Save for later
          </Button>

          <Button type="primary"  onClick={finalize}>
            Finalize
          </Button>
        </Space>
      </Flex>
    </Form>
  );
};

export default CreateService;
