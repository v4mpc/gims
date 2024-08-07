import {
    Button,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Typography,
} from "antd";
import {
    API_ROUTES,
    DATE_FORMAT,
    getLookupData, thousanSeparatorformatter, thousanSeparatorparser,
    toCustomerCars,
} from "../../utils.jsx";
import {useQueries} from "@tanstack/react-query";
import {
    InfoCircleOutlined,
    MinusCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {useEffect, useState, useRef} from "react";

const {Option} = Select;

const {Text} = Typography;

const CreateService = () => {
    const [form] = Form.useForm();
    const [services, setServices] = useState([]);
    const [selectedServices, setselectedServices] = useState([]);
    const bServices = useRef([]);

    const results = useQueries({
        queries: [
            {
                queryKey: ["customerAll"],
                placeholderData: [],
                queryFn: () => getLookupData(API_ROUTES.customersAll),
            },
            {
                queryKey: ["serviceAll"],
                placeholderData: [],
                queryFn: () => getLookupData(API_ROUTES.serviceCatalogsAll),
            },
        ],
    });
    const [customerQuery, serviceCatalogQuery] = results;
    const customers = toCustomerCars(customerQuery.data);

    useEffect(() => {
        setServices(serviceCatalogQuery.data);
        bServices.current = serviceCatalogQuery.data;
    }, [serviceCatalogQuery.data]);

    const customFilter = (input, option) => {
        // Custom search logic: for example, case-insensitive search by label
        return option.label.toLowerCase().includes(input.toLowerCase());
    };

    const onSelectChange = (value) => {
        const filteredCustomer = customers.filter(
            (c) => Number(c.id) === Number(value),
        )[0];
        form.setFieldsValue({
            customerName: filteredCustomer.customerName,
            plateNumber: filteredCustomer.plateNumber,
            make: filteredCustomer.make,
            model: filteredCustomer.model,
        });
    };

    const onServiceChange = (value, key) => {
        const _services = form.getFieldValue("services");
        const _selectedService = bServices.current.filter(
            (s, index) => key === index,
        )[0];
        form.setFieldsValue({
            services: _services.map((s) =>
                s?.service === value ? {...s, price: _selectedService.cost} : s,
            ),
        });
    };

    const onPriceChange = (e, key) => {
        const _services = form.getFieldValue("services");
        if (_services[key].quantity) {
            form.setFieldsValue({
                services: _services.map((s, index) =>
                    index === key
                        ? {
                            ...s,
                            total: e * _services[key].quantity,
                        }
                        : s,
                ),
            });
        }
    };

    const onQuantityChange = (e, key) => {
        const services = form.getFieldValue("services");
        if (services[key].price) {
            form.setFieldsValue({
                services: services.map((s, index) =>
                    index === key
                        ? {
                            ...s,
                            total: e * services[key].price,
                        }
                        : s,
                ),
            });
        }
    };

    const onValuesChanged = (changedValues, allValues) => {
        const _selectedServices = allValues.services
            .filter((s) => s !== undefined && s.service !== undefined)
            .map((s) => s.service);

        if (_selectedServices.length > 0) {
            setselectedServices(_selectedServices);
            console.log(_selectedServices);
        }
    };

    const filteredServices = bServices.current.filter(
        (bs) => !selectedServices.includes(bs.id),
    );
    console.log(filteredServices);

    return (
        <Form
            key="serviceForm"
            variant="outlined"
            form={form}
            layout="vertical"
            autoComplete="off"
            onValuesChange={onValuesChanged}
        >
            <Divider orientation="left" plain>
                Customer car
            </Divider>
            <Flex justify="space-between" wrap>
                <Form.Item
                    label="Customer vehicle"
                    tooltip={{
                        title:
                            "Vehicle name is in format PlateNumber-Make-Model-CustomerName",
                        icon: <InfoCircleOutlined/>,
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
                        style={{width: "400px"}}
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
                    <Input disabled={true}/>
                </Form.Item>

                <Form.Item name="plateNumber" label="Vehicle plate number">
                    <Input disabled={true}/>
                </Form.Item>
                <Form.Item name="make" label="Vehicle make">
                    <Input disabled={true}/>
                </Form.Item>
                <Form.Item name="model" label="Vehicle model">
                    <Input disabled={true}/>
                </Form.Item>
            </Flex>

            <Divider orientation="left" plain>
                Services
            </Divider>

            <Form.List
                name="services"
                rules={[
                    {
                        validator: async (_, names) => {
                            if (!names || names.length < 1) {
                                return Promise.reject(new Error("At least 1 Service required"));
                            }
                        },
                    },
                ]}
            >
                {(fields, {add, remove}, {errors}) => (
                    <>
                        {fields.map(({key, name, ...restField}) => (
                            <Flex
                                gap="large"
                                key={key}
                                style={{
                                    display: "flex",
                                    marginBottom: 8,
                                }}
                                align="baseline"
                            >
                                <Form.Item
                                    {...restField}
                                    label={key === 0 ? "Service" : ""}
                                    name={[name, "service"]}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Missing service",
                                        },
                                    ]}
                                >
                                    <Select

                                        style={{width: "400px"}}
                                        placeholder="Select service..."
                                        onChange={(value) => onServiceChange(value, key)}
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        loading={serviceCatalogQuery.isLoading}
                                    >
                                        {filteredServices.map((fs) => (
                                            <Option key={fs.id} value={fs.id}>
                                                {fs.name}
                                            </Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, "price"]}
                                    label={key === 0 ? "Price" : ""}
                                    min={1}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Missing price",
                                        },
                                    ]}
                                >
                                    <InputNumber formatter={thousanSeparatorformatter} parser={thousanSeparatorparser}
                                        style={{width: "150px"}}
                                        onChange={(value) => onPriceChange(value, key)}
                                        placeholder="Price"
                                    />
                                </Form.Item>

                                <Form.Item
                                    {...restField}
                                    name={[name, "quantity"]}
                                    label={key === 0 ? "Quantity" : ""}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Missing quantity",
                                        },
                                    ]}
                                >
                                    <InputNumber formatter={thousanSeparatorformatter} parser={thousanSeparatorparser}
                                        placeholder="Quantity"
                                        min={1}
                                        onChange={(value) => onQuantityChange(value, key)}
                                    />
                                </Form.Item>

                                <Space align={key === 0 ? undefined : "baseline"}>
                                    <Form.Item
                                        {...restField}
                                        label={key === 0 ? "Total" : ""}
                                        {...restField}
                                        name={[name, "total"]}
                                    >
                                        <InputNumber formatter={thousanSeparatorformatter} parser={thousanSeparatorparser}
                                            disabled
                                            style={{width: "200px"}}
                                            placeholder="Total"
                                        />
                                    </Form.Item>

                                    <MinusCircleOutlined onClick={() => remove(name)}/>
                                </Space>
                            </Flex>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined/>}
                            >
                                Add Service
                            </Button>
                            <Form.ErrorList errors={errors}/>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Form>
    );
};

export default CreateService;
