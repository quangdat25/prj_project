import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, notification } from "antd";
import { loginAPI } from "services/api";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "components/context/app.context";

type FieldType = {
  username: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const { setIsAuthenticated, setUser } = useCurrentApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { username, password } = values;
    setIsSubmit(true);
    const res = await loginAPI(username, password);
    setIsSubmit(false);
    if (res.data) {
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem("access_token", res.data.access_token);
      notification.success({
        message: "Login success",
      });
      navigate("/");
    } else {
      notification.error({
        message: "Login fail",
      });
    }

    console.log("Success:", values);
    console.log("res", res);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // căn giữa ngang
        alignItems: "center", // căn giữa dọc
        width: "100vw", // chiếm toàn bộ chiều rộng màn hình
        height: "100vh", // chiếm toàn bộ chiều cao màn hình
        backgroundColor: "#f0f2f5", // hoặc màu nền tùy bạn
        overflow: "hidden", // tránh cuộn nếu bị dư
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: "350px",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              { type: "email", message: "Please input your email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" loading={isSubmit}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
