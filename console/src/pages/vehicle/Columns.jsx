import {Flex, Tag} from "antd";

const vehicleColumns = [
    {
        title: "#",
        dataIndex: "id",
        key: "id",
        width: "5%",
    },
    {
        title: "Make",
        key: "name",
        dataIndex: "name",
    },

    {
        title: "Models",
        key: "models",
        width: "30%",
        dataIndex: "models",
        render: (_, record) => (
            <Flex gap="4px 0" wrap>
                {record.models.map((model) => {
                    return (
                        <Tag key={model.id}>
                            {`${model.name}`}
                        </Tag>
                    )
                })}
            </Flex>
        ),
    },

    {
        title: "Action",
        key: "action",
    },
];

export default vehicleColumns;
