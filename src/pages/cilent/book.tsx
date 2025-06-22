import { notification } from "antd";
import BookDetail from "components/clinet/book/book.detail";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookIdAPI } from "services/api";

const Bookpage = () => {
  let { id } = useParams();
  const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
  useEffect(() => {
    if (id) {
      const getData = async () => {
        const res = await getBookIdAPI(id);
        if (res && res.data) {
          setCurrentBook(res.data);
        } else {
          notification.error({
            message: "Co loi roi",
            description: res.message,
          });
        }
      };
      getData();
    }
  }, [id]);
  return (
    <div>
      <BookDetail currentBook={currentBook} />
    </div>
  );
};
export default Bookpage;
