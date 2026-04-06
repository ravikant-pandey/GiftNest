import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

function Refunds() {
  const { refunds, backendUrl, fetchRefundData } = useContext(AppContext);

  //  Safe handling
  const refundList = Array.isArray(refunds) ? refunds : refunds?.refunds || [];

  //  Update status
  const updateRefundStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/refund/update-refund-status`,
        {
          refundId: id,
          status,
        },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);
        await fetchRefundData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Refund Requests</h1>

      {/* Empty */}
      {!refundList.length && (
        <div className="text-center text-gray-500 py-20">
          No refund requests found
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {refundList.map((refund) => {
          const isFinal =
            refund.status === "paid" || refund.status === "rejected";

          return (
            <div
              key={refund._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              {/* Top */}
              <div>
                <p className="text-xs text-gray-400">ORDER</p>
                <p className="font-medium text-sm break-all">
                  {refund.orderId}
                </p>

                <p className="text-xs text-gray-400 mt-3">USER</p>
                <p className="font-medium text-sm break-all">{refund.userId}</p>

                <p className="text-xs text-gray-400 mt-3">AMOUNT</p>
                <p className="text-lg font-semibold text-green-600">
                  ₹{refund.amount}
                </p>

                {/* Bank */}
                <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-medium text-gray-700">
                    {refund.accountHolderName}
                  </p>
                  <p className="text-gray-600">{refund.bankName}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Acc: {refund.accountNumber}
                  </p>
                  <p className="text-gray-500 text-xs">
                    IFSC: {refund.ifscCode}
                  </p>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-5">
                {/* Status Badge */}
                <div className="mb-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      refund.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : refund.status === "approved"
                          ? "bg-blue-100 text-blue-700"
                          : refund.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {refund.status.toUpperCase()}
                  </span>
                </div>

                {/* 🔥 Dropdown */}
                <select
                  value={refund.status}
                  disabled={isFinal}
                  onChange={(e) =>
                    updateRefundStatus(refund._id, e.target.value)
                  }
                  className={`w-full border rounded-md p-2 text-sm ${
                    isFinal ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approve</option>
                  <option value="paid">Mark as Paid</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Refunds;
