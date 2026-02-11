import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Mail, MapPin, Phone } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Store = () => {
  const { isAdminLoggedIn, sellers, fetchSellerData, backendUrl } =
    useContext(AppContext);

  // Fetch sellers when admin opens page
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchSellerData();
    }
  }, [isAdminLoggedIn]);

  //  show only approved sellers
  const approvedSellers = sellers?.filter(
    (seller) => seller.status === "approved",
  );

  const toggleSellerStatus = async (id) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/seller/is-active/${id}`,
        {},
        {
          withCredentials: true,
        },
      );
      if (data.success) {
        toast.success(data.message);
        await fetchSellerData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-auto">
      <h1 className="text-xl font-semibold mb-6">Approved Stores</h1>

      {/* EMPTY STATE */}
      {approvedSellers?.length === 0 && (
        <div className="text-gray-500 text-center mt-10">
          No approved stores yet
        </div>
      )}

      {approvedSellers?.map((seller) => (
        <div
          key={seller._id}
          className="bg-white border rounded-xl p-6 flex justify-between gap-6 mb-5 shadow-sm"
        >
          {/* LEFT */}
          <div className="flex gap-4">
            <img
              src={seller.logo}
              alt="store"
              className="w-20 h-20 rounded-full border object-cover"
            />

            <div className="space-y-2">
              {/* STORE NAME */}
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{seller.store}</p>
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  Approved
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-700 max-w-2xl">
                {seller.description}
              </p>

              {/* INFO */}
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex gap-2">
                  <MapPin size={18} />
                  <p>{seller.address}</p>
                </div>

                <div className="flex gap-2">
                  <Phone size={18} />
                  <p>{seller.phone}</p>
                </div>

                <div className="flex gap-2">
                  <Mail size={18} />
                  <p>{seller.email}</p>
                </div>
              </div>

              {/* OWNER + DATE */}
              <div className="text-sm text-gray-500 pt-2">
                Applied on {new Date(seller.createdAt).toLocaleDateString()}
                <div className="mt-1">
                  Owner:{" "}
                  <span className="font-medium text-gray-700">
                    {seller.ownerName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p
              className={`text-sm font-medium ${
                seller.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {seller.isActive ? "Active" : "Blocked"}
            </p>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seller.isActive}
                onChange={() => toggleSellerStatus(seller._id)}
                className="sr-only peer"
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
      ))}
    </div>
  );
};

export default Store;
