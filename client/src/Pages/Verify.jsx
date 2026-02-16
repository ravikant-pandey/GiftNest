import  { useState, useEffect, useContext } from "react";
import { FaCheckCircle, FaTimesCircle, FaCreditCard } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { useSearchParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const Verify = () => {
  const { navigate, setCartItems } = useContext(AppContext);
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("loading");

  const success = searchParams.get("success");

  useEffect(() => {
    // wait so webhook completes in backend
    setTimeout(() => {
      if (success === "true") {
        setStatus("success");

        // clear cart locally
        setCartItems({});

        // auto redirect after success
        setTimeout(() => {
          navigate("/orders");
        }, 4000);
      } else {
        setStatus("fail");
      }
    }, 2000);
  }, []);

  const goToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-green-300 p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <FaCreditCard className="text-4xl text-indigo-500 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Payment Verification
          </h2>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <CgSpinner className="text-6xl text-indigo-500 animate-spin" />
            <p className="mt-4 text-lg font-semibold text-gray-700">
              Verifying your payment...
            </p>
          </div>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <div className="flex flex-col items-center">
            <FaCheckCircle className="text-6xl text-green-500" />
            <p className="mt-4 text-lg font-semibold text-green-700">
              Payment Successful 🎉
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Redirecting to your orders...
            </p>
          </div>
        )}

        {/* FAILED */}
        {status === "fail" && (
          <div className="flex flex-col items-center">
            <FaTimesCircle className="text-6xl text-red-500" />
            <p className="mt-4 text-lg font-semibold text-red-700">
              Payment Cancelled ❌
            </p>

            <button
              onClick={goToCart}
              className="mt-6 px-5 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
