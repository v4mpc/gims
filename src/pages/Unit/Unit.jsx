import GenericTable from "../../components/GenericTable.jsx";
import { API_ROUTES } from "../../utils.jsx";

import { Form ,Input} from "antd";
import unitColumns from "./Columns.jsx";



export default function Unit() {
  return (
    <GenericTable itemColumns={unitColumns} listPath={API_ROUTES.units}>
      <>
        <Form.Item
          label="Code"
          name="code"
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
      </>
    </GenericTable>
  );
}
