import { useContext, useEffect, useState } from "react";
import Title from "../Components/Title/Title";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../Components/CartTotal/CartTotal";
import { AppContext } from "../Context/AppContext";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(AppContext);

  const [cartData, setCartData] = useState([]);

  // Convert cart array → UI usable data
  useEffect(() => {
    // ⭐ when cart empty, clear UI
    if (cartItems.length === 0) {
      setCartData([]);
      return;
    }

    if (products.length > 0) {
      const tempData = cartItems.map((item) => {
        const productData = products.find(
          (product) => product._id === item.productId,
        );

        if (!productData) return null;

        return {
          ...item,
          productData,
        };
      });

      setCartData(tempData.filter(Boolean));
    }
  }, [cartItems, products]);


  {
    cartData.length === 0 && (
      <p className="text-center text-gray-500 mt-10">Your cart is empty 🛒</p>
    );
  }

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const { productData } = item;

          return (
            <div
              key={item._id}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* Product Info */}
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.images[0]}
                  alt={productData.title}
                />

                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.title}
                  </p>

                  <p className="mt-1">
                    {currency}
                    {productData.price}
                  </p>

                  {/* Show Custom Text */}
                  {item.customeText && (
                    <p className="text-sm text-gray-500 mt-1">
                      Custom Text: {item.customeText}
                    </p>
                  )}

                  {/* Show Custom Image */}
                  {item.customeImage && (
                    <img
                      src={item.customeImage}
                      alt="Custom"
                      className="w-14 mt-2 border rounded"
                    />
                  )}
                </div>
              </div>

              {/* Quantity */}
              <input
                className="border max-w-12 px-2 py-1"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? updateQuantity(item._id, 0)
                    : updateQuantity(item._id, Number(e.target.value))
                }
              />

              {/* Delete */}
              <img
                className="w-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="delete"
                onClick={() => updateQuantity(item._id, 0)}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />

          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3 rounded-2xl"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
