import { useContext, useEffect, useState } from "react";
import Title from "../components/Title/Title";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal/CartTotal";
import { AppContext } from "../context/AppContext";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(AppContext);

  const [cartData, setCartData] = useState([]);

  //  convert cart object → array
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const itemId in cartItems) {
        if (cartItems[itemId] > 0) {
          tempData.push({
            _id: itemId,
            quantity: cartItems[itemId],
          });
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id,
          );

          if (!productData) return null;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* Product Info */}
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20" src={productData.images[0]} />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.title}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <input
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
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
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="bin_icon"
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
              className="bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer active:bg-gray-700 rounded-2xl"
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
