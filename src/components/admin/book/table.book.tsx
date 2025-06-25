import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import {
  Button,
  Space,
  Tag,
  Pagination,
  message,
  notification,
  Popconfirm,
} from "antd";
import { useRef, useState } from "react";

import { deleteBookAPI, getBookAPI } from "services/api";
import { dateRangeValidate } from "services/helper";
import DetailBook from "../book/detail.book";
import Addnewbook from "./add.book";
import UpdateBook from "./update.book";

type TSearch = {
  _id: string;
  thumbnail: string;
  slider: string[];
  mainText: string;
  author: string;
  price: number;
  sold: number;
  quantity: number;
  category: string;
  updatedAt: Date;
  createdAt: string;
  createdAtRange: string;
};
const TableBook = () => {
  const actionRef = useRef<ActionType>();
  const [detailBook, setDetailBook] = useState<IBookTable | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openComplete, setOpenComplete] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);
  const refreshBook = () => {
    actionRef.current?.reload();
  };
  const handleDelete = async (_id: string) => {
    setOpenComplete(true);
    const res = await deleteBookAPI(_id);
    if (res && res.data) {
      message.success("delete succes");
      refreshBook();
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
    setOpenComplete(false);
  };
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const columns: ProColumns<IBookTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Id",
      dataIndex: "_id",

      render(dom, entity, index, action, schema) {
        return (
          <a
            onClick={(e) => {
              e.preventDefault();
              setDetailBook(entity);
              setOpenDetail(true);
            }}
            href="#"
          >
            {entity._id}
          </a>
        );
      },
      hideInSearch: true,
    },
    {
      title: "Book",
      dataIndex: "mainText",
    },
    {
      title: "Category",
      dataIndex: "category",
      // copyable: true,
    },
    {
      title: "Price",
      dataIndex: "price",
    },

    {
      title: "CreateAt",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "CreateAt",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
    },

    {
      title: "Action",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", marginRight: 15 }}
              onClick={() => {
                setOpenUpdate(true);
                setDataUpdate(entity);
              }}
            />

            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => handleDelete(entity._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: openComplete }}
            >
              <DeleteTwoTone
                twoToneColor="#ff4d4f"
                style={{ cursor: "pointer" }}
              />
            </Popconfirm>
          </>
        );
      },
      hideInSearch: true,
    },
  ];

  return (
    <>
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(params, sort, filter);
          let query = "";

          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.mainText) {
              query += `&mainText=${params.mainText}/i`;
            }
            if (params.category) {
              query += `&category=${params.category}/i`;
            }
            const CreateDateRange = dateRangeValidate(params.createdAtRange);
            if (CreateDateRange) {
              query += `&createdAt>=${params.createdAtRange[0]}&createdAt<=${params.createdAtRange[1]}`;
            }
          }
          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          }
          const res = await getBookAPI(query);
          if (res.data) {
            setMeta(res.data.meta);
          }
          console.log("check dâta", res.data);
          return {
            data: res.data?.result,
            page: 1,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} of {total} items
              </div>
            );
          },
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenAdd(true);
            }}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />
      <DetailBook
        detailBook={detailBook}
        setDetailBook={setDetailBook}
        openDetail={openDetail}
        setOpenDetail={setOpenDetail}
      />
      <Addnewbook
        openAdd={openAdd}
        setOpenAdd={setOpenAdd}
        refreshBook={refreshBook}
      />
      <UpdateBook
        openUpdate={openUpdate}
        setOpenUpdate={setOpenUpdate}
        refreshBook={refreshBook}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableBook;
