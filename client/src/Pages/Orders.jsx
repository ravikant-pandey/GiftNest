import { useContext, useEffect, useState } from "react";
import Title from "../Components/Title/Title";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import RefundForm from "./RefundForm";

const Orders = () => {
  const { currency, backendUrl, isLoggedIn, refunds } = useContext(AppContext);

  const [orderData, setOrderData] = useState([]);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({
    orderId: "",
    amount: 0,
  });

  const closeRefundForm = () => setShowRefundForm(false);

  // Load Orders
  const loadOrderData = async () => {
    try {
      if (!isLoggedIn) return;

      const { data } = await axios.get(backendUrl + "/order/my-orders", {
        withCredentials: true,
      });

      if (!data?.success || !Array.isArray(data.orders)) {
        setOrderData([]);
        return;
      }

      const formattedOrders = [];

      data.orders.forEach((order) => {
        if (!order || !Array.isArray(order.product)) return;

        order.product.forEach((item) => {
          if (!item?.productId) return;

          formattedOrders.push({
            ...item,
            orderId: order._id,
            amount: order.amount,
            status: order.status,
            paymentMethod: order.paymentMethod,
            date: order.createdAt,

            // IMPORTANT
            refundStatus: order.refundStatus || "none",
          });
        });
      });

      setOrderData(formattedOrders);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Cancel Order
  const cancelOrder = async (orderId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/order/cancel-order`,
        { orderId },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);
        loadOrderData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [isLoggedIn]);

  // Empty State
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
    <div className="border-t pt-16 px-4">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* ORDER CARDS */}
      {orderData.map((item) => {
        const product = item.productId;

        const image = product?.images?.[0] || "https://via.placeholder.com/150";

        const totalPrice = (product?.price || 0) * item.quantity;

        const isCancelled = item.status === "Cancelled";

        const isOnlinePayment =
          item.paymentMethod === "stripe" || item.paymentMethod === "RAZORPAY";

        const refundList = Array.isArray(refunds)
          ? refunds
          : refunds
            ? [refunds]
            : [];

        const matchedRefund = refundList.find(
          (r) => String(r.orderId) === String(item.orderId),
        );

        const refundStatus = matchedRefund?.status || "none";
        console.log("refund:", refunds);
        console.log("itemOrderId:", item.orderId);
        console.log("refunds:", refundList);
        return (
          <div
            key={item._id}
            className="bg-white border rounded-xl shadow-md p-6 mb-6 
            flex flex-col gap-5 hover:shadow-lg transition"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-3">
              <p className="font-semibold text-lg">Order ID: {item.orderId}</p>

              <span className="text-sm px-3 py-1 rounded-full bg-gray-100">
                {item.status}
              </span>
            </div>

            {/* PRODUCT */}
            <div className="flex gap-6">
              <img
                src={image}
                className="w-28 h-28 object-cover rounded-lg"
                alt="product"
              />

              <div>
                <p className="text-lg font-semibold">
                  {product?.title || "Product"}
                </p>

                <p className="text-gray-600">
                  Price: {currency}
                  {totalPrice}
                </p>

                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Order Date</p>
                <p>{new Date(item.date).toDateString()}</p>
              </div>

              <div>
                <p className="text-gray-400">Payment</p>
                <p>{item.paymentMethod}</p>
              </div>

              <div>
                <p className="text-gray-400">Amount</p>
                <p>
                  {currency}
                  {item.amount}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Status</p>
                <p>{item.status}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center border-t pt-4">
              <div className="flex gap-3">
                {/* */}
                {!isCancelled && (
                  <button
                    onClick={() => cancelOrder(item.orderId)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm"
                  >
                    Cancel Order
                  </button>
                )}

                {/* ✅ Refund */}
                {item.status === "Cancelled" &&
                (item.paymentMethod === "stripe" ||
                  item.paymentMethod === "RAZORPAY") &&
                refundStatus === "none" ? (
                  <button
                    onClick={() => {
                      setSelectedOrder({
                        orderId: item.orderId,
                        amount: item.amount,
                      });
                      setShowRefundForm(true);
                    }}
                    className="border px-4 py-2 text-sm font-medium rounded-sm bg-green-500 text-white cursor-pointer"
                  >
                    Refund Now
                  </button>
                ) : (
                  <button className="text-green-500" disabled>Refund already requested</button>
                )}
              </div>

              {/* Refund Status */}
              {isCancelled && isOnlinePayment && (
                <div className="text-sm font-medium">
                  {item.status === "Cancelled" &&
                    (item.paymentMethod === "stripe" ||
                      item.paymentMethod === "RAZORPAY") && (
                      <p
                        className={`text-sm font-medium ${
                          refundStatus === "pending"
                            ? "text-yellow-600"
                            : refundStatus === "approved"
                              ? "text-green-600"
                              : refundStatus === "rejected"
                                ? "text-red-600"
                                : "text-gray-500"
                        }`}
                      >
                        {refundStatus === "none" && "No refund requested"}
                        {refundStatus === "pending" && "Refund Pending"}
                        {refundStatus === "approved" && "Refund Approved"}
                        {refundStatus === "rejected" && "Refund Rejected"}
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* MODAL */}
      {showRefundForm && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setShowRefundForm(false)}
        >
          <div
            className="bg-white p-8 rounded-xl w-[95%] max-w-xl relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRefundForm(false)}
              className="absolute top-3 right-4 text-xl font-bold"
            >
              ✕
            </button>

            <RefundForm
              orderId={selectedOrder.orderId}
              amount={selectedOrder.amount}
              onClose={closeRefundForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
