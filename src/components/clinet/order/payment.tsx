import { useCurrentApp } from "components/context/app.context";
import { useEffect, useState } from "react";
import {
  InputNumber,
  Button,
  Image,
  Row,
  Col,
  message,
  Form,
  Radio,
  Input,
  notification,
} from "antd";
import "styles/order.scss";
import { createOrderAPI } from "services/api";

interface IProps {
  setCurrentStep: (v: number) => void;
}

type UserMethod = "COD" | "BANKING";
type FieldType = {
  fullName: string;
  phone: string;
  address: string;
  method: UserMethod;
};

const Payment = (props: IProps) => {
  const { setCurrentStep } = props;
  const { carts, setCart, user } = useCurrentApp();
  const [form] = Form.useForm();
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleNextStep = () => {
    if (!carts?.length) {
      message.error("Don't have product");
      return;
    }
    setCurrentStep(2);
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        phone: user.phone,
        method: "COD",
      });
    }
  }, [user]);

  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.forEach((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const handlePlaceOrder: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, address, method, phone } = values;
    const detail = carts.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      bookName: item.detail.mainText,
    }));
    setIsLoading(true);
    const res = await createOrderAPI(
      fullName,
      address,
      phone,
      totalPrice,
      method,
      detail
    );
    if (res?.data) {
      localStorage.removeItem("carts");
      setCart([]);
      message.success("Complete");
      setCurrentStep(2);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
    setIsLoading(false);
  };

  const handleRemoveBook = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((item) => item._id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      setCart(newCarts);
    }
  };

  const handleChangeInput = (value: number, book: IBookTable) => {
    if (!value || +value < 1) return;
    if (!isNaN(+value)) {
      const cartStorage = localStorage.getItem("carts");
      if (cartStorage && book) {
        const carts = JSON.parse(cartStorage) as ICart[];
        const isExist = carts.findIndex((c) => c._id === book._id);
        if (isExist > -1) {
          carts[isExist].quantity = +value;
        }
        localStorage.setItem("carts", JSON.stringify(carts));
        setCart(carts);
      }
    }
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={18} xs={24}>
            {carts?.map((item, index) => {
              const currentBookPrice = item?.detail?.price ?? 0;
              const subtotal = currentBookPrice * item.quantity;

              return (
                <div
                  className="order-book"
                  key={index}
                  style={{
                    marginBottom: "20px",
                    background: "#fff",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <Row gutter={16} align="middle">
                    <Col span={4}>
                      <Image
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                          item.detail.thumbnail
                        }`}
                        width={80}
                        alt={item.detail.mainText}
                      />
                    </Col>
                    <Col span={8}>
                      <div>
                        <div style={{ fontWeight: "bold" }}>
                          {item.detail.mainText}
                        </div>
                        <div>{currentBookPrice.toLocaleString()} đ</div>
                      </div>
                    </Col>
                    <Col span={4}>
                      <InputNumber
                        min={1}
                        max={item.detail.quantity}
                        value={item.quantity}
                        onChange={(value) =>
                          handleChangeInput(value, item.detail)
                        }
                        style={{ width: "80px" }}
                      />
                    </Col>
                    <Col span={4}>
                      <div>Tổng: {subtotal.toLocaleString()} đ</div>
                    </Col>
                    <Col span={4}>
                      <Button
                        type="link"
                        onClick={() => handleRemoveBook(item._id)}
                        style={{ color: "#ff4d4f" }}
                      >
                        Xóa
                      </Button>
                    </Col>
                  </Row>
                  <br />
                </div>
              );
            })}
            <div
              style={{ cursor: "pointer" }}
              onClick={() => props.setCurrentStep(0)}
            >
              <h2>Return</h2>
            </div>
          </Col>
          <Col
            md={6}
            xs={24}
            style={{ background: "#fff", padding: "10px", borderRadius: "5px" }}
          >
            <Form
              form={form}
              name="payment-form"
              onFinish={handlePlaceOrder}
              autoComplete="off"
              layout="vertical"
            >
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                Thông tin thanh toán
              </div>
              <Form.Item<FieldType>
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item<FieldType>
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item<FieldType>
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
              <Form.Item<FieldType>
                label="Phương thức thanh toán"
                name="method"
                rules={[
                  { required: true, message: "Vui lòng chọn phương thức!" },
                ]}
              >
                <Radio.Group>
                  <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                  <Radio value="BANKING">Chuyển khoản ngân hàng</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "20px",
                    margin: "10px 0",
                  }}
                >
                  Tổng tiền: {totalPrice.toLocaleString()} đ
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                >
                  Đặt Hàng ({carts?.length || 0})
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Payment;
