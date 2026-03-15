import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-hot-toast";

function Login() {
  const [currentState, setCurrentState] = useState("login");
  const { backendUrl, setIsLoggedIn, setToken, isLoggedIn, getUserData } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const onSubmitHandler = async (evt) => {
    evt.preventDefault();
    setLoading(true);

    try {
      if (currentState === "signup") {
        // REGISTER USER
        const { data } = await axios.post(
          `${backendUrl}/user/register`,
          { name, phone, email, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          },
        );

        if (data.success) {
          toast.success(data.message);
          setCurrentState("login");
          setPassword("");
        }
      } else {
        // LOGIN USER (email or phone)
        const { data } = await axios.post(
          `${backendUrl}/user/login`,
          { emailOrPhone, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          },
        );

        if (data.success) {
          setIsLoggedIn(true);
          setToken(data.data.accessToken);

          // ✅ Save to localStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("accessToken", data.data.accessToken);

          toast.success(data.message);
          getUserData();
          navigate("/");
        } else toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      {/* Title */}
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl capitalize">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Signup fields */}
      {currentState !== "login" && (
        <>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Enter your phone number..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </>
      )}

      {/* Login field — email OR phone */}
      {currentState === "login" && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Enter your Email or Phone..."
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          required
        />
      )}

      {/* Password */}
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Enter your password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Forgot password only on login */}
      {currentState === "login" && (
        <p
          className="text-sm text-right w-full underline cursor-pointer"
          onClick={() => navigate("/reset-password")}
        >
          Forgot Password?
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-8 py-2 mt-3 w-full disabled:bg-gray-600"
      >
        {loading
          ? "Please wait..."
          : currentState === "login"
            ? "Login"
            : "Signup"}
      </button>

      <p className="text-sm">
        {currentState === "login" ? (
          <>
            Don't have an account?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => setCurrentState("signup")}
            >
              Signup
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => setCurrentState("login")}
            >
              Login
            </span>
          </>
        )}
      </p>
    </form>
  );
}

export default Login;
