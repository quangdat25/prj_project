import { useCurrentApp } from "components/context/app.context";
import AppHeader from "components/layout/app.header";
import { useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import { fetchAccountAPI } from "services/api";
import { Outlet } from "react-router-dom"; // Import Outlet

function Layout() {
  const { setUser, isAppLoading, setIsAppLoading, setIsAuthenticated } =
    useCurrentApp();

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res.data) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      setIsAppLoading(false);
    };
    fetchAccount();
  }, []);

  return (
    <>
      {isAppLoading === false ? (
        <div>
          <AppHeader />
          {/* Thêm Outlet vào đây để các route con được render */}
          <main>
            {" "}
            {/* Nên bọc Outlet trong thẻ semantic như <main> */}
            <Outlet />
          </main>
        </div>
      ) : (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <PacmanLoader size={50} color="#36D7B7" />
        </div>
      )}
    </>
  );
}

export default Layout;
