const paymentCatalogColumns = [
    {
        title: "#",
        dataIndex: "id",
        key: "id",
        width: "5%",
    },
    {
        title: "Account name",
        key: "accountName",
        dataIndex: "accountName",
    },

    {
        title: "Account number",
        key: "accountNumber",
        dataIndex: "accountNumber",
    },

    {
        title: "Payable through Insurance",
        key: "insurance",
        dataIndex: "insurance",
        render: (_, record) => record.insurance ? 'Yes' : 'No'
    },
    {
        title: "Action",
        key: "action",
    },
];

export default paymentCatalogColumns;
