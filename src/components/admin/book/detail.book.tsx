import React, { useEffect, useState } from "react";
import { Drawer, Descriptions, Image, Upload, UploadFile, GetProp } from "antd";
import type { UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
type DetailBookProps = {
  detailBook: IBookTable | null;
  setOpenDetail: (open: boolean) => void;
  openDetail: boolean;
  setDetailBook: (data: IBookTable | null) => void;
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const DetailBook: React.FC<DetailBookProps> = ({
  openDetail,
  setOpenDetail,
  detailBook,
  setDetailBook,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    if (detailBook) {
      let imgThumbail: any = {},
        imgSlider: UploadFile[] = [];
      if (detailBook.thumbnail) {
        imgThumbail = {
          uid: uuidv4(),
          name: detailBook.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            detailBook.thumbnail
          } `,
        };
      }
      if (detailBook.slider && detailBook.slider.length > 0) {
        detailBook.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbail, ...imgSlider]);
    }
  }, [detailBook]);
  const onClose = () => {
    setOpenDetail(false);
    setDetailBook(null);
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Drawer
      title="Thông tin Book"
      width={700}
      onClose={onClose}
      open={openDetail}
    >
      {detailBook ? (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Id" span={2} copyable>
            {detailBook._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên sách">
            {detailBook.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {detailBook.author}
          </Descriptions.Item>
          <Descriptions.Item label="Giá tiền">
            {detailBook.price.toLocaleString()} đ
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại">
            {detailBook.category}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(detailBook.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(detailBook.updatedAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Ảnh Books" span={2}>
            <Image.PreviewGroup>
              {fileList.map((file) => (
                <Image
                  key={file.uid}
                  width={100}
                  src={file.url}
                  alt={file.name}
                  style={{ marginRight: 8 }}
                />
              ))}
            </Image.PreviewGroup>
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có sách nào được chọn</p>
      )}
    </Drawer>
  );
};

export default DetailBook;
