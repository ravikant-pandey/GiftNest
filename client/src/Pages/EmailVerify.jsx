import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
function EmailVerify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false);

  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);

  const inputRef = useRef([]);
  // Handle timer countdown
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

  // Format timer mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle OTP input change
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };
  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  // handle Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData("text");
    const pasteArray = pastedValue.split("");
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };

  // Handle resend
  const handleResend = async () => {
    setTimer(300); // reset 5 min timer
    setCanResend(false);
    setOtp(Array(6).fill(""));
    try {
      const { data } = await axios.post(
        `${backendUrl}/user/sent-verify-otp`,
        {},
        { withCredentials: true },
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification OTP",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = inputRef.current.map((input) => input.value).join("");
    try {
      const { data } = await axios.post(
        `${backendUrl}/user/verify-account`,
        {
          otp: enteredOtp,
        },
        {
          withCredentials: true,
        },
      );
      if (data.success) {
        navigate("/");
        toast.success(data.message);
        getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to verify otp");
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData?.isVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit OTP sent to your email
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {otp.map((_, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              ref={(e) => (inputRef.current[index] = e)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              required
              className="w-12 h-12 bg-[#333A5c] text-white text-center text-xl font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>

        {/* Timer and Resend */}
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

        {/* Submit */}
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
