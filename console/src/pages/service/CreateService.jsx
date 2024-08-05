import {Form, Select} from "antd";
import {API_ROUTES, getLookupData, toCustomerCars} from "../../utils.jsx";
import {useQueries} from "@tanstack/react-query";

const CreateService = () => {
    const [form] = Form.useForm();

    const results = useQueries({
        queries: [
            {
                queryKey: ["customerAll"],
                placeholderData: [],
                queryFn: () => getLookupData(API_ROUTES.customersAll),
            },
        ],
    });
    const [ customerQuery] = results;
    const customers=toCustomerCars(customerQuery.data);



    const customFilter = (input, option) => {
        // Custom search logic: for example, case-insensitive search by label
        return option.label.toLowerCase().includes(input.toLowerCase());
    };





  return (

      <Form key="serviceForm" variant="outlined" form={form} layout="vertical" autoComplete="off">
          <Form.Item
              label="Customer Car"
              rules={[
                  {
                      required: true,
                      message: "Please input!",
                  },
              ]}
              name="unitOfMeasure"
          >
              <Select
                  placeholder="Select customer car"
                  loading={customerQuery.isLoading}
                  showSearch
                  filterOption={customFilter}
                  options={customers.map((c) => ({
                      value: c.id,
                      label: c.name,
                  }))}
              ></Select>
          </Form.Item>
      </Form>




  );
};

export default CreateService;
