import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function IsApproved() {
  const { sellerData } = useContext(AppContext);

  // status could be: "pending" | "rejected"
  const status = sellerData?.status;

  return (
    <div className="container h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        {/* PENDING UI */}
        {status === "pending" && (
          <>
            <div className="text-yellow-500 text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold mb-3">Approval Pending</h1>
            <p className="text-gray-600 mb-4">
              Your seller account has been successfully submitted for review.
            </p>
            <p className="text-gray-500 text-sm">
              Our team is currently verifying your details. This process usually
              takes <span className="font-semibold">24–48 hours</span>. You will
              be notified once your account is approved.
            </p>
          </>
        )}

        {/* REJECTED UI */}
        {status === "rejected" && (
          <>
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-3">Application Rejected</h1>
            <p className="text-gray-600 mb-4">
              Unfortunately, your seller application was not approved.
            </p>
            <p className="text-gray-500 text-sm mb-4">
              This may happen due to incomplete or incorrect business
              information, document verification failure, or policy mismatch.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
              Please review your submitted details and reapply with correct
              documents. If you believe this was a mistake, contact support.
            </div>

            <button className="mt-5 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Contact Support
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default IsApproved;
