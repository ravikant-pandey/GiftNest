import { useContext } from "react";
import { assets } from "../assets/admin_assets/assets";
import { AppContext } from "../Context/AppContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { getSellerData, backendUrl, sellerData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/seller/logout-seller`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("sellerLoggedIn");
        navigate("/login");
        await getSellerData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex items-center py-2 px-[4%] justify-between border-b">
      {/* Left Logo */}

      <div className="flex items-center gap-2">
        <Link to="/">
          <img className="w-[90px]" src={assets.logo} alt="logo" />
        </Link>
      </div>

      {/* Right Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-gray-100">
            Account
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-0 bg-gray-300 ">
          {/* Top section */}
          <div className="flex items-center gap-3 p-4 border-b">
            <img
              src={sellerData?.logo || assets.logo}
              alt="shop-logo"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{sellerData?.store}</p>
              <p className="text-xs text-gray-500">Seller Account</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="flex flex-col p-2 bg-gray-300 ">
            <button
              className="text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100"
              onClick={() => navigate("/store")}
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
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
