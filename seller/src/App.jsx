import { useContext } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { AppContext } from "./Context/AppContext";
import Footer from "./components/Footer";
import IsApproved from "./pages/IsApproved";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LoadingAnimation from "./components/Loading";
import EmailVerify from "./pages/EmailVerify";
const App = () => {
  const { sellerLoggedIn, sellerData } = useContext(AppContext);

  if (!sellerLoggedIn) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify" element={<EmailVerify />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  if (!sellerData) {
    return <LoadingAnimation />;
  }

  if (sellerData.status === "pending" || sellerData.status === "rejected") {
    return <IsApproved />;
  }

  // Normal app
  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      <Navbar />
      <hr />
      <div className="flex w-full">
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/store" element={<Profile />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
