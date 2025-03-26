import { Tag } from "antd";

export function StatusTag({ status }) {
  const renderStatusTag = () => {
    switch (status) {
      case "FINALIZED":
        return <Tag color="success">FINALIZED</Tag>;
      case "DISCARDED":
        return <Tag color="error">DISCARDED</Tag>;
      default:
        return <Tag color="warning">DRAFT</Tag>;
    }
  };
  return <div>{renderStatusTag()}</div>;
}
