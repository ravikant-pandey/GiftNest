import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { assets } from "../assets/admin_assets/assets";
import { AppContext } from "../context/AppContext";

const Orders = () => {
  const {  backendUrl, currency } = useContext(AppContext);
  const [orders, setOrders] = useState([]);

  // const fetchAllOrders = async () => {
  //   if (!sellerToken) {
  //     return null;
  //   }

  //   try {
  //     const response = await axios.post(
  //       backendUrl + "/api/order/list",
  //       {},
  //       { headers: { sellerToken } }
  //     );

  //     if (response.data.success) {
  //       setOrders(response.data.orders);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };

  // const statusHandler = async (event, orderId) => {
  //   try {
  //     const response = await axios.post(
  //       backendUrl + "/api/order/status",
  //       { orderId, status: event.target.value },
  //       { headers: { sellerToken } }
  //     );

  //     if (response.data.success) {
  //       await fetchAllOrders();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(response.data.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchAllOrders();
  // }, []);

  return (
    <>
      {orders && orders.length > 0 ? (
        <div>
          <h3>Order Page</h3>
          <div>
            {orders.map((order, index) => (
              <div
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
                key={index}
              >
                <img
                  className="w-12"
                  src={assets.parcel_icon}
                  alt="parcel-icon"
                />
                <div>
                  <div>
                    {order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return (
                          <p className="py-0.5" key={index}>
                            {item.name} x {item.quantity}
                            {/* <span>{item.size}</span> */}
                          </p>
                        );
                      } else {
                        return (
                          <p className="py-0.5" key={index}>
                            {item.name} x {item.quantity}
                            {/* <span>{item.size}</span>, */}
                          </p>
                        );
                      }
                    })}
                  </div>
                  <p className="mt-3 mb-2 font-medium">
                    {order.address.firstName + " " + order.address.lastName}
                  </p>
                  <div>
                    <p>{order.address.street + ", "}</p>

                    <p>
                      {order.address.city +
                        ", " +
                        order.address.state +
                        ", " +
                        order.address.country +
                        ", " +
                        order.address.zipcode}
                    </p>
                  </div>
                  <p>{order.address.phone}</p>
                </div>
                <div>
                  <p className="text-sm sm:text-[15px]">
                    Items: {order.items.length}
                  </p>
                  <p className="mt-3">Method: {order.paymentMethod}</p>
                  <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                  <p>Date: {new Date(order.date).toLocaleString()}</p>
                </div>
                <p className="text-sm sm:text-[15px]">
                  {currency}
                  {order.amount}
                </p>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className="p-2 font-semibold"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
          <p>You don't have any orders yet.</p>
        </div>
      )}
    </>
  );
};

export default Orders;
