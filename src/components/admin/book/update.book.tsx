import {
  App,
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";

import React, { useEffect, useState } from "react";
import type {
  FormProps,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd";
import { notification, Typography } from "antd";
import {
  createBookAPI,
  getBookcategory,
  updateBookAPT,
  uploadFileAPI,
} from "services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { v4 as uuidv4 } from "uuid";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const MAX_UPLOAD_IMAGE_SIZE = 2; // MB

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
type UserUploadType = "thumbnail" | "slider";
interface IProps {
  openUpdate: boolean;
  setOpenUpdate: (v: boolean) => void;
  refreshBook: () => boolean;
  setDataUpdate: (v: IBookTable | null) => void;
  dataUpdate: IBookTable | null;
}

const UpdateBook = (props: IProps) => {
  const { openUpdate, setOpenUpdate, refreshBook, dataUpdate, setDataUpdate } =
    props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message } = App.useApp();
  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
  const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
  useEffect(() => {
    const fetchDataCategory = async () => {
      const res = await getBookcategory();
      if (res?.data) {
        const d = res.data.map((item: string) => ({
          label: item,
          value: item,
        }));
        setListCategory(d);
      }
    };
    fetchDataCategory();
  }, []);
  useEffect(() => {
    if (dataUpdate) {
      const arrThumbnail = [
        {
          uid: uuidv4(),
          name: dataUpdate.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataUpdate.thumbnail
          }
        }`,
        },
      ];
      const arrSlider = dataUpdate.slider?.map((item) => {
        return {
          uid: uuidv4(),
          name: item,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataUpdate.slider
          }}`,
        };
      });
      form.setFieldsValue({
        _id: dataUpdate._id,
        mainText: dataUpdate.mainText,
        author: dataUpdate.author,
        price: dataUpdate.price,
        category: dataUpdate.category,
        quantity: dataUpdate.quantity,
        thumbnail: arrThumbnail,
        slider: arrSlider,
      });
      setFileListSlider(arrSlider as any);
      setFileListThumbnail(arrThumbnail as any);
    }
  }, [dataUpdate]);

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) message.error("You can only upload JPG/PNG file!");

    const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLt2M)
      message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);

    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
  };
  const handleRemove = (file: UploadFile, type: UserUploadType) => {
    if (type === "thumbnail") {
      setFileListThumbnail([]);
    }
    if (type === "slider") {
      const newFile = fileListSlider.filter((x) => x.uid !== file.uid);
      setFileListSlider(newFile);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
    if (info.file.status === "uploading") {
      type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }
    if (info.file.status === "done") {
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
    }
  };

  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

  const handleUploadFile = async (
    options: RcCustomRequestOptions,
    type: UserUploadType
  ) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;
    const res = await uploadFileAPI(file, "book");

    if (res && res.data) {
      const uploadedFile: any = {
        uid: file.uid,
        name: res.data.fileUploaded,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          res.data.fileUploaded
        }`,
      };
      if (type === "thumbnail") {
        setFileListThumbnail([
          {
            ...uploadedFile,
          },
        ]);
      } else {
        setFileListSlider((prevState) => [
          ...prevState,
          {
            ...uploadedFile,
          },
        ]);
      }
    }

    if (onSuccess) onSuccess("ok");
    else {
      message.error(res.message);
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const { _id, mainText, author, price, quantity, category } = values;
    const thumbnail = fileListThumbnail?.[0]?.name ?? "";
    const slider = fileListThumbnail?.map((item) => item.name) ?? [];
    const res = await updateBookAPT(
      _id,
      mainText,
      author,
      price,
      quantity,
      category,
      thumbnail,
      slider
    );

    if (res?.data) {
      message.success("Create success");
      form.resetFields();
      setFileListSlider([]);
      setFileListThumbnail([]);
      setOpenUpdate(false);
      refreshBook();
    } else {
      notification.error({ message: res.message });
    }

    setIsSubmit(false);
  };

  return (
    <Modal
      title="Tạo người dùng mới"
      open={openUpdate}
      width={700}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setFileListSlider([]);
        setFileListThumbnail([]);
        setOpenUpdate(false);
      }}
      confirmLoading={isSubmit}
      okText="Tạo mới"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        name="form-create-book"
        onFinish={onFinish}
      >
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item<FieldType> label="ID" name="_id">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item<FieldType>
              label="Book name"
              name="mainText"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType>
              label="Author"
              name="author"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={6}>
            <Form.Item<FieldType>
              label="Price"
              name="price"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter=" đ"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<FieldType>
              label="Category"
              name="category"
              rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
            >
              <Select placeholder="Category" options={listCategory} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<FieldType>
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="Thumbnail"
              name="thumbnail"
              rules={[
                { required: true, message: "Vui lòng upload ảnh thumbnail!" },
              ]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                maxCount={1}
                multiple={false}
                customRequest={(options) =>
                  handleUploadFile(options, "thumbnail")
                }
                beforeUpload={beforeUpload}
                onChange={(info) => handleChange(info, "thumbnail")}
                onPreview={handlePreview}
                onRemove={(file) => handleRemove(file, "thumbnail")}
                fileList={fileListThumbnail}
              >
                {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="Ảnh Slider"
              name="slider"
              rules={[{ required: true, message: "Vui lòng upload slider!" }]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                multiple={true}
                customRequest={(options) => handleUploadFile(options, "slider")}
                beforeUpload={beforeUpload}
                onChange={(info) => handleChange(info, "slider")}
                onPreview={handlePreview}
                onRemove={(file) => handleRemove(file, "slider")}
                fileList={fileListSlider}
              >
                {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateBook;
