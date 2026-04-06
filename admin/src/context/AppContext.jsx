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
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);

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

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/product/products`, {
        withCredentials: true,
      });
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const fetchOrderData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/order/orders`, {
        withCredentials: true,
      });
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {}
  };

  const fetchRefundData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/refund/refunds`, {
        withCredentials: true,
      });
      if (data.success) {
        setRefunds(data.refunds);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // automatically fetch
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchProductData();
      fetchOrderData();
      fetchRefundData();
    }
  }, [isAdminLoggedIn]);

  // Fetch Seller Session

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
    products,
    setProducts,
    fetchProductData,
    orders,
    setOrders,
    fetchOrderData,
    refunds,
    setRefunds,
    fetchRefundData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
