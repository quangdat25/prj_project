import {
  Button,
  Col,
  InputNumber,
  message,
  Modal,
  Rate,
  Row,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { TiMinusOutline, TiPlusOutline } from "react-icons/ti";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { getBookIdAPI } from "services/api";
import { useCurrentApp } from "components/context/app.context";

const { Title, Text } = Typography;
interface IProps {
  currentBook: IBookTable | null;
}
type UserAction = "MINUS" | "PLUS";
const BookDetail = (props: IProps) => {
  const { currentBook } = props;
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const refGallery = useRef<ImageGallery>(null);
  const { carts, setCart } = useCurrentApp();

  const [imageGallery, setImageGallery] = useState<
    {
      original: string;
      thumbnail: string;
    }[]
  >([]);

  const handleClickMainImage = () => {
    const index = refGallery?.current?.getCurrentIndex?.() ?? 0;
    setCurrentIndex(index);
    setIsOpenModalGallery(true);
  };
  const handleChangeButton = (type: UserAction) => {
    if (type === "MINUS") {
      if (quantity - 1 <= 0) return;
      setQuantity(quantity - 1);
    }
    if (type === "PLUS" && currentBook) {
      if (quantity === +currentBook?.quantity) return;
      setQuantity(quantity + 1);
    }
  };
  const handleChangeInput = (value: string) => {
    if (!isNaN(+value)) {
      if (+value > 0 && currentBook && +value < +currentBook.quantity) {
        setQuantity(+value);
      }
    }
  };
  const handleAddtoCart = () => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && currentBook) {
      const carts = JSON.parse(cartStorage) as ICart[];
      let isExist = carts.findIndex((c) => c._id === currentBook?._id);
      if (isExist > -1) {
        carts[isExist].quantity = carts[isExist].quantity + quantity;
      } else {
        carts.push({
          _id: currentBook._id,
          quantity: quantity,
          detail: currentBook,
        });
      }
      localStorage.setItem("carts", JSON.stringify(carts));
      setCart(carts);
    } else {
      const data = [
        {
          _id: currentBook?._id,
          quantity: quantity,
          detail: currentBook!,
        },
      ];
      localStorage.setItem("carts", JSON.stringify(data));
      setCart(data);
    }
    message.success("Add complete");
  };
  console.log(carts);
  useEffect(() => {
    if (currentBook) {
      const images = [];

      // Ảnh chính
      if (currentBook.thumbnail) {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            currentBook.thumbnail
          }`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            currentBook.thumbnail
          }`,
        });
      }

      // Ảnh phụ (slider)
      if (Array.isArray(currentBook.slider)) {
        currentBook.slider.forEach((item) => {
          images.push({
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            thumbnail: `${
              import.meta.env.VITE_BACKEND_URL
            }/images/book/${item}`,
          });
        });
      }

      setImageGallery(images);
    }
  }, [currentBook]);

  return (
    <div
      style={{
        padding: 24,
        background: "#fff",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <Row gutter={[24, 24]}>
        {/* LEFT: Image Gallery */}
        <Col xs={24} md={10}>
          <div onClick={handleClickMainImage} style={{ cursor: "zoom-in" }}>
            <ImageGallery
              ref={refGallery}
              items={imageGallery}
              showPlayButton={false}
              showFullscreenButton={false}
              showNav={false}
              slideOnThumbnailOver
              thumbnailPosition="bottom"
            />
          </div>
        </Col>

        {/* RIGHT: Info */}
        <Col xs={24} md={14}>
          <Title level={4}>{currentBook?.mainText}</Title>
          <Text type="secondary">Tác giả: </Text>
          <Text strong>{currentBook?.author}</Text>
          <br />
          <Rate disabled defaultValue={5} style={{ marginTop: 8 }} />
          <Text style={{ marginLeft: 16 }}>Đã bán : {currentBook?.sold}</Text>

          <div style={{ margin: "24px 0" }}>
            <Title level={2} type="danger">
              {currentBook?.price.toLocaleString()} ₫
            </Title>
          </div>

          <div style={{ marginBottom: 12 }}>
            <Text strong>Vận Chuyển:</Text>{" "}
            <Text style={{ marginLeft: 8 }}>Ship</Text>
          </div>

          <div style={{ marginBottom: 12 }}>
            <Text strong>Số Lượng:</Text>{" "}
            <button onClick={() => handleChangeButton("MINUS")}>
              <TiMinusOutline />
            </button>
            <input
              type="number"
              onChange={(e) => handleChangeInput(e.target.value)}
              value={quantity}
            ></input>
            <button onClick={() => handleChangeButton("PLUS")}>
              <TiPlusOutline />
            </button>
          </div>

          <div style={{ marginTop: 24 }}>
            <Button
              type="default"
              danger
              size="large"
              style={{ marginRight: 12 }}
              icon={<span className="cart-icon">🛒</span>}
              onClick={() => handleAddtoCart()}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button type="primary" size="large">
              Mua ngay
            </Button>
          </div>
        </Col>
      </Row>

      {/* Fullscreen Modal Gallery */}
      <Modal
        open={isOpenModalGallery}
        onCancel={() => setIsOpenModalGallery(false)}
        footer={null}
        width={900}
        style={{ top: 20 }}
      >
        <ImageGallery
          items={imageGallery}
          startIndex={currentIndex}
          showThumbnails
          showPlayButton={false}
          showFullscreenButton={false}
        />
      </Modal>
    </div>
  );
};

export default BookDetail;
