const stockOnhandColumns = [
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
    },
    {
        title: "Selling price",
        key: "sell",
        dataIndex: "salePrice",
    },
    {
        title: "Action",
        key: "action",
    },
];

export default stockOnhandColumns;
