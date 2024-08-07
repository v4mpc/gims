import { Link, Outlet, useLocation } from "react-router-dom";
import {
    CarOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    DownloadOutlined,
    DropboxOutlined,
    FileTextOutlined, FormatPainterOutlined,
    LogoutOutlined,
    SettingOutlined, ToolOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import BreadCrumbNav from "./BreadCrumbNav.jsx";
import {
  API_ROUTES,
  BASE_URL,
  DEFAULT_PAGE_SIZE,
  openNotification,
} from "../utils.jsx";

const { Header, Content, Footer, Sider } = Layout;
const items = [
  {
    key: "spares",
    icon: <CarOutlined />,
    label: "Spares",
    children: [
        {
            key: "stockOnhand",
            icon: <DropboxOutlined />,
            label: (
                <Link to={`/stock-on-hand?page=1&size=${DEFAULT_PAGE_SIZE}`}>
                    Stock on hand
                </Link>
            ),
        },

        {
            key: "buy",
            icon: <DownloadOutlined style={{ fontSize: "1.1rem" }} />,
            label: <Link to="/buy">Buy</Link>,
        },

        {
            key: "sell",
            icon: <UploadOutlined />,
            label: <Link to="/sell">Sell</Link>,
        }
    ],
  },



    {
        key: "service",
        icon: <ToolOutlined />,
        label: (
            <Link to="/service">Services</Link>
        ),
    },



    {
        key: "paint",
        icon: <FormatPainterOutlined />,
        label: (
            <Link to="/paint">Paint</Link>
        ),
    },



  {
    key: "expense",
    icon: <CreditCardOutlined />,
    label: (
      <Link to={`/expense?page=1&size=${DEFAULT_PAGE_SIZE}`}>Expenses</Link>
    ),
  },

  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Settings",
    children: [
      // {key: "general", label: (<Link to={"/settings/general"}>❁ General</Link>),},
      {
        key: "units",
        label: (
          <Link to={`/settings/units?page=1&size=${DEFAULT_PAGE_SIZE}`}>
            ❁ Units
          </Link>
        ),
      },
      {
        key: "products",
        label: (
          <Link to={`/settings/products?page=1&size=${DEFAULT_PAGE_SIZE}`}>
            ❁ Items
          </Link>
        ),
      },

      {
        key: "categories",
        label: (
          <Link to={`/settings/categories?page=1&size=${DEFAULT_PAGE_SIZE}`}>
            ❁ Categories
          </Link>
        ),
      },

      {
        key: "serviceCatalogs",
        label: (
          <Link
            to={`/settings/service-catalogs?page=1&size=${DEFAULT_PAGE_SIZE}`}
          >
            ❁ Service catalog
          </Link>
        ),
      },

      {
        key: "paymentCatalogs",
        label: (
          <Link
            to={`/settings/payment-catalog?page=1&size=${DEFAULT_PAGE_SIZE}`}
          >
            ❁ Payment catalog
          </Link>
        ),
      },

      {
        key: "customers",
        label: (
          <Link to={`/settings/customers?page=1&size=${DEFAULT_PAGE_SIZE}`}>
            ❁ Customers
          </Link>
        ),
      },

      {
        key: "vehicles",
        label: (
          <Link to={`/settings/vehicles?page=1&size=${DEFAULT_PAGE_SIZE}`}>
            ❁ Vehicles
          </Link>
        ),
      },

      // {
      //     key: "designer",
      //     label: <Link to="/settings/report-designer">❁ Designer</Link>,
      // },
    ],
  },
  // {
  //     key: "logout",
  //     icon: <LogoutOutlined/>,
  //     label: "Logout"
  // },
];

const AppLayout = () => {
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG, headerBg },
  } = theme.useToken();
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          onClick={() => {}}
          theme="dark"
          mode="inline"
          defaultOpenKeys={["settings"]}
          selectedKeys={[location?.pathname.slice(1)]}
          items={items}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: 200,
        }}
      >
        {/*<BreadCrumbNav />*/}
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 24,

              borderRadius: borderRadiusLG,
              minHeight: "100vh",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Garage MIS ©{new Date().getFullYear()} Created by ymahundi
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AppLayout;
