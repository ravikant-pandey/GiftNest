import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  // CONSTANTS
  const currency = "₹";
  const delivery_fees = 99;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );

  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");

  const [userData, setUserData] = useState(null);

  // APP STATE
  const [visible, setVisible] = useState(false);

  //  Cart is ARRAY now (important)
  const [cartItems, setCartItems] = useState([]);

  const [products, setProducts] = useState([]);

  // FETCH PRODUCTS
  const getProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/product/products`);
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // FETCH CART FROM BACKEND
  const getCartData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/cart/cart-data`, {
        withCredentials: true,
      });

      if (data.success) {
        setCartItems(data.cart); // backend is source of truth
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getCartData();
    }
  }, [isLoggedIn]);

  // ADD TO CART
  const addToCart = async (productId, text = "", image = "") => {
    if (!isLoggedIn) {
      toast.error("Please login first");
      return navigate("/login");
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/cart/add-to-cart`,
        {
          productId,
          customeText: text,
          customeImage: image,
        },
        { withCredentials: true },
      );

      if (data.success) {
        setCartItems(data.cart); // always sync with backend
        toast.success("Item added to cart");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // UPDATE CART QUANTITY
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/cart/update-cart`,
        { cartItemId, quantity },
        { withCredentials: true },
      );

      if (data.success) {
        setCartItems(data.cart);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // CART COUNT
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  

  // CART TOTAL AMOUNT
  const getCartAmount = () => {
    let amount = 0;

    cartItems.forEach((item) => {
      const product = products.find((p) => p._id === item.productId);

      if (product) {
        amount += item.quantity * product.price;
      }
    });

    return amount;
  };

  // FETCH USER DATA
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/current-user`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      getUserData();
    }
  }, [isLoggedIn, token]);

  // CONTEXT VALUE
  const value = {
    // product
    products,
    getProducts,

    // currency
    currency,
    delivery_fees,

    // user
    isLoggedIn,
    setIsLoggedIn,
    token,
    setToken,
    userData,
    setUserData,
    getUserData,

    // UI
    visible,
    setVisible,

    // cart
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,

    // misc
    backendUrl,
    navigate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
