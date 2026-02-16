import { useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { assets } from "../assets/admin_assets/assets";
import { AppContext } from "../Context/AppContext";

const Orders = () => {
  const { backendUrl, currency, loading, orders, fetchAllOrders } =
    useContext(AppContext);

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      const { data } = await axios.put(
        `${backendUrl}/order/update-order-status`,
        { orderId, status: newStatus },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const statusColor = {
    "Order Placed": "text-yellow-600",
    Packing: "text-blue-600",
    Shipped: "text-purple-600",
    "Out For Delivery": "text-orange-600",
    Delivered: "text-green-600",
    Cancelled: "text-red-600",
  };

  if (loading) {
    return (
      <div className="p-10 text-center font-semibold text-lg">
        Loading Orders...
      </div>
    );
  }

  return (
    <>
      {orders.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Order Page</h3>

          {orders.map((order) => {
            const totalPrice = (order.product?.price || 0) * order.quantity;

            return (
              <div
                key={order._id}
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
              >
                {/* Product Image */}
                <img
                  className="w-12"
                  src={order.product?.images?.[0] || assets.parcel_icon}
                  alt="parcel"
                />

                {/* Product + Customer */}
                <div>
                  <p className="font-medium text-sm md:text-base">
                    {order.product?.title}
                  </p>

                  <p className="mt-2">
                    Quantity: <b>{order.quantity}</b>
                  </p>

                  <p className="mt-2">
                    Customer: <b>{order.customer}</b>
                  </p>

                  <p className="mt-2 text-gray-500">
                    {order.date.split("T")[0]}
                  </p>
                </div>

                {/* Payment Info */}
                <div>
                  <p>Method: {order.paymentMethod}</p>
                  <p className="mt-2">
                    Payment: {order.isPaid ? "Done" : "Pending"}
                  </p>
                </div>

                {/* Amount */}
                <p className="text-sm sm:text-[15px] font-semibold">
                  {currency} {totalPrice}
                </p>

                {/* Status */}
                <div>
                  <p className={`font-bold mb-2 ${statusColor[order.status]}`}>
                    {order.status}
                  </p>

                  <select
                    onChange={(e) => statusHandler(e, order.orderId)}
                    value={order.status}
                    className="p-2 border rounded"
                    disabled={order.status === "Delivered"}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}
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
