import { Button, Dropdown, Space } from "antd";
import {DownOutlined, FilePdfOutlined} from "@ant-design/icons";

function PrintButtons() {
  const handleMenuClick = (e) => {
    console.log("click", e);
  };

  const items = [
    {
      label: "TAX INVOICE",
      key: "1",
      icon: <FilePdfOutlined />,
    },

    {
      label: "PROFOMA INVOICE",
      key: "2",
      icon: <FilePdfOutlined />,
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown menu={menuProps}>
      <Button>
        <Space>
          Print
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}

export default PrintButtons;
