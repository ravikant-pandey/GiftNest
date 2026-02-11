import { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";

const Navbar = () => {
  const { backendUrl, setAdmin, setIsAdminLoggedIn, admin } =
    useContext(AppContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/admin/admin-logout`, {
        withCredentials: true,
      });

      if (data.success) {
        localStorage.removeItem("isAdminLoggedIn");
        setAdmin([]);
        setIsAdminLoggedIn(false);
        toast.success(data.message);
        navigate("/");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <img
          onClick={() => navigate("/")}
          className="w-20 sm:w-30 cursor-pointer"
          src={assets.admin_logo}
          alt="Logo"
        />
      </div>

      {/* Right: Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 bg-primary text-white text-sm px-6 py-2 rounded-full hover:opacity-90">
            Admin
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-56 p-0 bg-gray-300 ">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={admin?.avatar}
                alt="admin"
              />

              <div className="flex flex-col">
                <p className="text-sm font-semibold">{admin?.name}</p>
                <p className="text-xs text-gray-500">{admin?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="flex flex-col p-2">
            <button
              onClick={() => navigate("/admin-profile")}
              className="text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
            >
              Profile
            </button>

            <button
              onClick={logout}
              className="text-left px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Navbar;
