import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input } from "antd";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";
import {
  API_ROUTES,
  BASE_URL,

  openNotification,
} from "../utils.jsx";
import { useState } from "react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function postData(values) {
    let initData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    initData.body = JSON.stringify(values);
    const resp = await fetch(`${BASE_URL}/${API_ROUTES.login}`, initData);
    try {
      if (!resp.ok) {
        if (resp.status === 403) {
          throw new Error("Invalid Username/Password.");
        }
        throw new Error("Network response was not ok");
      }
      openNotification("login-success", "success", "Success", "Login Success");
      login();
      navigate("/dashboard");

    } catch (e) {
      console.error(e);
      openNotification(e.message, "error", "Error", e.message);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const onFinish = async (values) => {
    await postData(values);
  };
  return (
    <Flex
      vertical={false}
      style={{ width: "100%", height: "100vh", backgroundColor: "#f5f5f5" }}
      justify="center"
      align="center"
    >
      <Card style={{ width: "20%" }}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};
export default Login;
