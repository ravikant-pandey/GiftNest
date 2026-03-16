import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const { backendUrl, fetchAdminData } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/admin/admin-login`,
        { emailOrPhone: email, password },
        { withCredentials: true },
      );

      if (data.success) {
        // Redirect to OTP verification page
        toast.success(data.message);

        navigate("/verify", { state: { emailOrPhone: email } });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center">
      <div className="m-auto p-8 border rounded-xl shadow-lg min-w-[340px]">
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email / Phone"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white w-full py-2 rounded">
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
