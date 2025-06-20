import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import {
  Button,
  Space,
  Tag,
  Pagination,
  Popconfirm,
  message,
  notification,
} from "antd";
import { useRef, useState } from "react";
import { FAKE_DATA } from "./data";
import { deleteUserApi, getUsersAPI } from "services/api";
import { dateRangeValidate } from "services/helper";
import DetailUser from "./detail.user";
import CreateUser from "./create.user";
import UploadFile from "./data/upload.user";
import UpdateUser from "./update.user";

type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};
const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
  const [openUpload, setOpenUpload] = useState<boolean>(false);
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  const refreshTable = () => {
    actionRef.current?.reload();
  };
  const handleDelete = async (_id: string) => {
    setOpenDelete(true);
    const res = await deleteUserApi(_id);
    if (res && res.data) {
      message.success("Delete success");
      refreshTable();
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
    setOpenDelete(false);
  };
  const columns: ProColumns<IUserTable>[] = [
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
              setDataViewDetail(entity);
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
      title: "FullName",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
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
                setDataUpdate(entity);
                setOpenUpdateUser(true);
              }}
            />
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => handleDelete(entity._id)}
              okText="Yes"
              cancelText="No"
              okButtonP
              rops={{ loading: openDelete }}
            >
              <span style={{ cursor: "pointer", marginLeft: 20 }}>
                <DeleteTwoTone
                  twoToneColor="#ff4d4f"
                  style={{ cursor: "pointer" }}
                />
              </span>
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
          // console.log(params, sort, filter);
          let query = "";

          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.email) {
              query += `&email=${params.email}/i`;
            }
            if (params.fullName) {
              query += `&fullName=${params.fullName}/i`;
            }
            const CreateDateRange = dateRangeValidate(params.createdAtRange);
            if (CreateDateRange) {
              query += `&createdAt>=${params.createdAtRange[0]}&createdAt<=${params.createdAtRange[1]}`;
            }
          }
          query += `&sort=-createdAt`;
          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          }
          const res = await getUsersAPI(query);
          console.log(query);
          if (res.data) {
            setMeta(res.data.meta);
          }
          // console.log("check dâta", res.data);
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
            icon={<ImportOutlined />}
            onClick={() => {
              setOpenUpload(true);
            }}
            type="primary"
          >
            Import
          </Button>,
          <Button
            key="button"
            icon={<ExportOutlined />}
            onClick={() => {
              setOpenCreateUser(true);
            }}
            type="primary"
          >
            Export
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenCreateUser(true);
            }}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />
      <DetailUser
        openDetail={openDetail}
        setOpenDetail={setOpenDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <CreateUser
        openCreateUser={openCreateUser}
        setOpenCreateUser={setOpenCreateUser}
        refreshTable={refreshTable}
      />
      <UpdateUser
        openUpdateUser={openUpdateUser}
        setOpenUpdateUser={setOpenUpdateUser}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
      <UploadFile openUpload={openUpload} setOpenUpload={setOpenUpload} />
    </>
  );
};

export default TableUser;
