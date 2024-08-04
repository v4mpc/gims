import {Button, Divider, Form, Input, Select, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";


export function MakeModelForm({makeQuery}) {
    return (




        <>

            <Select placeholder="Select unit" loading={makeQuery.isLoading}
                    options={makeQuery.data.map(make => ({value: make.id, label: make.name}))}></Select>

            <Divider orientation="left" plain>
                Models
            </Divider>


            <Form.List name="models" rules={[
                {
                    validator: async (_, names) => {
                        if (!names || names.length < 1) {
                            return Promise.reject(new Error('At least 1 model required'));
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
                                    name={[name, 'name']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Missing name',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Name"/>
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
    );
}


export function MakeOnlyForm() {
    return (
        <>
            <Form.Item
                label="Make"
                name="make"
                rules={[
                    {
                        required: true,
                        message: "Please input!",
                    },
                ]}
            >
                <Input/>
            </Form.Item>
        </>
    );
}



