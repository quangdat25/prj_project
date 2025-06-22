import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Register from "./pages/cilent/auth/register.tsx";
import Login from "./pages/cilent/auth/login.tsx";
import { App, ConfigProvider } from "antd"; // Ant Design App Provider

import { AppProvider } from "components/context/app.context.tsx";
import Layout from "layout";
import Homepage from "pages/cilent/home.tsx";
import Checkout from "pages/cilent/checkout.tsx";
import Admin from "pages/admin/adminpage.tsx";
import ProtectedRoute from "components/auth/index.tsx";
import ManageBookPage from "pages/admin/manage.book.tsx";
import ManageOrderPage from "pages/admin/manage.order.tsx";
import ManageusePage from "pages/admin/manage.use.tsx";
import DashBoardPage from "pages/admin/dashboard.tsx";
import enUS from "antd/locale/en_US";
import LayoutAdmin from "components/layout/layout.admin.tsx";
import Bookpage from "pages/cilent/book.tsx";
import OrderPage from "pages/cilent/auth/order.tsx";
import Payment from "components/clinet/order/payment.tsx";
import CompleteOrder from "components/clinet/order/complete.order.tsx";
import History from "components/clinet/order/history.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, // 👉 khi truy cập "/" sẽ render Homepage
        element: <Homepage />,
      },
      {
        path: "/book/:id",
        element: <Bookpage />,
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment",
        element: (
          <ProtectedRoute>
            <Payment />,
          </ProtectedRoute>
        ),
      },
      {
        path: "last",
        element: <CompleteOrder />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        ),
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // /admin
        element: <DashBoardPage />,
      },
      {
        path: "book", // /admin/book
        element: <ManageBookPage />,
      },
      {
        path: "order", // /admin/order
        element: <ManageOrderPage />,
      },
      {
        path: "user", // /admin/user
        element: <ManageusePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>
);
