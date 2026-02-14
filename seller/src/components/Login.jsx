import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext.jsx";
import axios from "axios";
import toast from "react-hot-toast"; 
import { Lock, Mail, Phone, Store, User } from "lucide-react";

function Login() {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'

  const { backendUrl, getSellerData } = useContext(AppContext);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [store, setStore] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (evt) => {
    evt.preventDefault();
    setLoading(true);

    try {
      const url =
        mode === "signup"
          ? `${backendUrl}/seller/register-seller`
          : `${backendUrl}/seller/login-seller`;

      const payload =
        mode === "signup"
          ? { phone, email, password, store, ownerName }
          : { emailOrPhone, password };

      const { data } = await axios.post(url, payload, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);

        if (mode === "signup") {
          setMode("login");
          setPassword("");
          setEmail("");
          setPhone("");
          setStore("");
          setOwnerName("");
          setEmailOrPhone("");
          setLoading(false);
          return;
        }

        if (mode === "login") {
          localStorage.setItem("sellerLoggedIn", true);
          await getSellerData();
          navigate("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {mode === "signup" ? "Create Seller Account" : "Seller Login"}
        </h2>

        <p className="text-center mb-6 text-sm opacity-80">
          {mode === "signup"
            ? "Create your seller account"
            : "Login to your seller account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {/* SIGNUP FIELDS */}
          {mode === "signup" && (
            <>
              <div className="mb-4 flex items-center gap-4 w-full px-4 py-2.5 rounded-full bg-[#333A5C]">
                <Store />
                <input
                  className="bg-transparent outline-none text-white"
                  type="text"
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  placeholder="Store name"
                  required
                />
              </div>
              <div className="mb-4 flex items-center gap-4 w-full px-4 py-2.5 rounded-full bg-[#333A5C]">
                <User />
                <input
                  className="bg-transparent outline-none text-white"
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Owner name"
                  required
                />
              </div>

              <div className="mb-4 flex items-center gap-4 w-full px-4 py-2.5 rounded-full bg-[#333A5C]">
                <Phone />
                <input
                  onChange={(e) => setPhone(e.target.value.trim())}
                  value={phone}
                  className="bg-transparent outline-none text-white"
                  type="tel"
                  placeholder="Phone number"
                  required
                />
              </div>

              <div className="mb-4 flex items-center gap-4 w-full px-4 py-2.5 rounded-full bg-[#333A5C]">
                <Mail />
                <input
                  onChange={(e) => setEmail(e.target.value.trim())}
                  value={email}
                  className="bg-transparent outline-none text-white"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
            </>
          )}

          {/* LOGIN FIELD */}
          {mode === "login" && (
            <div className="mb-4 flex items-center gap-4 w-full px-4 py-2.5 rounded-full bg-[#333A5C]">
              <Mail size={15} /> <Phone size={15} />
              <input
                onChange={(e) => setEmailOrPhone(e.target.value.trim())}
                value={emailOrPhone}
                className="bg-transparent outline-none text-white"
                placeholder="Email / Phone number"
                required
              />
            </div>
          )}

          {/* PASSWORD */}
          <div className="mb-4 flex items-center gap-4 w-full px-4 py-2.5 rounded-full bg-[#333A5C]">
            <Lock />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none text-white"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-2.5 rounded-full font-medium disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Sign Up"
                : "Login"}
          </button>
        </form>

        <p className="mt-4 text-white text-center">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <span
                className="text-yellow-300 cursor-pointer underline"
                onClick={() => setMode("login")}
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                className="text-yellow-300 cursor-pointer underline"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;
