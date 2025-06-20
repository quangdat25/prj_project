import { App, Button, Col, Form, Input, InputNumber, Modal, Row } from "antd";

import React, { useState } from "react";
import type { FormProps } from "antd";
import { notification, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { createNewBookAPI, createUserAPI } from "services/api";

type FieldType = {
  _id: string;
  thumbnail: string;
  slider: string[];
  mainText: string;
  author: string;
  price: number;
  quantity: number;
  category: string;
};
interface IProps {
  openAdd: boolean;
  setOpenAdd: (v: boolean) => void;
  refreshBook: () => boolean;
}

const Addnewbook = (props: IProps) => {
  const { openAdd, setOpenAdd, refreshBook } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message } = App.useApp();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    setIsSubmit(true);

    const {
      _id,
      author,
      category,
      mainText,
      price,
      quantity,
      slider,
      thumbnail,
    } = values;
    console.log("chekc value", values);
    const res = await createNewBookAPI(
      _id,
      thumbnail,
      author,
      category,
      mainText,
      price,
      quantity,
      slider
    );
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
      open={openAdd}
      width={700}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenAdd(false);
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
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item<FieldType>
              label="Book name"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType>
              label="Author"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập !" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={6}>
            <Form.Item<FieldType>
              label="Price"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<FieldType>
              label="Title"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<FieldType>
              label="Quantity"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={10}>
            <Form.Item<FieldType>
              label="Thumbnail"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item<FieldType>
              label="Silder"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Addnewbook;
