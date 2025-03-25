import ThousandSeparator from "../../components/ThousandSeparator.jsx";

const productColumns = [
    {
        title: "#",
        dataIndex: "id",
        key: "id",
        width: "5%",
    },


    {
        title: "Code",
        key: "code",
        dataIndex: "code",
    },

    {
        title: "Name",
        key: "name",
        dataIndex: "name",
    },


    {
        title: "Category",
        key: "category",
        dataIndex: "name",
        render: (_, record) => (<span>{record.category.name}</span>)
    },


    {
        title: "Buying price",
        key: "buy",
        dataIndex: "buyPrice",
        render:(_,record)=><ThousandSeparator value={record.buyPrice}/>
    },
    {
        title: "Selling price",
        key: "sell",
        dataIndex: "salePrice",
        render:(_,record)=><ThousandSeparator value={record.salePrice}/>

    },
    {
        title: "Action",
        key: "action",
    },
];

export default productColumns;
