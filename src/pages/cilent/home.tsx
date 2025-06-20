import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Pagination,
  Row,
  Tabs,
} from "antd";
import type { TabsProps } from "antd";
import { Checkbox } from "antd";
import { CheckboxOptionType, GetProp, Rate } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { getBookAPI, getBookcategory } from "services/api";
const onChange = (key: string) => {
  console.log(key);
};
const onChange1: GetProp<typeof Checkbox.Group, "onChange"> = (
  checkedValues
) => {
  console.log("checked = ", checkedValues);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "All",
    children: "Content of Tab Pane 1",
  },
  {
    key: "2",
    label: "New",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "High to low",
    children: "Content of Tab Pane 3",
  },
  {
    key: "4",
    label: "Low to high",
    children: "Content of Tab Pane 4",
  },
];

const Homepage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listBook, setListbook] = useState<IBookTable[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [filter, setFilter] = useState<{ label: string; value: string }[]>([]);
  const [sortQuery, setSortquery] = useState<string>("sort=-sold");
  const [form] = Form.useForm();
  useEffect(() => {
    const filTer = async () => {
      const res = await getBookcategory();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
        setFilter(d);
      }
    };
    filTer();
  }, []);
  useEffect(() => {
    fetchBook();
  }, [sortQuery, filter, current, pageSize]);
  const fetchBook = async () => {
    let query = "";
    query += `current=${current}&pageSize=${pageSize}`;
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    if (filter) {
      query += `&${filter}`;
    }
    const res = await getBookAPI(query);
    if (res && res.data) {
      setListbook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };
  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination && pagination.current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: 20,
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 16,
          width: 250,
          marginRight: 20,
        }}
      >
        <p>List</p>
        <div style={{ display: "block", marginBottom: 4 }}>
          <Checkbox.Group>
            <Row>
              {filter &&
                filter.map((item, index) => (
                  <Col span={24} key={index}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </Col>
                ))}
            </Row>
          </Checkbox.Group>
        </div>
        <hr />
        <p>Price</p>
        <InputNumber placeholder="From" />
        -____-
        <InputNumber placeholder="To" />
        <Button type="primary" block>
          Áp dụng
        </Button>
        <hr />
        <br />
        Rate
        <br />
        <Rate disabled defaultValue={1} />
        <br />
        <Rate disabled defaultValue={2} />
        <br />
        <Rate disabled defaultValue={3} />
        <br />
        <Rate disabled defaultValue={4} />
        <br />
        <Rate disabled defaultValue={5} />
      </div>
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
            defaultActiveKey="1"
            items={items}
            onChange={(key) => console.log(key)}
          />
        </div>
        <Row gutter={[16, 16]}>
          {listBook.map((prod, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
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
                      {/* <Rate disabled ={prod.category} /> */}
                      <p> Sold : {prod.sold}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}

          <br />
        </Row>
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "center",
          }}
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
