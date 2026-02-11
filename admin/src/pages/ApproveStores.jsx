import { ClipboardClock } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const ApproveStores = () => {
  const { sellers, fetchSellerData, backendUrl } = useContext(AppContext);

  //  show only pending sellers
  const requests = sellers?.filter((seller) => seller.status === "pending");
  const [loadingId, setLoadingId] = useState(null);

  // UPDATE STORE STATUS (approve / reject)
  const handleStatus = async (id, status) => {
    try {
      setLoadingId(id);
      const { data } = await axios.put(
        `${backendUrl}/seller/store-status/${id}`,
        {
          status,
        },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
        await fetchSellerData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-xl font-semibold">Pending Store Approvals</h1>

      <div className="flex flex-wrap gap-6 pt-6">
        {requests?.map((req) => (
          <div
            key={req._id}
            className="w-full max-w-md bg-white border rounded-xl overflow-hidden shadow-md"
          >
            {/* STORE IMAGE */}
            <img
              src={req.logo}
              alt="store"
              className="w-full h-40 object-cover bg-gray-100"
            />

            {/* CONTENT */}
            <div className="p-4 space-y-2">
              <p className="text-sm text-gray-400">Store Request</p>

              <p className="font-semibold text-lg">{req.store}</p>
              <p className="text-sm text-gray-600">Owner: {req.ownerName}</p>
              <p className="text-sm text-gray-700">{req.description}</p>

              <p className="text-xs text-gray-500">📍 {req.address}</p>
              <p className="text-xs text-gray-500">📞 {req.phone}</p>
              <p className="text-xs text-gray-500">✉️ {req.email}</p>

              <p className="text-xs text-gray-400 pt-1">
                Applied on {new Date(req.createdAt).toLocaleDateString()}
              </p>

              {/* STATUS */}
              <div className="flex gap-2 items-center text-orange-500 font-semibold pt-2">
                <ClipboardClock size={20} />
                Pending Approval
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-3">
                <button
                  disabled={loadingId === req._id}
                  onClick={() => handleStatus(req._id, "approved")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm"
                >
                  {loadingId === req._id ? "Processing..." : "Approve"}
                </button>

                <button
                  disabled={loadingId === req._id}
                  onClick={() => handleStatus(req._id, "rejected")}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm"
                >
                  {loadingId === req._id ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* EMPTY STATE */}
        {requests?.length === 0 && (
          <div className="text-gray-500 text-center w-full mt-10">
            No pending store requests
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveStores;
