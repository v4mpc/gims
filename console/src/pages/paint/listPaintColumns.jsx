const listPaintColumns = [
    {
        title: "#",
        dataIndex: "id",
        key: "id",
        width: "5%",
        render:(_,record)=>record.paint.id
    },
    {
        title: "Customer Name",
        key: "customerName",
        dataIndex: "customerName",
    },



    {
        title: "Vehicle make",
        key: "make",
        dataIndex: "make",
        render:(_,record)=>record.paint.customerCar.make
    },


    {
        title: "Vehicle model",
        key: "model",
        dataIndex: "model",
        render:(_,record)=>record.paint.customerCar.model
    },


    {
        title: "Plate number",
        key: "plateNumber",
        dataIndex: "plateNumber",
        render:(_,record)=>record.paint.customerCar.plateNumber
    },



    {
        title: "Status",
        key: "status",
        dataIndex: "status",
        render:(_,record)=>record.paint.status
    },


    {
        title: "Action",
        key: "action",
    },
];

export default listPaintColumns;
