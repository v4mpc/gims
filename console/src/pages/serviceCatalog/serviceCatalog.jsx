import GenericTable from "../../components/GenericTable.jsx";
import {API_ROUTES, thousanSeparatorformatter, thousanSeparatorparser} from "../../utils.jsx";

import {Form, Input, InputNumber} from "antd";
import serviceCatalogColumns from "./Columns.jsx";


export default function ServiceCatalog() {
    return (
        <GenericTable itemColumns={serviceCatalogColumns} listPath={API_ROUTES.serviceCatalogs} queryKey="serviceCatalogs">
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


                <Form.Item label="Cost"
                           rules={[
                               {
                                   required: true,
                                   message: "Please input!",
                               },
                           ]}
                           name="cost">
                    <InputNumber formatter={thousanSeparatorformatter} parser={thousanSeparatorparser}
                        style={{
                            width: "100%",
                        }}
                    />
                </Form.Item>
            </>
        </GenericTable>
    );
}
