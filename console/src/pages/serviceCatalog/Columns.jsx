import ThousandSeparator from "../../components/ThousandSeparator.jsx";

const serviceCatalogColumns = [
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
        title: "Cost",
        key: "cost",
        dataIndex: "cost",
        render:(_,record)=><ThousandSeparator value={record.cost}/>

    },

    {
        title: "Action",
        key: "action",
    },
];

export default serviceCatalogColumns;
