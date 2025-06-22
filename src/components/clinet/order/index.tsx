import { useCurrentApp } from "components/context/app.context";
import { useEffect, useState } from "react";
import { InputNumber, Button, Image, Row, Col, message } from "antd";
import "styles/order.scss";

interface IProps {
  setCurrentStep: (v: number) => void;
}

const OrderDetail = (props: IProps) => {
  const { setCurrentStep } = props;
  const { carts, setCart } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);

  const handleNextStep = () => {
    if (!carts?.length) {
      message.error("Don't have product");
      return;
    }
    setCurrentStep(1);
  };

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

  const handleRemoveBook = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((item) => item._id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      setCart(newCarts);
    }
  };

  const handleChangeQuantity = (value: number, book: IBookTable) => {
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

  const handleIncrease = (book: IBookTable) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && book) {
      const carts = JSON.parse(cartStorage) as ICart[];
      const isExist = carts.findIndex((c) => c._id === book._id);
      if (isExist > -1) {
        carts[isExist].quantity += 1;
        localStorage.setItem("carts", JSON.stringify(carts));
        setCart(carts);
      }
    }
  };

  const handleDecrease = (book: IBookTable) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && book) {
      const carts = JSON.parse(cartStorage) as ICart[];
      const isExist = carts.findIndex((c) => c._id === book._id);
      if (isExist > -1 && carts[isExist].quantity > 1) {
        carts[isExist].quantity -= 1;
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
                      <Row gutter={8} align="middle">
                        <Button
                          onClick={() => handleDecrease(item.detail)}
                          style={{ width: "30px" }}
                        >
                          -
                        </Button>
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) =>
                            handleChangeQuantity(value, item.detail)
                          }
                          style={{ width: "60px", textAlign: "center" }}
                        />
                        <Button
                          onClick={() => handleIncrease(item.detail)}
                          style={{ width: "30px" }}
                        >
                          +
                        </Button>
                      </Row>
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
                </div>
              );
            })}
          </Col>
          <Col
            md={6}
            xs={24}
            style={{ background: "#fff", padding: "10px", borderRadius: "5px" }}
          >
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>
              Tổng tiền
            </div>
            <div
              style={{ color: "#ff4d4f", fontSize: "20px", margin: "10px 0" }}
            >
              {totalPrice.toLocaleString()} đ
            </div>
            <Button
              type="primary"
              block
              style={{ background: "#ff4d4f", borderColor: "#ff4d4f" }}
              onClick={handleNextStep}
            >
              Mua Hàng ({carts?.length || 0})
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrderDetail;
