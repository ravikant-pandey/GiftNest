import { useContext } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import AllOrders from "./pages/AllOrders";

import Login from "./pages/Login";
import { AppContext } from "./context/AppContext";
import Store from "./pages/Store";
import ApproveStores from "./pages/ApproveStores";
import LoadingIndicator from "./components/Loading";
import Admin from "./pages/Admin";
const App = () => {
  const { isAdminLoggedIn, authLoading } = useContext(AppContext);
  const location = useLocation();

  // 🔄 Wait for auth check
  if (authLoading) return <LoadingIndicator />;

  // redirect root after login
  if (location.pathname === "/" && isAdminLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // ADMIN LAYOUT
  if (isAdminLoggedIn) {
    return (
      <div className="bg-[#F8F9FD]">
        <Navbar />

        <div className="flex">
          <Sidebar />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<AllOrders />} />
            <Route path="/approve-stores" element={<ApproveStores />} />
            <Route path="/stores" element={<Store />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
            <Route path="/admin-profile" element={<Admin />} />
          </Routes>
        </div>
      </div>
    );
  }

  // GUEST LAYOUT
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
