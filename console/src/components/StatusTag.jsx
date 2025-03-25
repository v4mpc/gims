import {Tag} from "antd";


export function StatusTag ({status}){
    const renderStatusTag = () => {
        switch (status) {
            case "DRAFT":
                return <Tag color="warning">DRAFT</Tag>;
            case "PAID":
                return <Tag color="success">PAID</Tag>;

            case "PARTIALLY_PAID":
                return <Tag color="warning">PARTIALLY_PAID</Tag>
            case "UNPAID":
                return <Tag color="error">UNPAID</Tag>;
            default:
                return <Tag color="error">UNKNOWN</Tag>;
        }
    }
    return (
        <div>
            {renderStatusTag()}
        </div>
    );

}
