import GenericTable from "../../components/GenericTable.jsx";
import { API_ROUTES } from "../../utils.jsx";

import { Form ,Input} from "antd";
import categoryColumns from "./Columns.jsx";



export default function Category() {
  return (
    <GenericTable itemColumns={categoryColumns} listPath={API_ROUTES.categories} queryKey="categories">
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
      </>
    </GenericTable>
  );
}
