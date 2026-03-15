import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { assets } from "../assets/frontend_assets/assets";
import { Mail } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]); // ✅ use only one ref

  const { backendUrl } = useContext(AppContext);

  // 🕒 Timer logic
  useEffect(() => {
    if (isEmailSent && !isOtpSent && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, isEmailSent, isOtpSent]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // 🔢 OTP input handling
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    pasted.forEach((ch, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = ch;
      }
    });
  };

  // 📧 Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/user/sent-password-reset-otp`,
        { step: "send", email },
        { withCredentials: true },
      );
      if (data.success) {
        setIsEmailSent(true);
        setTimer(300);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // 🔁 Resend OTP
  const handleResend = async () => {
    setTimer(300);
    setCanResend(false);
    setOtp(Array(6).fill(""));
    await handleSendOtp({ preventDefault: () => {} });
  };

  // ✅ Step 2: Verify OTP
  const onSubmitOTP = async (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map((input) => input.value);
    const otpString = otpArray.join("");

    if (otpString.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setOtp(otpString);
    setIsOtpSent(true);
  };

  // 🔒 Step 3: New Password
  const handleNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/user/reset-password`,
        { otp, email, newPassword },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success("Password reset successful!");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {/* 📨 Step 1: Enter Email */}
      {!isEmailSent && (
        <form
          onSubmit={handleSendOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email to reset your password
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <Mail className="h-5 w-5" />
            <input
              className="bg-transparent outline-none text-white w-full"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer"
          >
            Send OTP
          </button>
        </form>
      )}

      {/* 🔢 Step 2: Enter OTP */}
      {isEmailSent && !isOtpSent && (
        <form
          onSubmit={onSubmitOTP}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Verify OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit OTP sent to your email
          </p>

          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {otp.map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                ref={(el) => (inputRefs.current[i] = el)}
                onInput={(e) => handleInput(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-12 bg-[#333A5c] text-white text-center text-xl font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-2.5 rounded-md hover:bg-indigo-700 transition"
          >
            Verify OTP
          </button>
        </form>
      )}

      {/* 🔐 Step 3: New Password */}
      {isEmailSent && isOtpSent && (
        <form
          onSubmit={handleNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="lock_icon" className="h-3 w-3" />
            <input
              className="bg-transparent outline-none text-white w-full"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
