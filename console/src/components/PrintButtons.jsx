import { Button, Dropdown, Space } from "antd";
import { DownOutlined, FilePdfOutlined } from "@ant-design/icons";
import { API_ROUTES, BASE_URL } from "../utils.jsx";
import PropTypes from "prop-types";

PrintButtons.propTypes = {
  primaryKey: PropTypes.number,
  invoiceSource: PropTypes.string,
  printable: PropTypes.arrayOf(PropTypes.oneOf(["TAX", "PROFORMA"])).isRequired,
};

function PrintButtons({ primaryKey, invoiceSource, printable }) {
  //   printable =[TAX,PROFORMA]
  const handleMenuClick = () => {
    if (primaryKey !== undefined) {
      window.open(
        `${BASE_URL}/${API_ROUTES.exportInvoice}/${invoiceSource}/${primaryKey}`,
        "_blank",
      );
    }
  };

  const items = [
    {
      label: "TAX INVOICE",
      key: "TAX",
      icon: <FilePdfOutlined />,
    },

    {
      label: "PROFORMA INVOICE",
      key: "PROFORMA",
      icon: <FilePdfOutlined />,
    },
  ].filter((i) => printable.includes(i.key));
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown menu={menuProps}>
      <Button disabled={false} type="dashed" size="large" >
        <Space>
          Print
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}

export default PrintButtons;
