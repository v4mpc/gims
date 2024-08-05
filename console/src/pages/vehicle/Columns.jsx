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
        width: "30%",
        dataIndex: "name",
    },

    {
        title: "Models",
        key: "models",

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
];

export default vehicleColumns;
