import {
  API_ROUTES,
  getLookupData,
  optionLabelFilter,
  thousanSeparatorformatter,
  thousanSeparatorparser,
} from "../utils.jsx";
import {
  Space,
  Form,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Input,
  Divider,
  Table,
  Empty,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./CustomForm.module.css";

import PropTypes from "prop-types";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";

PaymentSection.propTypes = {
  viewMode: PropTypes.bool,
  editMode: PropTypes.bool,
};

function PaymentSection({ viewMode }) {
  const form = Form.useFormInstance();
  const [notDisabledInsurances, setNotDisabledInsurances] = useState([]);
  const availablePayments = form.getFieldValue("payments") ?? [];

  const results = useQueries({
    queries: [
      {
        queryKey: ["paymentCatalogAll"],
        placeholderData: [],
        queryFn: () => getLookupData(API_ROUTES.paymentCatalogAll),
      },
    ],
  });
  const [paymentCatalogQuery] = results;

  const paymentMethodChanged = (paymentId, paymentKey) => {
    const [selectedPaymentMethod] = paymentCatalogQuery.data.filter(
      (pc) => pc.id === paymentId,
    );

    if (selectedPaymentMethod.accountNumber !== null) {
      form.setFieldsValue({
        payments: form.getFieldValue("payments").map((payment, key) =>
          key === paymentKey
            ? {
                ...payment,
                accountNumber: selectedPaymentMethod.accountNumber,
              }
            : payment,
        ),
      });
    } else {
      form.setFieldsValue({
        payments: form.getFieldValue("payments").map((payment, key) =>
          key === paymentKey
            ? {
                ...payment,
                accountNumber: "",
              }
            : payment,
        ),
      });
    }

    if (selectedPaymentMethod.insurance) {
      setNotDisabledInsurances((prevState) => [...prevState, paymentKey]);
    } else {
      setNotDisabledInsurances((prevState) =>
        prevState.filter((i) => i !== paymentKey),
      );
    }
  };

  return (
    <>
      <Divider orientation="left" plain>
        Payments
      </Divider>

      {availablePayments.length === 0 && viewMode && <Empty />}

      <Form.List name="payments">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{
                  display: "flex",
                  marginBottom: 8,
                }}
              >
                <Form.Item
                  {...restField}
                  label="Date"
                  name={[name, "payment_date"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input",
                    },
                  ]}
                >
                  <DatePicker
                    style={{
                      width: "200px",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Amount"
                  rules={[
                    {
                      required: true,
                      message: "Please input!",
                    },
                  ]}
                  name={[name, "amount"]}
                >
                  <InputNumber
                    precision={0}
                    style={{ width: "200px" }}
                    formatter={thousanSeparatorformatter}
                    parser={thousanSeparatorparser}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Payment method"
                  rules={[
                    {
                      required: true,
                      message: "Please input",
                    },
                  ]}
                  name={[name, "payment_method_id"]}
                >
                  <Select
                    style={{ width: "150px" }}
                    placeholder="Select payment method"
                    loading={paymentCatalogQuery.isLoading}
                    onChange={(paymentMethodId) =>
                      paymentMethodChanged(paymentMethodId, key)
                    }
                    showSearch
                    filterOption={optionLabelFilter}
                    options={paymentCatalogQuery.data.map((c) => ({
                      value: c.id,
                      label: c.accountName,
                    }))}
                  ></Select>
                </Form.Item>
                <Form.Item
                  name={[name, "accountNumber"]}
                  label="Account number"
                >
                  <Input
                    style={{
                      width: "200px",
                    }}
                    disabled={true}
                  />
                </Form.Item>

                <Form.Item
                  name={[name, "insuranceName"]}
                  label="Insurance name"
                >
                  <Input
                    style={{ width: "400px" }}
                    disabled={!notDisabledInsurances.includes(key)}
                  />
                </Form.Item>
                {viewMode || (
                  <MinusCircleOutlined onClick={() => remove(name)} />
                )}
              </Space>
            ))}

            {viewMode || (
              <>
                <div style={{ color: "red" }}>
                  <Form.ErrorList errors={errors} />
                </div>
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add payment
                  </Button>
                </Form.Item>
              </>
            )}
          </>
        )}
      </Form.List>
    </>
  );
}

export default PaymentSection;
