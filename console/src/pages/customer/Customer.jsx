import GenericTable from "../../components/GenericTable.jsx";
import { API_ROUTES } from "../../utils.jsx";

import { Form ,Input,InputNumber} from "antd";
import customerColumns from "./Columns.jsx";



export default function Customer() {
  return (
    <GenericTable itemColumns={customerColumns} listPath={API_ROUTES.customers} queryKey="customers">
      <>
        <Form.Item
          label="Name"
          name="name"
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
              rules={[
                  {
                      required: true,
                      message: "Please input!",
                  },
              ]}
              label="phone" name="phone">
              <InputNumber
                  style={{
                      width: "100%",
                  }}
              />
          </Form.Item>


          <Form.Item
              label="Address"
              name="address"
          >
              <Input />
          </Form.Item>
      </>
    </GenericTable>
  );
}
