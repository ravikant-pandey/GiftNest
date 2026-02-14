import { useContext, useEffect, useState } from "react";
import Title from "../components/Title/Title";
import axios from "axios";
import { AppContext } from "../Context/AppContext";

const Orders = () => {
  const { currency, backendUrl, isLoggedIn } = useContext(AppContext);

  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!isLoggedIn) {
        return null;
      }

      const { data } = await axios.get(backendUrl + "/order/my-orders", {
        withCredentials: true,
      });
      if (data.success) {
        let allOrdersItem = [];
        data.orders.map((order) => {
          order.product.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item.date = order.createdAt;
            item["paymentMethod"] = order.paymentMethod;
            allOrdersItem.push(item);
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {}
  };

  useEffect(() => {
    loadOrderData();
  }, [isLoggedIn]);

  if (!orderData.length)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg text-center">
          No orders placed yet.
        </p>
      </div>
    );

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.images[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.title}</p>
                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                  <p>
                    {currency}
                    {item.price * item.quantity}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  {/* <p>Size: {item.size}</p> */}
                </div>
                <p className="mt-2">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
                <p className="mt-2">
                  Payment:{" "}
                  <span className="text-gray-400">{item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
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
        ))}
      </div>
    </div>
  );
};

export default Orders;
