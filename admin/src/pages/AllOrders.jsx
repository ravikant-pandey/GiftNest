import React, { useEffect, useState, useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const AllOrders = () => {
  const { isAdminLoggedIn } = useContext(AppContext);
  const [orders, setOrders] = useState([]);

  const dummyOrders = [
    {
      customer: {
        name: "Aman Singh",
        image: assets.profile_icon,
      },
      product: {
        name: "Nike Running Shoes",
        image: assets.shoe_icon,
      },
      store: "Nike Store",
      orderDate: "2025-01-22",
      amount: 4999,
      status: "Delivered",
    },
    {
      customer: {
        name: "Priya Sharma",
        image: assets.profile_icon,
      },
      product: {
        name: "Apple AirPods",
        image: assets.earbuds_icon,
      },
      store: "Apple Store",
      orderDate: "2025-01-21",
      amount: 8999,
      status: "Shipped",
    },
    {
      customer: {
        name: "Rohit Mehta",
        image: assets.profile_icon,
      },
      product: {
        name: "Samsung S24",
        image: assets.phone_icon,
      },
      orderDate: "2025-01-20",
      amount: 64999,
      status: "Processing",
    },
    {
      customer: {
        name: "Neha Patel",
        image: assets.profile_icon,
      },
      product: {
        name: "Casual Jacket",
        image: assets.jacket_icon,
      },
      store: "Fashion Store",
      orderDate: "2025-01-20",
      amount: 1999,
      status: "Cancelled",
    },
  ];

  useEffect(() => {
    if (isAdminLoggedIn) {
      setOrders(dummyOrders); // replace with API later
    }
  }, [isAdminLoggedIn]);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

  return (
    <div className="w-full max-w-7xl m-5">
      <p className="mb-5 text-xl font-semibold">All Orders</p>

      {/* Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition"
          >
            {/* Top Row */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-400">Order #{index + 1}</p>

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  item.status === "Delivered"
                    ? "bg-green-100 text-green-600"
                    : item.status === "Cancelled"
                      ? "bg-red-100 text-red-600"
                      : item.status === "Shipped"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-orange-100 text-orange-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* Customer */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={item.customer.image}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium">{item.customer.name}</p>
                <p className="text-xs text-gray-400">Customer</p>
              </div>
            </div>

            {/* Product */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={item.product.image}
                className="w-12 h-12 rounded bg-gray-100"
              />
              <div>
                <p className="font-medium">{item.product.name}</p>
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
                <span>{formatDate(item.orderDate)}</span>
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
