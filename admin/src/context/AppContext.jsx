import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [admin, setAdmin] = useState([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [sellers, setSellers] = useState([]);

  // Fetch Admin Session
  const fetchAdminData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/admin/current-admin`, {
        withCredentials: true,
      });

      if (data.success) {
        setAdmin(data.admin);
        setIsAdminLoggedIn(true);
        localStorage.setItem("isAdminLoggedIn", "true");
      }
    } catch (error) {
      // silent logout if session invalid
      setAdmin([]);
      setIsAdminLoggedIn(false);
      localStorage.removeItem("isAdminLoggedIn");
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchSellerData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/seller/seller-data`, {
        withCredentials: true,
      });
      if (data.success) {
        setSellers(data.sellers);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchSellerData();
    }
  }, [isAdminLoggedIn]);

  //  Auto login on refresh
  useEffect(() => {
    const adminLS = localStorage.getItem("isAdminLoggedIn");
    if (adminLS === "true") {
      fetchAdminData();
    } else {
      setAuthLoading(false);
    }
  }, []);

  const value = {
    backendUrl,
    admin,
    setAdmin,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    fetchAdminData,
    authLoading,
    sellers,
    setSellers,
    fetchSellerData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
