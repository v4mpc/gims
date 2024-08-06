import {Button, Divider, Form, Input, Select, Space} from "antd";
import {
  API_ROUTES,
  DATE_FORMAT,
  getLookupData,
  toCustomerCars,
} from "../../utils.jsx";
import { useQueries } from "@tanstack/react-query";
import {InfoCircleOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

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
  const [customerQuery] = results;
  const customers = toCustomerCars(customerQuery.data);

  const customFilter = (input, option) => {
    // Custom search logic: for example, case-insensitive search by label
    return option.label.toLowerCase().includes(input.toLowerCase());
  };

  const onSelectChange = (value) => {
    const filteredCustomer = customers.filter(
      (c) => Number(c.id) === Number(value),
    )[0];
    console.log(value);
    form.setFieldsValue({
        customerName: filteredCustomer.customerName,
        plateNumber:filteredCustomer.plateNumber,
        make:filteredCustomer.make,
        model:filteredCustomer.model
    });
  };

  return (
    <Form
      key="serviceForm"
      variant="outlined"
      form={form}
      layout="vertical"
      autoComplete="off"
    >

        <Divider orientation="left" plain>
            Customer car
        </Divider>
      <Space>
        <Form.Item
          label="Customer vehicle"
          tooltip={{
            title:
              "Vehicle name is in format PlateNumber-Make-Model-CustomerName",
            icon: <InfoCircleOutlined />,
          }}
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
          name="carId"
        >
          <Select
            placeholder="Select customer vehicle"
            loading={customerQuery.isLoading}
            style={{ width: "400px" }}
            showSearch
            onChange={onSelectChange}
            filterOption={customFilter}
            options={customers.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          ></Select>
        </Form.Item>
        <Form.Item name="customerName" label="Customer name">
          <Input disabled={true} />
        </Form.Item>

        <Form.Item name="plateNumber" label="Vehicle plate number">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="make" label="Vehicle make">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="model" label="Vehicle model">
          <Input disabled={true} />
        </Form.Item>
      </Space>


        <Divider orientation="left" plain>
            Service & Spare parts
        </Divider>



        <Form.List name="cars" rules={[
            {
                validator: async (_, names) => {
                    if (!names || names.length < 1) {
                        return Promise.reject(new Error('At least 1 Service/Spare required'));
                    }
                },
            },
        ]}>
            {(fields, {add, remove}, { errors }) => (
                <>
                    {fields.map(({key, name, ...restField}) => (
                        <Space
                            key={key}
                            style={{
                                display: 'flex',
                                marginBottom: 8,
                            }}
                            align="baseline"
                        >
                            <Form.Item
                                {...restField}
                                name={[name, 'item']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing item',
                                    },
                                ]}
                            >
                                <Input placeholder="Item"/>
                            </Form.Item>
                            <Form.Item

                                {...restField}
                                name={[name, 'price']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing model',
                                    },
                                ]}
                            >
                                <Input placeholder="Price"/>
                            </Form.Item>


                            <Form.Item
                                {...restField}

                                name={[name, 'quantity']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing plate number',
                                    },
                                ]}
                            >
                                <Input placeholder="Quantity" block onInput={e => e.target.value = e.target.value.toUpperCase()}/>
                            </Form.Item>


                            <Form.Item
                                {...restField}

                                name={[name, 'total']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing plate number',
                                    },
                                ]}
                            >
                                <Input placeholder="Total Price" block onInput={e => e.target.value = e.target.value.toUpperCase()}/>
                            </Form.Item>


                            <MinusCircleOutlined onClick={() => remove(name)}/>
                        </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                            Add Service/Spare
                        </Button>
                        <Form.ErrorList errors={errors} />
                    </Form.Item>
                </>
            )}
        </Form.List>



    </Form>
  );
};

export default CreateService;
