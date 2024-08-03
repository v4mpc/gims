import ThousandSeparator from "../../components/ThousandSeparator.jsx";

const expenseColumns = [
    {
        title: "#",
        dataIndex: "id",
        key: "id",
        width: "5%",
    },
    {
        title: "Date",
        key: "createdAt",
        dataIndex: "createdAt",
        width: "30%",
    },

    {
        title: "Name",
        key: "name",
        dataIndex: "name",
    },

    {
        title: "Amount(TZS)",
        key: "Amount",
        render: (_, record) => <ThousandSeparator value={record.amount} />,
    },
    {
        title: "Action",
        key: "action",
        fixed: 'right',
    },
];

export default expenseColumns;
