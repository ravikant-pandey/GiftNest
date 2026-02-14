import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "₹";
  const delivery_fees = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [sellerLoggedIn, setSellerLoggedIn] = useState(
    localStorage.getItem("sellerLoggedIn") === "true",
  );
  const [productList, setProductList] = useState([]);
  const [sellerData, setSellerData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  //  SELLER
  const getSellerData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/seller/current-seller`, {
        withCredentials: true,
      });

      if (data.success) {
        setSellerData(data.seller);
        setSellerLoggedIn(true); // ⭐ important
        localStorage.setItem("sellerLoggedIn", "true");
      } else {
        setSellerLoggedIn(false);
        setSellerData(null);
        localStorage.removeItem("sellerLoggedIn");
      }
    } catch (error) {
      setSellerLoggedIn(false); // ⭐ important
      setSellerData(null);
      localStorage.removeItem("sellerLoggedIn");
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/product/seller-product", {
        withCredentials: true,
      });
      if (data.success) {
        setProductList(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAllOrders = async () => {
    if (!sellerLoggedIn) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/order/all-orders`, {
        withCredentials: true,
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  //  auto-fetch products when token changes (refresh login)
  useEffect(() => {
    if (sellerLoggedIn) {
      fetchAllOrders();
    }
  }, [sellerLoggedIn]);

  useEffect(() => {
    if (sellerLoggedIn) {
      fetchProducts();
    }
  }, [sellerLoggedIn]);

  //  auto-fetch seller when token changes (refresh login)
  useEffect(() => {
    if (sellerLoggedIn) {
      getSellerData();
    }
  }, [sellerLoggedIn]);

  const value = {
    currency,
    delivery_fees,
    backendUrl,

    // seller
    sellerData,
    setSellerData,
    getSellerData,
    sellerLoggedIn,
    setSellerLoggedIn,

    // product
    productList,
    setProductList,
    fetchProducts,
    loading,

    // order
    orders,
    setOrders,
    fetchAllOrders,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
