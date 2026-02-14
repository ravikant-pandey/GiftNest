import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FiDollarSign, FiShoppingBag, FiBarChart } from "react-icons/fi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";

import { assets } from "../assets/admin_assets/assets";
import { Edit } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    productList,
    sellerData,
    currency,
    backendUrl,
    fetchProducts,
    orders,
  } = useContext(AppContext);

  // EDIT MODAL STATES
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    price: "",
    stock: "",
    description: "",
    bestseller: false,
    category: "",
    subCategory: "",
  });

  // OPEN EDIT MODAL
  const handleEdit = async (product) => {
    setSelectedProduct(product);
    setEditData({
      title: product.title,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      bestseller: product.bestseller || false,
      category: product.category || "",
      subCategory: product.subCategory || "",
    });
    setIsEditing(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/product/update-product/${selectedProduct._id}`,
        editData,
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);
        setIsEditing(false);
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/product/toggle-featured/${id}`,
        {},
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const revenue = orders
    .filter((o) => o.isPaid === true)
    .reduce((sum, o) => sum + o.amount, 0);

  const vendorData = {
    totalOrders: orders.length,
    totalSales: revenue,
    totalProducts: productList.length,
    avgOrder:
      orders.length > 0
        ? (
            orders.reduce((acc, order) => acc + order.amount, 0) / orders.length
          ).toFixed(2)
        : 0,
  };

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="text-blue-600" size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={sellerData?.logo || assets.logo}
              alt="Store"
              className="w-24 h-24 rounded-full border-2 border-blue-500"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {sellerData?.store}
              </h1>
              <p className="text-gray-600">{sellerData?.description}</p>
            </div>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={FiDollarSign}
            title="Total Revenue"
            value={`${currency}${vendorData.totalSales.toFixed(2)}`}
          />
          <StatCard
            icon={MdOutlineProductionQuantityLimits}
            title="Total Orders"
            value={vendorData.totalOrders}
          />
          <StatCard
            icon={FiShoppingBag}
            title="Total Product"
            value={vendorData.totalProducts}
          />
          <StatCard
            icon={FiBarChart}
            title="Average Order"
            value={`${currency}${vendorData.avgOrder}`}
          />
        </div>

        {/* PRODUCTS */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hidden md:block"
              onClick={() => navigate("/add")}
            >
              Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-medium">{product.title}</h3>

                  <div className="flex justify-between mt-2">
                    <p className="text-gray-600">
                      {currency}
                      {product.price}
                    </p>
                    <p className="text-sm">Stock: {product.stock}</p>
                  </div>

                  <button
                    onClick={() => handleEdit(product)}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="font-medium">Featured Product</p>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={editData.featured}
                        onClick={() => handleToggle(product._id)}
                      />

                      <div
                        className="w-11 h-6 bg-gray-300 rounded-full peer
      peer-checked:bg-green-600
      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
      after:bg-white after:border after:rounded-full after:h-5 after:w-5
      after:transition-all peer-checked:after:translate-x-full"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <EditModal
          product={selectedProduct}
          editData={editData}
          setEditData={setEditData}
          setIsEditing={setIsEditing}
          handleUpdateProduct={handleUpdateProduct}
        />
      )}
    </div>
  );
};

export default Dashboard;

/* MODAL COMPONENT */

const EditModal = ({
  editData,
  setEditData,
  setIsEditing,
  handleUpdateProduct,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

        <div className="space-y-4">
          {/* TITLE */}
          <input
            type="text"
            placeholder="Product Title"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          {/* PRICE */}
          <input
            type="number"
            placeholder="Price"
            value={editData.price}
            onChange={(e) =>
              setEditData({ ...editData, price: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          {/* STOCK */}
          <input
            type="number"
            placeholder="Stock"
            value={editData.stock}
            onChange={(e) =>
              setEditData({ ...editData, stock: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className="border p-2 rounded w-full h-24"
          />

          {/* CATEGORY */}
          <div>
            <p className="mb-1">Category</p>
            <select
              value={editData.category || ""}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Select one</option>
              <option value="birthday">Birthday</option>
              <option value="festival">Festival</option>
              <option value="wedding">Wedding</option>
              <option value="anniversary">Anniversary</option>
              <option value="flowers">Flowers</option>
              <option value="customized">Customized</option>
              <option value="chocolates">Chocolates</option>
              <option value="plants">Plants</option>
            </select>
          </div>

          {/* SUB CATEGORY */}
          <div>
            <p className="mb-1">Sub Category</p>
            <select
              value={editData.subCategory || ""}
              onChange={(e) =>
                setEditData({ ...editData, subCategory: e.target.value })
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Select one</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          {/* BESTSELLER */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editData.bestseller || false}
              onChange={(e) =>
                setEditData({ ...editData, bestseller: e.target.checked })
              }
            />
            <label>Add to Bestseller</label>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdateProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
