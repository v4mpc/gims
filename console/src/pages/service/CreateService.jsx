import { Button, Divider, Dropdown, Flex, Form, Skeleton, Space } from "antd";

import ServiceSection from "../../components/ServiceSection.jsx";
import SpareSection from "../../components/SpareSection.jsx";
import CustomerSection from "../../components/CustomerSection.jsx";
import PaymentMethodSection from "../../components/PaymentMethodSection.jsx";
import PaymentSection from "../../components/PaymentSection.jsx";
import {
  API_ROUTES,
  DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  getLookupData,
  toModelList,
  openNotification,
  putItem,
  serviceGrandTotal,
  toFormList,
} from "../../utils.jsx";

import styles from "../../components/CustomForm.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { StatusTag } from "../../components/StatusTag.jsx";
import dayjs from "dayjs";
import PrintButtons from "../../components/PrintButtons.jsx";

const CreateService = () => {
  const [form] = Form.useForm();
  const { pathname } = useLocation();
  const [services, setServices] = useState([]);
  const [spares, setSpares] = useState([]);
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const { id } = useParams();
  const [saveOnlyValidations, setSaveOnlyValidation] = useState(true);
  const queryClient = useQueryClient();
  const [spareFields, setSpareFields] = useState([]);
  const editMode = id !== undefined;
  const viewMode = pathname.toLowerCase().endsWith("view") && id !== undefined;

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

        enabled: editMode,
        queryFn: () => getLookupData(`${API_ROUTES.services}/${id}`),
      },
      {
        queryKey: ["serviceAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.serviceCatalogsAll),
      },

      {
        queryKey: ["spareAll"],

        placeholderData: [],
        queryFn: () =>
          getLookupData(`${API_ROUTES.stockOnhandAll}?nonZeroSoh=false`),
      },
    ],
  });
  const [
    paymentCatalogQuery,
    serviceQuery,
    serviceCatalogQuery,
    spareCatalogQuery,
  ] = results;

  useEffect(() => {
    setServices(serviceCatalogQuery.data);
    setSpares(spareCatalogQuery.data);
  }, [serviceCatalogQuery.data, spareCatalogQuery.data]);

  useEffect(() => {
    form.setFieldsValue({
      initialPayment: 0,
      finalPayment: 0,
      grandTotal: 0,
      status: "DRAFT",
    });
  }, []);

  useEffect(() => {
    if (
      editMode &&
      serviceQuery.data &&
      paymentCatalogQuery.data &&
      spareCatalogQuery.data
    ) {
      const serviceTotal = serviceQuery.data?.service?.services.reduce(
        (acc, cr) => acc + cr.quantity * cr.price,
        0,
      );

      const spareTotal = serviceQuery.data.service?.spares.reduce(
        (acc, cr) => acc + cr.quantity * cr.price,
        0,
      );

      const { serviceValues, spareValues, formSpareFields, formFields } =
        toFormList(
          serviceQuery.data.service?.services ?? [],
          serviceQuery.data.service?.spares ?? [],
          spareCatalogQuery.data,
        );
      //

      const selectedServices = serviceQuery.data.service?.services.map(
        (s) => s.item,
      );

      const selectedSpares = serviceQuery.data.service?.spares.map(
        (s) => s.itemId,
      );

      setFields(formFields);
      setSpareFields(formSpareFields);
      setServices(
        serviceCatalogQuery.data.filter(
          (s) => !selectedServices?.includes(s.name),
        ),
      );

      setSpares(
        spareCatalogQuery.data.filter(
          (s) => !selectedSpares?.includes(s.product.id),
        ),
      );

      const grandTotal = serviceTotal + spareTotal;
      const [selectedPayment] = paymentCatalogQuery.data.filter(
        (pc) => pc.id === serviceQuery.data.service?.paymentMethod.id,
      );
      form.setFieldsValue({
        customerName: serviceQuery.data.customerName,
        customerPhone: serviceQuery.data.customerPhone,
        customerCar: serviceQuery.data.service?.customerCar.id,
        plateNumber: serviceQuery.data.service?.customerCar.plateNumber,
        model: serviceQuery.data.service?.customerCar.model,
        make: serviceQuery.data.service?.customerCar.make,
        initialPayment: serviceQuery.data.service?.initialPayment,
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

      form.setFieldsValue(serviceValues);
      form.setFieldsValue(spareValues);
    }
  }, [
    editMode,
    serviceQuery.data,
    paymentCatalogQuery.data,
    spareCatalogQuery.data,
  ]);

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

  const onValueChanged = (changed, all) => {
      console.log(changed);
    if (Object.hasOwn(changed, "payments")) {
      form.setFieldsValue({
        totals: form.getFieldValue("totals").map((total, key) =>
          key === 1
            ? {
                ...total,
                amount: form
                  .getFieldValue("payments")
                  .reduce(
                    (acc, curr) => Number(acc) + Number(curr?.amount ?? 0),
                    0,
                  ),
              }
            : total,
        ),
      });
    }





    form.setFieldsValue({
      grandTotal: serviceGrandTotal(form, fields, spareFields) ?? 0,
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
      {
        name: "paymentMethod",
        errors: [],
      },
    ]);

    form.setFields(
      spareFields.flatMap((f) => [
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
          const { grandTotal, initialPayment, finalPayment } = values;
          if (initialPayment + finalPayment < grandTotal) {
            status = "PARTIALLY_PAID";
          }
          if (initialPayment + finalPayment === 0) {
            status = "UNPAID";
          }

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
              services: servicesList,
              spares: spareList,
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



  return (
    <Form
      key="serviceForm"
      variant="outlined"
      form={form}
      className={viewMode ? styles.customForm : ""}
      onValuesChange={onValueChanged}
      layout="vertical"
      autoComplete="off"
      disabled={editMode}
    >
      <Flex justify="flex-end">
        <StatusTag status={form?.getFieldValue("status")} />
      </Flex>
      <Divider orientation="left" plain>
        Customer
      </Divider>

      <CustomerSection form={form} viewMode={viewMode} />

      <Divider orientation="left" plain>
        Services
      </Divider>

      <ServiceSection
        saveOnlyValidations={saveOnlyValidations}
        viewMode={viewMode}
      />

      <Divider orientation="left" plain>
        Spare
      </Divider>

      <SpareSection
        form={form}
        saveOnlyValidations={saveOnlyValidations}
        setSparefields={setSpareFields}
        sparefields={spareFields}
        spares={spares}
        setSpares={setSpares}
        spareCatalogQuery={spareCatalogQuery}
        viewMode={viewMode}
      />

      <PaymentSection viewMode={viewMode} />

      <Divider orientation="left" plain />
      <Flex justify="space-between">
        <Space>
          <Button
            disabled={false}
            color="danger"
            variant="solid"
            onClick={() =>
              navigate(`/service?page=1&size=${DEFAULT_PAGE_SIZE}`)
            }
          >
            Cancel
          </Button>

          {viewMode || (
            <Button htmlType="button" onClick={form.resetFields}>
              Reset
            </Button>
          )}
        </Space>
        <Space>
          {viewMode && (
            <PrintButtons
              primaryKey={id}
              printable={["TAX", "PROFORMA"]}
              invoiceSource="GARAGE_SERVICE"
            />
          )}

          {viewMode || (
            <>
              <Button type="primary" onClick={saveForLater} htmlType="button">
                Save for later
              </Button>

              <Button type="primary" onClick={finalize}>
                Finalize
              </Button>
            </>
          )}
        </Space>
      </Flex>
    </Form>
  );
};

export default CreateService;
