import React from "react";
import { Drawer, Descriptions, Image } from "antd";

type DetailBookProps = {
  dataViewDetail: IBookTable | null;
  setOpenDetail: (open: boolean) => void;
  openDetail: boolean;
  setDataViewDetail: (data: IBookTable | null) => void;
};

const DetailUser: React.FC<DetailBookProps> = ({
  openDetail,
  setOpenDetail,
  dataViewDetail,
  setDataViewDetail,
}) => {
  const onClose = () => {
    setOpenDetail(false);
    setDataViewDetail(null);
  };

  return (
    <Drawer
      title="Thông tin Book"
      width={700}
      onClose={onClose}
      open={openDetail}
    >
      {dataViewDetail ? (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Id" span={2} copyable>
            {dataViewDetail._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên sách">
            {dataViewDetail.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {dataViewDetail.author}
          </Descriptions.Item>
          <Descriptions.Item label="Giá tiền">
            {dataViewDetail.price.toLocaleString()} đ
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại">
            {dataViewDetail.category}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(dataViewDetail.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(dataViewDetail.updatedAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Avatar">
            {" "}
            <Image.PreviewGroup
              preview={{
                onChange: (current, prev) =>
                  console.log(`current index: ${current}, prev index: ${prev}`),
              }}
            >
              <Image
                width={200}
                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              />
              <Image
                width={200}
                src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
              />
            </Image.PreviewGroup>
            fa
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có sách nào được chọn</p>
      )}
    </Drawer>
  );
};

export default DetailUser;
