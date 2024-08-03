import GenericTable from "../../components/GenericTable.jsx";
import { API_ROUTES } from "../../utils.jsx";

import { Form ,Input} from "antd";
import carColumns from "./Columns.jsx";



export default function Car() {
  //   TODO :: endend here
  return (
    <GenericTable itemColumns={carColumns} listPath={API_ROUTES.units} queryKey="units">
      <>
        <Form.Item
          label="Make"
          name="make"
          rules={[
            {
              message: "Please input!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Model"
          name="model"
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
