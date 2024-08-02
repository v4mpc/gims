import { Link, Outlet, useLocation } from "react-router-dom";
import {
  CreditCardOutlined,
  DashboardOutlined,
  DownloadOutlined,
  DropboxOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import BreadCrumbNav from "./BreadCrumbNav.jsx";
import {API_ROUTES, BASE_URL, DEFAULT_PAGE_SIZE, openNotification} from "../utils.jsx";


const { Header, Content, Footer, Sider } = Layout;
const items = [

  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Settings",
    children: [
      { key: "general", label:( <Link to={"/settings/general"}>❁ General</Link>),},
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
        key: "designer",
        label: <Link to="/settings/report-designer">❁ Designer</Link>,
      },
    ],
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Logout"
  },
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
            onClick={()=>{}}
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
