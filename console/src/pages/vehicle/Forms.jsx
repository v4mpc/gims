import {Form, Input, Select} from "antd";


export function MakeOnlyForm() {
    return (

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
    );
}


export function MakeModelForm({makes}) {
    return (
        <>
            <Form.Item label="Make"
                       rules={[
                           {
                               required: true,
                               message: "Please input!",
                           },
                       ]}

                       name="make">
                <Select placeholder="Select make" loading={false}
                        options={makes.map(make => ({
                            value: make.id,
                            label: make.name
                        }))}></Select>
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
                <Input/>
            </Form.Item>
        </>
    );
}



