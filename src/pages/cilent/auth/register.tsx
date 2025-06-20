import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, notification, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { registerAPI } from "services/api";

const { Title, Text } = Typography;

type FieldType = {
  fullName: string;
  password: string;
  email: string;
  phone: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  // const { message } = App.useApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    setIsSubmit(true);

    const { fullName, email, password, phone } = values;
    console.log("chekc value", values);
    const res = await registerAPI(fullName, email, password, phone);
    console.log("api", res);
    // debugger;
    // console.log("xxx", import.meta.env.VITE_BACKEND_URL);
    if (res.data) {
      notification.success({
        message: "Register successful",
      });
      navigate("/login");
    } else {
      notification.error({
        message: "Error",
      });
    }
    console.log("res.data", res.data);
    setIsSubmit(false);
  };
  // const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
  //   errorInfo
  // ) => {
  //   console.log("Failed:", errorInfo);
  // };

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
          width: "400px",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
          Đăng Ký Tài Khoản
        </Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item<FieldType>
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Số điện thoại không được để trống!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmit} block>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text>Đã có tài khoản ? </Text>
          <Link to="/login">Đăng Nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
