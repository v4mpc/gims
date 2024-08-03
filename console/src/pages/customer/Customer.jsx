import GenericTable from "../../components/GenericTable.jsx";
import {API_ROUTES} from "../../utils.jsx";

import {Button, Form, Input, InputNumber, Space} from "antd";
import customerColumns from "./Columns.jsx";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';


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
                    <Input/>
                </Form.Item>

                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: "Please input!",
                        },
                    ]}
                    label="phone" name="phone">
                    <Input/>
                </Form.Item>


                <Form.Item
                    label="Address"
                    name="address"
                >
                    <Input/>
                </Form.Item>


                <Form.List name="cars" rules={[
                    {
                        validator: async (_, names) => {
                            if (!names || names.length < 1) {
                                return Promise.reject(new Error('At least 1 car required'));
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
                                        name={[name, 'make']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing make',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Make"/>
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'model']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing model',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Model"/>
                                    </Form.Item>


                                    <Form.Item
                                        {...restField}
                                        name={[name, 'plateNumber']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing plate number',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Plate number" onInput={e => e.target.value = e.target.value.toUpperCase()}/>
                                    </Form.Item>


                                    <MinusCircleOutlined onClick={() => remove(name)}/>
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                    Add Car
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>


            </>
        </GenericTable>
    );
}
