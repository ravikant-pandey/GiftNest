import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  // CONSTANTS
  const currency = "₹";
  const delivery_fees = 99;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("accessToken") || "";
  });

  const [userData, setUserData] = useState(null);

  // APP STATE
  const [visible, setVisible] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);

  // PRODUCTS
  const getProducts = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/product/products");
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!products.length) getProducts();
  }, []);

  // CART
  const addToCart = async (itemId) => {
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
    toast.success("Item added to cart");
    setCartItems(cartData);

    if (isLoggedIn) {
      try {
        await axios.post(
          backendUrl + "/cart/add-to-cart",
          { productId: itemId },
          {
            withCredentials: true,
          },
        );
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
      } catch (error) {
        toast.error(error.message);
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    if (isLoggedIn) {
      try {
        await axios.put(
          backendUrl + "/cart/update-cart",
          { productId: itemId, quantity: quantity },
          {
            withCredentials: true,
          },
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/cart/cart-data", {
        withCredentials: true,
      });
      if (data.success) {
        setCartItems(data.cart);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) getCartData();
  }, [isLoggedIn]);

  const getCartAmount = () => {
    let amount = 0;

    for (let itemId in cartItems) {
      try {
        const quantity = cartItems[itemId];

        if (quantity > 0) {
          const product = products.find((p) => p._id === itemId);
          if (product) {
            amount += quantity * product.price;
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    return amount;
  };

  // USER
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

  // CONTEXT VALUE
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

    // ui
    visible,
    setVisible,

    // cart
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    getCartAmount,
    updateQuantity,

    // misc
    token,
    setToken,
    getProducts,
    delivery_fees,
    navigate,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
