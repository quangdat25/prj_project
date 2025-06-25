import { Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { getOrderHistory } from "services/api";
import dayjs from "dayjs";

const { Title } = Typography;

const History = () => {
  const [data, setData] = useState<IHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const res = await getOrderHistory();
    if (res?.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (createdAt: Date) => dayjs(createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      render: (total: number) => `${total.toLocaleString()} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: () => <Tag color="green">Thành công</Tag>, // bạn có thể thay thế bằng status thực tế nếu có
    },
    {
      title: "Chi tiết",
      dataIndex: "_id",
      render: (id: string) => (
        // <a href={`/history/${id}`} style={{ color: "#1677ff" }}>

        <div>Xem chi tiết</div>
        // </a>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <Title level={4} style={{ color: "#5f27cd" }}>
        Lịch sử mua hàng
      </Title>
      <Table
        rowKey="_id"
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default History;
