import { Button, Space, Input } from "antd";

import { SearchOutlined } from "@ant-design/icons";

const FilterDropdown = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
}) => (
  <div
    style={{
      padding: 8,
    }}
    onKeyDown={(e) => e.stopPropagation()}
  >
    <Input

      placeholder={`Search name`}
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => confirm()}
      style={{
        marginBottom: 8,
        display: "block",
      }}
    />
    <Space>
      <Button
        type="primary"
        onClick={() => confirm()}
        icon={<SearchOutlined />}
        size="small"
        style={{
          width: 90,
        }}
      >
        Search
      </Button>
      <Button
        onClick={() => clearFilters()}
        size="small"
        style={{
          width: 90,
        }}
      >
        Reset
      </Button>
      <Button
        type="link"
        size="small"
        onClick={() => {
          close();
        }}
      >
        close
      </Button>
    </Space>
  </div>
);


export default FilterDropdown
