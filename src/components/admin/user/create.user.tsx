import { App, Button, Form, Input, InputNumber, Modal } from "antd";

import React, { useState } from "react";
import type { FormProps } from "antd";
import { notification, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { createUserAPI } from "services/api";

type FieldType = {
  fullName: string;
  password: string;
  email: string;
  phone: string;
};
interface IProps {
  openCreateUser: boolean;
  setOpenCreateUser: (v: boolean) => void;
  refreshTable: () => boolean;
}

const CreateUser = (props: IProps) => {
  const { openCreateUser, setOpenCreateUser, refreshTable } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message } = App.useApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    setIsSubmit(true);

    const { fullName, email, password, phone } = values;
    console.log("chekc value", values);
    const res = await createUserAPI(fullName, email, password, phone);
    console.log("api", res);
    // debugger;
    // console.log("xxx", import.meta.env.VITE_BACKEND_URL);
    if (res && res.data) {
      message.success("Creat success");
      form.resetFields();
      setOpenCreateUser(false);
      refreshTable();
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
    <Modal
      title="Tạo người dùng mới"
      open={openCreateUser}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenCreateUser(false);
        form.resetFields();
      }}
      confirmLoading={isSubmit}
      okText="Tạo mới"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        name="form-create-user"
        onFinish={onFinish}
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
      </Form>
    </Modal>
  );
};

export default CreateUser;
