import GenericTable from "../../components/GenericTable.jsx";
import { API_ROUTES } from "../../utils.jsx";

import {Checkbox, Form, Input} from "antd";

import paymentCatalogColumns from "./Columns.jsx";



export default function PaymentCatalog() {
  return (
    <GenericTable itemColumns={paymentCatalogColumns} listPath={API_ROUTES.paymentCatalog} queryKey="paymentCatalog">
      <>


        <Form.Item
          label="Account name"
          name="accountName"
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <Input />
        </Form.Item>

          <Form.Item
              label="Account number"
              name="accountNumber"
          >
              <Input />
          </Form.Item>
          <Form.Item name="insurance" valuePropName="checked">
              <Checkbox>Payable through insurance</Checkbox>
          </Form.Item>
      </>
    </GenericTable>
  );
}
