import {SearchOutlined} from "@ant-design/icons";
import FilterDropdown from "../../components/FilterDropdown.jsx";





const unitColumns = [
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
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1677ff" : undefined,
                }}
            />
        ),
        filterDropdown:({setSelectedKeys, selectedKeys, confirm, clearFilters, close,})=><FilterDropdown clearFilters={clearFilters} setSelectedKeys={setSelectedKeys} selectedKeys={selectedKeys} close={close} confirm={confirm}/>
    },

    {
        title: "Name",
        key: "name",
        dataIndex: "name",
    },

    {
        title: "Action",
        key: "action",
    },
];

export default unitColumns;
