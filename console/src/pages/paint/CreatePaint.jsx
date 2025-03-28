import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Form,
  InputNumber,
  Space,
  Switch,
} from "antd";
import {
  DEFAULT_PAGE_SIZE,
  thousanSeparatorformatter,
  thousanSeparatorparser,
  updateTotalCost,
} from "../../utils.jsx";

import { StatusTag } from "../../components/StatusTag.jsx";
import CustomerSection from "../../components/CustomerSection.jsx";
import PaintSection from "../../components/PaintSection.jsx";
import PaymentSection from "../../components/PaymentSection.jsx";
import CollapseSection from "../../components/CollapseSection.jsx";
import styles from "../../components/CustomForm.module.css";
import { usePaintFormPatch } from "../../hooks/usePaintFormPatch.jsx";
import { DownloadOutlined } from "@ant-design/icons";
import PaymentSummary from "../../components/PaymentSummary.jsx";
import ThousandSeparator from "../../components/ThousandSeparator.jsx";
import { useRef, useState } from "react";

const CreatePaint = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { paintQuery, editMode, viewMode } = usePaintFormPatch(form, id);
  const [moreDetails, setMoreDetails] = useState(true);
  const storedEstimatedAmount = useRef(null);
  const paymentsForTotal = Form.useWatch("payments", form) ?? [];
  const paintForTotal = Form.useWatch("paints", form) ?? [];
  const includeEstimateAmount = Form.useWatch("includeEstimateAmount", form);
  const estimateAmount = Form.useWatch("estimateAmount", form)??0;

  const columnsForTotal = [
    {
      dataIndex: "label",
      rowScope: "row",
      key: "label",
      width: "40%",
    },
    {
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => {
        if (record.id === 1) {
          return (
            <Form.Item
              noStyle
              name="estimateAmount"
              rules={[
                {
                  required: true,
                  message: "Missing estimate amount",
                },
              ].filter((_) => includeEstimateAmount)}
            >
              <InputNumber
                disabled={viewMode}
                formatter={thousanSeparatorformatter}
                parser={thousanSeparatorparser}
                style={{ width: "100%" }}
                min={1}
                addonAfter="TZS"
              />
            </Form.Item>
          );
        }
        return (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              <ThousandSeparator value={record.amount} />
            </span>
            <span>TZS</span>
          </div>
        );
      },
    },
  ];

  function updateTotalSummary() {
    const paymentTotal =
      paymentsForTotal.reduce(
        (acc, curr) => Number(acc) + Number(curr?.amount ?? 0),
        0,
      ) ?? 0;
    const paintTotal =
      paintForTotal.reduce(
        (acc, curr) =>
          Number(acc) + Number(curr?.quantity ?? 0) * Number(curr?.price ?? 0),
        0,
      ) ?? 0;

    return [
      { amount: 0, id: 1, label: "Estimated Cost" },
      { amount: paintTotal, id: 2, label: "Total Cost" },
      { amount: paymentTotal, id: 3, label: "Total Paid" },
      {
        amount: Math.max(
          includeEstimateAmount
            ? estimateAmount - paymentTotal
            : paintTotal - paymentTotal,
          0,
        ),
        id: 4,
        label: "Remaining Amount",
      },
      {
        amount: includeEstimateAmount
          ? paymentTotal - estimateAmount
          : 0,
        id: 5,
        label: "Net Profit",
      },
    ].filter(
      (a) =>
        (!moreDetails && (a.id === 2 || a.id === 3)) ||
        moreDetails ||
        (!includeEstimateAmount && a.id === 2) ||
        a.id === 3 ||
        a.id === 4,
    );
  }

  const onValuesChanged = (changed, all) => {
    if (Object.hasOwn(changed, "includeEstimateAmount")) {
      if (!changed.includeEstimateAmount) {
        setMoreDetails(false);
      } else {
        setMoreDetails(true);
      }
    }

    if (Object.hasOwn(changed, "paints")) {
      form.setFieldsValue({
        paints: all.paints.map((p) => ({
          ...p,
          total: Number(p?.quantity ?? 0) * Number(p?.price ?? 0),
        })),
      });
    }
  };

  // const saveForLater = () => {
  //   setSaveOnlyValidation(true);
  //
  //   form.setFields([
  //     {
  //       name: "paints",
  //       errors: [], // Clear any existing errors
  //     },
  //     {
  //       name: "initialPayment",
  //       errors: [],
  //     },
  //
  //     {
  //       name: "initialPaymentDate",
  //       errors: [],
  //     },
  //
  //     {
  //       name: "finalPaymentDate",
  //       errors: [],
  //     },
  //   ]);
  //
  //   const fields = form.getFieldValue("paints") || [];
  //   // TODO understand flatmap
  //   form.setFields(
  //     fields.flatMap((_, index) => [
  //       { name: ["paints", index, "item"], errors: [] },
  //       { name: ["paints", index, "price"], errors: [] },
  //       { name: ["paints", index, "quantity"], errors: [] },
  //     ]),
  //   );
  //
  //   setTimeout(() => {
  //     form
  //       .validateFields()
  //       .then((values) => {
  //         let status = "DRAFT";
  //         const { estimateAmount, initialPayment, finalPayment } = values;
  //         if (initialPayment + finalPayment < estimateAmount) {
  //           status = "PARTIALLY_PAID";
  //         }
  //         if (initialPayment + finalPayment === 0) {
  //           status = "UNPAID";
  //         }
  //
  //         if (!editMode) {
  //           const updatedValues = { ...values, status: status };
  //           const data = {
  //             values: updatedValues,
  //             urlPath: API_ROUTES.paints,
  //             method: "POST",
  //           };
  //           createItem(data);
  //         } else {
  //           const updatedValues = { ...values, status: status };
  //           const data = {
  //             values: updatedValues,
  //             urlPath: `${API_ROUTES.paints}/${id}`,
  //             method: "PUT",
  //           };
  //           updateItem(data);
  //         }
  //       })
  //       .catch((errorInfo) => {
  //         console.error("Validation failed:", errorInfo);
  //       });
  //   }, 0);
  // };
  //
  // const finalize = async () => {
  //   setSaveOnlyValidation(false);
  //
  //   setTimeout(() => {
  //     form
  //       .validateFields()
  //       .then((values) => {
  //         if (!editMode) {
  //           const updatedValues = { ...values, status: "PAID" };
  //           const data = {
  //             values: updatedValues,
  //             urlPath: API_ROUTES.paints,
  //             method: "POST",
  //           };
  //           createItem(data);
  //         } else {
  //           const updatedValues = { ...values, status: "PAID" };
  //           const data = {
  //             values: updatedValues,
  //             urlPath: `${API_ROUTES.paints}/${id}`,
  //             method: "PUT",
  //           };
  //           updateItem(data);
  //         }
  //
  //         console.log("Form values:", values);
  //       })
  //       .catch((errorInfo) => {
  //         console.error("Validation failed:", errorInfo);
  //       });
  //   }, 0);
  // };

  function saveForLater() {
    form.validateFields();
  }

  function handleMoreDetailChanged(checked) {
    // if (checked) {
    //   form.setFieldsValue({
    //     estimateAmount: storedEstimatedAmount.current,
    //   });
    // } else {
    //   storedEstimatedAmount.current = form.getFieldValue("estimateAmount");
    // }
    setMoreDetails(checked);
  }

  return (
    <Form
      key="paintForm"
      variant="outlined"
      form={form}
      layout="vertical"
      className={viewMode ? styles.customForm : ""}
      autoComplete="off"
      onValuesChange={onValuesChanged}
      disabled={viewMode}
    >
      <Flex justify="space-between">
        <StatusTag status={paintQuery.data.paint?.status} />
        <h3>Paint details</h3>
        <Button type="dashed" disabled={false} icon={<DownloadOutlined />}>
          Download invoice
        </Button>
      </Flex>
      <Divider orientation="left" plain>
        Customer
      </Divider>

      <CustomerSection form={form} />

      <div>
        <Form.Item name="includeEstimateAmount" valuePropName="checked">
          <Checkbox>Include estimate cost</Checkbox>
        </Form.Item>
      </div>

      <Divider orientation="left" plain>
        Items
      </Divider>
      <PaintSection />
      <PaymentSection viewMode={viewMode} />
      {includeEstimateAmount && (
        <Space>
          <div>
            <Switch checked={moreDetails} onChange={handleMoreDetailChanged} />
            {!moreDetails ? <h4>Show more details</h4> : <h4>Hide details</h4>}
          </div>
        </Space>
      )}
      <PaymentSummary
        updateTotalSummary={updateTotalSummary}
        columns={columnsForTotal}
      />
      <Divider orientation="left" plain />
      <Flex justify="space-between">
        <Space>
          <Button
            disabled={false}
            color="danger"
            variant="solid"
            onClick={() => navigate(`/paint?page=1&size=${DEFAULT_PAGE_SIZE}`)}
          >
            Close
          </Button>
        </Space>
        <Space>
          {viewMode || (
            <>
              <Button type="primary" htmlType="button" onClick={saveForLater}>
                Save for later
              </Button>

              <Button type="primary">Finalize</Button>
            </>
          )}
        </Space>
      </Flex>
    </Form>
  );
};
export default CreatePaint;
