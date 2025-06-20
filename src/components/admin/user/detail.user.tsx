import React from "react";
import { Drawer, Descriptions, Image, Tag } from "antd";

type DetailUserProps = {
  dataViewDetail: IUserTable | null;
  setOpenDetail: (open: boolean) => void;
  openDetail: boolean;
  setDataViewDetail: (data: IUserTable | null) => void;
};

const DetailUser: React.FC<DetailUserProps> = ({
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
      title="Chức năng xem chi tiết"
      width={700}
      onClose={onClose}
      open={openDetail}
    >
      {dataViewDetail ? (
        <Descriptions title="Thông tin user" bordered column={2}>
          <Descriptions.Item label="Id" span={2} copyable>
            {dataViewDetail._id}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {dataViewDetail.email}
          </Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">
            {dataViewDetail.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={dataViewDetail.role === "ADMIN" ? "red" : "blue"}>
              {dataViewDetail.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {dataViewDetail.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Avatar">
            <Image
              src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                dataViewDetail.avatar
              }`}
              width={80}
              height={80}
              style={{ objectFit: "cover", borderRadius: "50%" }}
              preview
            />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(dataViewDetail.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(dataViewDetail.updatedAt).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có user nào được chọn</p>
      )}
    </Drawer>
  );
};

export default DetailUser;
