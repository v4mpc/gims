import { Button, Divider, Flex, Form, Space, Tooltip } from "antd";

import ServiceSection from "../../components/ServiceSection.jsx";
import SpareSection from "../../components/SpareSection.jsx";
import CustomerSection from "../../components/CustomerSection.jsx";
import PaymentSection from "../../components/PaymentSection.jsx";
import {
  API_ROUTES,
  DEFAULT_PAGE_SIZE,
  getLookupData,
  toModelList,
  openNotification,
  putItem,
  updateTotalCost,
} from "../../utils.jsx";

import styles from "../../components/CustomForm.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { StatusTag } from "../../components/StatusTag.jsx";
import PrintButtons from "../../components/PrintButtons.jsx";

const CreateService = () => {
  const [form] = Form.useForm();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const { id } = useParams();
  const [saveOnlyValidations, setSaveOnlyValidation] = useState(true);
  const queryClient = useQueryClient();
  const [spareFields, setSpareFields] = useState([]);
  const editMode = pathname.toLowerCase().endsWith("edit") && id !== undefined;
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
    ],
  });
  const [
    paymentCatalogQuery,
    serviceQuery,
  ] = results;

  useEffect(() => {
    form.setFieldsValue({
      spares: [],
      payments: [],
      services: [],
      status: "DRAFT",
    });
  }, []);

  useEffect(() => {
    if (
      editMode &&
      serviceQuery.data &&
      paymentCatalogQuery.data
    ) {



      form.setFieldsValue({
        customerName: serviceQuery.data.customerName,
        customerPhone: serviceQuery.data.customerPhone,
        customerCar: serviceQuery.data.service?.customerCar.id,
        plateNumber: serviceQuery.data.service?.customerCar.plateNumber,
        model: serviceQuery.data.service?.customerCar.model,
        make: serviceQuery.data.service?.customerCar.make,
        status: serviceQuery.data.service?.status,
      });

    }
  }, [
    editMode,
    serviceQuery.data,
    paymentCatalogQuery.data,
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

    if (Object.hasOwn(changed, "services")) {
      form.setFieldsValue({
        totals: updateTotalCost(form),
        services: all.services.map((s) => ({
          ...s,
          total: Number(s.quantity) * Number(s.price),
        })),
      });
    }

    if (Object.hasOwn(changed, "spares")) {
      form.setFieldsValue({
        totals: updateTotalCost(form),
        spares: all.spares.map((s) => ({
          ...s,
          total: Number(s.quantity) * Number(s.price),
        })),
      });
    }
  };

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
            console.log(updatedValues);
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
              spares: [],
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
      disabled={viewMode}
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
        serviceQuery={serviceQuery}
        viewMode={viewMode}
        editMode={editMode}
      />

      <Divider orientation="left" plain>
        <Tooltip title="Spare is SpareCode/SpareName/SpareCategory">
          <span>Spares</span>
        </Tooltip>
      </Divider>

      <SpareSection
        saveOnlyValidations={saveOnlyValidations}
        viewMode={viewMode}
        serviceQuery={serviceQuery}
        editMode={editMode}
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
