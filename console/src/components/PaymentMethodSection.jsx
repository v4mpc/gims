import {optionLabelFilter, thousanSeparatorformatter, thousanSeparatorparser} from "../utils.jsx";
import {Checkbox, Divider, Flex, Form, Input, InputNumber, Select, Space} from "antd";


const PaymentMethodSection = ({paymentCatalogQuery,onPaymentChanged,selectedPayment,onPayViaInsuranceChanged,payViaInsurance}) => {




    return (


      <>

          <Flex justify="space-between" wrap>
              <Form.Item
                  label="Payment method"
                  rules={[
                      {
                          required: true,
                          message: "Please input!",
                      },
                  ]}
                  name="paymentMethod"
              >
                  <Select
                      placeholder="Select Payment"
                      loading={paymentCatalogQuery.isLoading}
                      style={{ width: "350px" }}
                      showSearch
                      onChange={onPaymentChanged}
                      filterOption={optionLabelFilter}
                      options={paymentCatalogQuery.data.map((c) => ({
                          value: c.id,
                          label: c.accountName,
                      }))}
                  ></Select>
              </Form.Item>
              <Form.Item
                  name="accountNumber"
                  hidden={selectedPayment?.accountNumber === null}
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
                  name="payViaInsurance"
                  valuePropName="checked"
                  hidden={!selectedPayment?.insurance}
                  label="Pay via insurance"
              >
                  <Checkbox onChange={onPayViaInsuranceChanged} />
              </Form.Item>

              <Form.Item name="grandTotal" label="Grand Total">
                  <InputNumber
                      formatter={thousanSeparatorformatter}
                      parser={thousanSeparatorparser}
                      style={{ width: "300px" }}
                      disabled={true}
                  />
              </Form.Item>
          </Flex>

          {payViaInsurance && selectedPayment?.insurance && (
              <>
                  <Divider orientation="left" plain>
                      Insurance details
                  </Divider>

                  <Space wrap>
                      <Form.Item
                          rules={[
                              {
                                  required: true,
                                  message: "Please enter insurance",
                              },
                          ]}
                          name="insuranceName"
                          label="Insurance name"
                      >
                          <Input style={{ width: "400px" }} />
                      </Form.Item>
                  </Space>
              </>
          )}

      </>
  );
}



export default PaymentMethodSection
