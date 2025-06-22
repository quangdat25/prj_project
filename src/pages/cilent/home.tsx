import type { TabsProps } from "antd";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { IoReloadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { getBookAPI, getBookcategory } from "services/api";

type FieldType = {
  range: {
    from: number;
    to: number;
  };
  category: string[];
};

const items: TabsProps["items"] = [
  { key: "sort=-sold", label: "All", children: <></> },
  { key: "sort=-updatedAt", label: "New", children: <></> },
  { key: "sort=-price", label: "High to low", children: <></> },
  { key: "sort=price", label: "Low to high", children: <></> },
];

const Homepage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listBook, setListbook] = useState<IBookTable[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [listCategory, setListcategory] = useState<
    { label: string; value: string }[]
  >([]);
  const [sortQuery, setSortquery] = useState<string>("sort=-sold");
  const [filter, setFilter] = useState<string>("");
  const [form] = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getBookcategory();
      if (res && res.data) {
        const d = res.data.map((item) => ({ label: item, value: item }));
        setListcategory(d);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    fetchBook();
  }, [sortQuery, filter, current, pageSize]);

  const fetchBook = async () => {
    let query = `current=${current}&pageSize=${pageSize}`;
    if (sortQuery) query += `&${sortQuery}`;
    if (filter) query += `&${filter}`;

    const res = await getBookAPI(query);
    if (res && res.data) {
      setListbook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleOnchangePage = ({
    current,
    pageSize,
  }: {
    current: number;
    pageSize: number;
  }) => {
    setCurrent(current);
    if (pageSize !== pageSize) {
      setPageSize(pageSize);
      setCurrent(1);
    }
  };

  const onFinish = async (values: FieldType) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values.range.from}&price<=${values.range.to}`;
      if (values.category?.length) {
        const cate = values.category.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  };

  const handleChangeFilter = (changedValue: any, values: any) => {
    if (changedValue.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`category=${f}`);
      } else {
        setFilter("");
      }
    }
  };

  return (
    <div style={{ display: "flex", padding: 20 }}>
      {/* Sidebar Filter */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 16,
          width: 250,
          marginRight: 20,
        }}
      >
        <IoReloadOutline
          title="Reset"
          style={{ cursor: "pointer", fontSize: 20 }}
          onClick={() => {
            form.resetFields();
            setFilter("");
          }}
        />
        <p>List</p>

        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={(changedValue, values) =>
            handleChangeFilter(changedValue, values)
          }
          layout="vertical"
        >
          {/* Category Filter */}
          <Form.Item name="category">
            <Checkbox.Group>
              <Row>
                {listCategory.map((item, index) => (
                  <Col span={24} key={index}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <hr />
          <p>Price</p>

          {/* Price Range Filter */}
          <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
            <Row gutter={[10, 10]} style={{ width: "100%" }}>
              <Col span={11}>
                <Form.Item name={["range", "from"]} noStyle>
                  <InputNumber
                    min={0}
                    placeholder="đ TỪ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={2}>-</Col>
              <Col span={11}>
                <Form.Item name={["range", "to"]} noStyle>
                  <InputNumber
                    min={0}
                    placeholder="đ ĐẾN"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Button type="primary" block htmlType="submit">
            Áp dụng
          </Button>
        </Form>

        <hr />
        <br />
        <p>Rate</p>
        {[1, 2, 3, 4, 5].map((val) => (
          <div key={val}>
            <Rate disabled defaultValue={val} />
          </div>
        ))}
      </div>

      {/* Book List */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            border: "1px solid #ccc",
            padding: 10,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Tabs
            defaultActiveKey="sort=-sold"
            items={items}
            onChange={(key) => setSortquery(key)}
          />
        </div>

        <Row gutter={[16, 16]}>
          {listBook.map((prod, index) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={index}
              onClick={() => navigate(`/book/${prod._id}`)}
            >
              <Card
                hoverable
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
                cover={
                  <img
                    alt="thumbnail"
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                      prod.thumbnail
                    }`}
                    style={{ height: 200, objectFit: "contain", padding: 16 }}
                  />
                }
              >
                <Card.Meta
                  title={prod.mainText}
                  description={
                    <>
                      <p>
                        <strong>{prod.price.toLocaleString()} VND</strong>
                      </p>
                      <p>Sold: {prod.sold}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        <div
          style={{ marginTop: 24, display: "flex", justifyContent: "center" }}
        >
          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            responsive
            onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
