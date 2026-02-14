import { useEffect, useState, useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const AllOrders = () => {
  const { isAdminLoggedIn, orders } = useContext(AppContext);
  const [formattedOrders, setFormattedOrders] = useState([]);
  useEffect(() => {
    if (!isAdminLoggedIn || !orders?.length) return;

    const data = orders.map((odr) => {
      const product = odr.product?.[0];

      return {
        id: odr._id,
        customerName: odr.user?.name,
        customerImage: odr.user?.avatar || assets.profile_icon,

        productName: product?.title,
        productImage: product?.images?.[0] || assets.product_icon,

        store: product?.seller?.store || "Main Store",

        date: odr.createdAt,
        amount: odr.amount,
        status: odr.status,
      };
    });

    setFormattedOrders(data);
  }, [isAdminLoggedIn, orders]);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

  const getStatusStyle = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-600";
    if (status === "Cancelled") return "bg-red-100 text-red-600";
    if (status === "Shipped") return "bg-blue-100 text-blue-600";
    return "bg-orange-100 text-orange-600";
  };

  return (
    <div className="w-full max-w-7xl m-5">
      <p className="mb-5 text-xl font-semibold">All Orders</p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {formattedOrders.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-400">Order #{index + 1}</p>

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusStyle(item.status)}`}
              >
                {item.status}
              </span>
            </div>

            {/* Customer */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={item.customerImage}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium">{item.customerName}</p>
                <p className="text-xs text-gray-400">Customer</p>
              </div>
            </div>

            {/* Product */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={item.productImage}
                className="w-12 h-12 rounded bg-gray-100"
              />
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-xs text-gray-400">Product</p>
              </div>
            </div>

            {/* Details */}
            <div className="border-t pt-3 text-sm space-y-1">
              <p className="flex justify-between">
                <span className="text-gray-400">Store</span>
                <span>{item.store}</span>
              </p>

              <p className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span>{formatDate(item.date)}</span>
              </p>

              <p className="flex justify-between font-semibold">
                <span>Amount</span>
                <span>₹{item.amount}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;
