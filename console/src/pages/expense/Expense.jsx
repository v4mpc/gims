import GenericTable from "../../components/GenericTable.jsx";
import { InputNumber, Form, Input, DatePicker } from "antd";
import { API_ROUTES } from "../../utils.jsx";
import expenseColumns from "./Columns.jsx";



export default function Expense() {
  return (
    <GenericTable itemColumns={expenseColumns} listPath={API_ROUTES.expenses}>
      <>
        <Form.Item
          label="Date"
          name="createdAt"
          rules={[
            {
              required: true,
              message: "Please date",
            },
          ]}
        >
          <DatePicker
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item
            rules={[
              {
                required: true,
                message: "Please name",
              },
            ]}
            label="Expense" name="name">
          <Input />
        </Form.Item>
        <Form.Item
            rules={[
              {
                required: true,
                message: "Please amount",
              },
            ]}
            label="Amount" name="amount">
          <InputNumber
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
      </>
    </GenericTable>
  );
}
