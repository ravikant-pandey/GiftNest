import { useContext, useEffect, useState } from "react";
import Title from "../Components/Title/Title";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, backendUrl, isLoggedIn } = useContext(AppContext);
  const [orderData, setOrderData] = useState([]);
  const loadOrderData = async () => {
    try {
      if (!isLoggedIn) return;

      const { data } = await axios.get(backendUrl + "/order/my-orders", {
        withCredentials: true,
      });

      // ⭐ API safety check
      if (!data?.success || !Array.isArray(data.orders)) {
        setOrderData([]);
        return;
      }

      const formattedOrders = [];

      data.orders.forEach((order) => {
        // ⭐ Stripe race condition guard
        if (!order || !Array.isArray(order.product)) return;

        order.product.forEach((item) => {
          // ⭐ extra safety (very important)
          if (!item?.productId) return;

          formattedOrders.push({
            ...item,
            status: order.status,
            paymentMethod: order.paymentMethod,
            date: order.createdAt,
          });
        });
      });

      setOrderData(formattedOrders);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [isLoggedIn]);

  // empty state
  if (!orderData.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg text-center">
          No orders placed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orderData.map((item) => {
          const product = item.productId; // populated product

          // product image
          const imageToShow =
            product?.images?.[0] || "https://via.placeholder.com/150";

          const totalPrice = (product?.price || 0) * item.quantity;

          return (
            <div
              key={item._id}
              className="py-4 border-t border-b text-gray-700 
              flex flex-col md:flex-row md:items-center 
              md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                {/* Product Image */}
                <img
                  className="w-16 sm:w-20 object-cover rounded"
                  src={imageToShow}
                  alt="product"
                />

                <div>
                  {/* Title */}
                  <p className="sm:text-base font-medium">
                    {product?.title || "Product"}
                  </p>

                  {/* Price & Quantity */}
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p>
                      {currency}
                      {totalPrice}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                  </div>

                  {/* Date */}
                  <p className="mt-2">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>

                  {/* Payment */}
                  <p className="mt-2">
                    Payment:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>

                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Track Order
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
