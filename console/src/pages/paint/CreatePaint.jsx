import { useNavigate } from "react-router-dom";
import { Button, Divider, Flex, Form, Space } from "antd";
import { API_ROUTES, DEFAULT_PAGE_SIZE } from "../../utils.jsx";

import { StatusTag } from "../../components/StatusTag.jsx";
import CustomerSection from "../../components/CustomerSection.jsx";
import ListSection from "../../components/ListSection.jsx";
import PaymentSection from "../../components/PaymentSection.jsx";
import PaymentMethodSection from "../../components/PaymentMethodSection.jsx";
import CollapseSection from "../../components/CollapseSection.jsx";
import useService from "../../hooks/useService.jsx";

const CreatePaint = () => {
  const navigate = useNavigate();
  const {
    form,
    paymentCatalogQuery,
    setSelectedPayment,
    setSaveOnlyValidation,
    setPayViaInsurance,
    editMode,
    createItem,
    editValues,
    updateItem,
    payViaInsurance,
    saveOnlyValidations,
    selectedPayment,
    id,
  } = useService();
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
      <CustomerSection form={form} />
      <Divider orientation="left" plain>
        Items
      </Divider>

      <ListSection
        saveOnlyValidations={saveOnlyValidations}
        onPriceChange={onPriceChange}
        onQuantityChange={onQuantityChange}
      />

      <CollapseSection />
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
