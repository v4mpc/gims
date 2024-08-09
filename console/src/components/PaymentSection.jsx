import {
  thousanSeparatorformatter,
  thousanSeparatorparser,
} from "../utils.jsx";
import { Space, Form, InputNumber, DatePicker } from "antd";

const PaymentSection = ({ saveOnlyValidations }) => {
  return (
    <>
        <div>
            <Space>
                <Form.Item
                    rules={[
                        { required: true, message: "Please enter amount" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (saveOnlyValidations) {
                                    return Promise.resolve();
                                }

                                if (
                                    value &&
                                    getFieldValue("initialPayment") +
                                    getFieldValue("finalPayment") >=
                                    getFieldValue("estimateAmount")
                                ) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(
                                    new Error(
                                        "Payments should be greater on equal to Estimate amount to finalize.",
                                    ),
                                );
                            },
                        }),
                    ]}
                    name="initialPayment"
                    label="Initial Payment"
                >
                    <InputNumber
                        formatter={thousanSeparatorformatter}
                        parser={thousanSeparatorparser}
                        style={{ width: "300px" }}
                        min={0}
                    />
                </Form.Item>

                <Form.Item
                    rules={[
                        ...(saveOnlyValidations
                            ? []
                            : [{ required: true, message: "Please select date" }]),
                    ]}
                    label="Date"
                    name="initialPaymentDate"
                >
                    <DatePicker
                        style={{
                            width: "200px",
                        }}
                    />
                </Form.Item>
            </Space>
        </div>

        <div>
            <Space>
                <Form.Item
                    dependencies={["initialPayment", "initialPaymentDate"]}
                    rules={[
                        { required: true, message: "Please enter amount" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    (getFieldValue("initialPayment") &&
                                        getFieldValue("initialPaymentDate"))
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("Please fill initial Payment and date first"),
                                );
                            },
                        }),
                    ]}
                    name="finalPayment"
                    label="Final Payment"
                >
                    <InputNumber
                        formatter={thousanSeparatorformatter}
                        parser={thousanSeparatorparser}
                        min={0}
                        style={{ width: "300px" }}
                    />
                </Form.Item>

                <Form.Item
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (saveOnlyValidations) {
                                    return Promise.resolve();
                                }

                                if (!value && getFieldValue("finalPayment") > 0) {
                                    return Promise.reject(new Error("Please select date"));
                                }

                                return Promise.resolve();
                            },
                        }),
                    ]}
                    label="Date"
                    name="finalPaymentDate"
                >
                    <DatePicker
                        style={{
                            width: "200px",
                        }}
                    />
                </Form.Item>
            </Space>
        </div>

    </>
  );
};

export default PaymentSection;
