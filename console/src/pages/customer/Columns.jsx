import {Tag, Flex} from "antd";


const customerColumns = [
    {
        title: "#",
        dataIndex: "id",
        key: "id",
        width: "5%",
    },

    {
        title: "Name",
        key: "name",
        dataIndex: "name",
    },


    {
        title: "Phone",
        key: "phone",
        dataIndex: "phone",
    },

    {
        title: "Cars",
        key: "cars",
        width: "30%",
        dataIndex: "cars",
        render: (_, record) => (
            <Flex gap="4px 0" wrap>
                {record.cars.map((car) => {
                    return (
                        <Tag key={car.id}>
                            {`${car.make} ${car.model} ${car.plateNumber}`}
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

export default customerColumns;
