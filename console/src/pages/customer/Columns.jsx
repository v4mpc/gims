import {Tag} from "antd";




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
        dataIndex: "cars",
        render: (_, record) => (
            <>
                {record.cars.map((car)=>{
                    return (
                        <Tag key={car}>
                            {`${car.make} ${car.model} ${car.plateNumber}`}
                        </Tag>)
                })}
            </>
        ),
    },

    {
        title: "Action",
        key: "action",
    },
];

export default customerColumns;
