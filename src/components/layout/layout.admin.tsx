import React, { useState } from "react";
import {
  AppstoreOutlined,
  ExceptionOutlined,
  HeartTwoTone,
  TeamOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, Avatar } from "antd";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
import type { MenuProps } from "antd";
import { logoutAccountAPI } from "services/api"; // Đảm bảo đường dẫn này đúng

type MenuItem = Required<MenuProps>["items"][number];

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const { user, setUser, setIsAuthenticated, isAuthenticated } =
    useCurrentApp();

  const handleLogout = async () => {
    const res = await logoutAccountAPI();
    if (res.data) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
    console.log("checkkk", res);
  };
  // Dòng này đã bị đóng ngoặc sai vị trí ở code cũ của bạn
  // Bạn đã đóng hàm handleLogout và sau đó đóng cả LayoutAdmin luôn.

  const items: MenuItem[] = [
    {
      label: <Link to="/admin">Dashboard</Link>,
      key: "dashboard",
      icon: <AppstoreOutlined />,
    },
    {
      label: <span>Manage Users</span>,
      key: "user",
      icon: <UserOutlined />,
      children: [
        {
          label: <Link to="/admin/user">CRUD</Link>,
          key: "crud",
          icon: <TeamOutlined />,
        },
        // {
        //     label: 'Files1',
        //     key: 'file1',
        //     icon: <TeamOutlined />,
        // }
      ],
    },
    {
      label: <Link to="/admin/book">Manage Books</Link>,
      key: "book",
      icon: <ExceptionOutlined />,
    },
    {
      label: <Link to="/admin/order">Manage Orders</Link>,
      key: "order",
      icon: <DollarCircleOutlined />,
    },
  ];

  const itemsDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => alert("me")}>
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to={"/"}>Trang chủ</Link>,
      key: "home",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  // Đảm bảo rằng `user` không phải là null trước khi truy cập `user.avatar`
  const urlAvatar = user?.avatar
    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`
    : ""; // Hoặc một URL avatar mặc định

  if (isAuthenticated === false) {
    return <Outlet />;
  }

  return (
    <>
      <Layout style={{ minHeight: "100vh" }} className="layout-admin">
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div style={{ height: 32, margin: 16, textAlign: "center" }}>
            Admin
          </div>
          <Menu
            defaultSelectedKeys={[activeMenu]}
            mode="inline"
            items={items}
            onClick={(e) => setActiveMenu(e.key)}
          />
        </Sider>
        <Layout>
          <div
            className="admin-header"
            style={{
              height: "50px",
              borderBottom: "1px solid #ebebeb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 15px",
            }}
          >
            <span>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                }
              )}
            </span>
            <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar src={urlAvatar} />
                {user?.fullName}
              </Space>
            </Dropdown>
          </div>
          <Content style={{ padding: "15px" }}>
            <Outlet />
          </Content>
          <Footer style={{ padding: 0, textAlign: "center" }}>
            React Test Fresher &copy; Hỏi Dân IT - Made with <HeartTwoTone />
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default LayoutAdmin;
