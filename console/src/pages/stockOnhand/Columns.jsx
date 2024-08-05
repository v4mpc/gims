import ThousandSeparator from "../../components/ThousandSeparator.jsx";

const stockOnhandColumns = [
    {
        title: "#",
        dataIndex: "id",
        key: "id",
        width: "5%",
        render:(_,record)=>record.product.id
    },
    {
        title: "Code",
        key: "code",
        dataIndex: "code",
        width: "10%",
        render:(_,record)=>record.product.code

    },
    {
        title: "Product",
        key: "product",
        dataIndex: "product",
        width: "20%",
        render:(_,record)=>record.product.name

    },
    {
        title: "Unit",
        key: "unit",
        dataIndex: "unit",
        width: "10%",
        render:(_,record)=>record.product.unitOfMeasure.code

    },

    {
        title: "Category",
        key: "category",
        dataIndex: "category",
        render: (_, record) => (<span>{record.product.category.name}</span>)
    },

    {
        title: "Buy price(TZS)",
        key: "buy",
        dataIndex: "buy",
        width: "10%",
        render: (_, record) => <ThousandSeparator value={record.product.buyPrice} />,
    },

    {
        title: "Sell Price(TZS)",
        key: "sell",
        dataIndex: "sell",
        width: "10%",
        render: (_, record) => <ThousandSeparator value={record.product.salePrice} />,
    },

    {
        title: "Stock on hand",
        dataIndex: "stockOnHand",
        key: "stockOnHand",
        render: (_, record) => <ThousandSeparator value={record.stockOnhand} />,
    },

    {
        title: "Action",
        key: "adjust",
    },
];

export default stockOnhandColumns;
