import { Tag } from "antd";

export function StatusTag({ status }) {
  const renderStatusTag = () => {
    switch (status) {
      case "DRAFT":
        return <Tag color="warning">DRAFT</Tag>;
      case "FINALIZED":
        return <Tag color="success">FINALIZED</Tag>;
      case "PARTIALLY_PAID":
        return <Tag color="error">DISCARDED</Tag>;
      default:
        return <Tag color="error">UNKNOWN</Tag>;
    }
  };
  return <div>{renderStatusTag()}</div>;
}
