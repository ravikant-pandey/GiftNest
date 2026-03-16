import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../Context/AppContext";

function EmailVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailOrPhone = location.state?.emailOrPhone;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const { backendUrl, getSellerData } = useContext(AppContext);
  const inputRef = useRef([]);

  // Timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleInput = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text").slice(0, 6);
    const pastedArray = pasted.split("");

    const newOtp = [...otp];

    pastedArray.forEach((char, index) => {
      if (/^[0-9]$/.test(char)) {
        newOtp[index] = char;

        if (inputRef.current[index]) {
          inputRef.current[index].value = char;
        }
      }
    });

    setOtp(newOtp);
  };

  // Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/seller/verify-login-otp`,
        {
          emailOrPhone,
          otp: enteredOtp,
        },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);

        localStorage.setItem("sellerLoggedIn", true);
        await getSellerData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/seller/resend-login`,
        { emailOrPhone },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);

        setTimer(300);
        setCanResend(false);
        setOtp(Array(6).fill(""));

        inputRef.current[0].focus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (!emailOrPhone) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Login OTP Verification
        </h1>

        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit OTP sent to your email
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {otp.map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={(el) => (inputRef.current[index] = el)}
              onChange={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 bg-[#333A5c] text-white text-center text-xl font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          ))}
        </div>

        <div className="text-center mb-6 text-gray-300">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-indigo-400 hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <p>
              Resend OTP in{" "}
              <span className="text-indigo-400 font-semibold">
                {formatTime(timer)}
              </span>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}

export default EmailVerify;
