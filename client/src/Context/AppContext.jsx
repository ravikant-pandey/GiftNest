import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { products } from "../assets/frontend_assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "₹";
  const delivery_fees = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("accessToken") || "";
  });

  const [userData, setUserData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [cartItems, setCartItems] = useState({});
  // const [products, setProducts] = useState([]);

  const addToCart = async (itemId) => {
    // if (!size) {
    //   return toast.error("Select Size");
    // }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId]) {
        cartData[itemId] += 1;
      } else {
        cartData[itemId] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId] = 1;
    }
    setCartItems(cartData);

    if (isLoggedIn) {
      try {
        await axios.post(backendUrl + "/cart/add", { itemId });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (let item in cartItems) {
      try {
        if (cartItems[item] > 0) {
          totalCount += cartItems[item];
        }
      } catch (error) {}
    }
    return totalCount;
  };

  //  USER
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/current-user`, {
        withCredentials: true,
      });

      if (data.success) setUserData(data.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (isLoggedIn && token) getUserData();
  }, [isLoggedIn]);

  useEffect(() => {}, [cartItems]);

  const getCartAmount = () => {
    let amount = 0;
    for (let item in cartItems) {
      try {
        if (cartItems[item] > 0) {
          const product = products.find((product) => product._id === item);
          amount += cartItems[item] * product.price;
        }
      } catch (error) {}
    }
    return amount;
  };

  const value = {
    products,
    currency,
    delivery_fees,
    backendUrl,

    // user
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,

    visible,
    setVisible,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    token,
    setToken,
    getCartAmount,
    deliveryFee: delivery_fees,
    navigate: props.navigate,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
