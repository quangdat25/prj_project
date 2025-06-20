import { App, Button, Form, Input, InputNumber, Modal } from "antd";

import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { notification, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { updateUserAPI } from "services/api";

type FieldType = {
  fullName: string;
  email: string;
  phone: string;
  _id: string;
};

interface IProps {
  openUpdateUser: boolean;
  setOpenUpdateUser: (v: boolean) => void;
  refreshTable: () => boolean;
  dataUpdate: IUserTable | null;
  setDataUpdate: (v: IUserTable | null) => void;
}

const CreateUser = (props: IProps) => {
  const {
    openUpdateUser,
    setOpenUpdateUser,
    refreshTable,
    dataUpdate,
    setDataUpdate,
  } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message } = App.useApp();
  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        _id: dataUpdate._id,
        fullName: dataUpdate.fullName,
        email: dataUpdate.email,
        phone: dataUpdate.phone,
      });
    }
  }, [dataUpdate]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    setIsSubmit(true);

    const { fullName, _id, phone } = values;
    console.log("chekc value", values);
    const res = await updateUserAPI(_id, fullName, phone);
    console.log("api", res);
    // debugger;
    // console.log("xxx", import.meta.env.VITE_BACKEND_URL);
    if (res && res.data) {
      message.success("Update successfully");
      form.resetFields();
      setOpenUpdateUser(false);
      setDataUpdate(null);
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
      open={openUpdateUser}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenUpdateUser(false);
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
          hidden
          label="ID"
          name="_id"
          rules={[
            { required: true, message: "Số điện thoại không được để trống!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Email" name="email">
          <Input disabled />
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
