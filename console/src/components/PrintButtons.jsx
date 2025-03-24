import { Button, Dropdown, Space } from "antd";
import { DownOutlined, FilePdfOutlined } from "@ant-design/icons";
import { API_ROUTES, BASE_URL } from "../utils.jsx";

function PrintButtons({ serviceId }) {
  console.log(serviceId);
  const handleMenuClick = (e) => {
    if (serviceId !== undefined) {
      window.open(
        `${BASE_URL}/${API_ROUTES.exportInvoice}/${serviceId}`,
        "_blank",
      ); // '_blank' opens in a ne
    }
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
      <Button disabled={false}>
        <Space>
          Print
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}

export default PrintButtons;
