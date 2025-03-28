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
} from "../../utils.jsx";

import { StatusTag } from "../../components/StatusTag.jsx";
import CustomerSection from "../../components/CustomerSection.jsx";
import PaintSection from "../../components/PaintSection.jsx";
import PaymentSection from "../../components/PaymentSection.jsx";
import styles from "../../components/CustomForm.module.css";
import { usePaintFormPatch } from "../../hooks/usePaintFormPatch.jsx";
import { DownloadOutlined } from "@ant-design/icons";
import PaymentSummary from "../../components/PaymentSummary.jsx";
import ThousandSeparator from "../../components/ThousandSeparator.jsx";
import { useSaveServiceForm } from "../../hooks/useSaveServiceForm.jsx";
import { useState } from "react";

const CreatePaint = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { paintQuery, editMode, viewMode } = usePaintFormPatch(form, id);
  const [moreDetails, setMoreDetails] = useState(true);
  const paymentsForTotal = Form.useWatch("payments", form) ?? [];
  const paintForTotal = Form.useWatch("paints", form) ?? [];
  const includeEstimateAmount = Form.useWatch("includeEstimateAmount", form);
  const estimateAmount = Form.useWatch("estimateAmount", form) ?? 0;
  const { savePaintForLater, finalizePaint } = useSaveServiceForm(
    form,
    id,
    editMode,
  );

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
        amount: includeEstimateAmount ? paymentTotal - estimateAmount : 0,
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

  function handleMoreDetailChanged(checked) {
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
      <PaintSection viewMode={viewMode} />
      <PaymentSection viewMode={viewMode} />
      {includeEstimateAmount && (

          <Space>
            <Switch checked={moreDetails} disabled={false} onChange={handleMoreDetailChanged} />
            {!moreDetails ? <h4>Show more details</h4> : <h4>Hide details</h4>}
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
              <Button
                type="primary"
                htmlType="button"
                onClick={savePaintForLater}
              >
                Save for later
              </Button>

              <Button type="primary" onClick={finalizePaint}>
                Finalize
              </Button>
            </>
          )}
        </Space>
      </Flex>
    </Form>
  );
};
export default CreatePaint;
