import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { assets } from "../../assets/frontend_assets/assets";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import Search from "../Search/Search";
import { BsCollectionFill } from "react-icons/bs";

function Navbar() {
  const navigate = useNavigate();
  const {
    userData,
    isLoggedIn,
    setIsLoggedIn,
    setUserData,
    backendUrl,
    visible,
    setVisible,
    getCartCount,
    setToken,
  } = useContext(AppContext);

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef();

  const [openMoreDropdown, setOpenMoreDropdown] = useState(false);
  const moreDropdownRef = useRef();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/logout`, {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(null);
        setIsLoggedIn(false);
        setOpenDropdown(false);
        toast.success(data.message);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accessToken");
        setToken("");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setOpenDropdown(!openDropdown);
  };

  // Close dropdowns when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(e.target)
      ) {
        setOpenMoreDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Overlay for sidebar closing */}
      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <div className="shadow bg-white px-3 sm:px-6 py-2 flex items-center justify-between font-medium sticky top-0 z-50">
        {/* Logo */}
        <Link to="/">
          <img className="w-32 sm:w-40" src={assets.logo} alt="logo" />
        </Link>

        {/* Search (only desktop) */}
        <div className="hidden md:flex w-[55%]">
          <Search />
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-5 md:gap-8">
          <div className="hidden md:flex flex-col items-center cursor-pointer">
            <Link to="collection">
              <BsCollectionFill className="w-full h-6 mb-2" />
              <p className="text-gray-500 text-xs">Collection</p>
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <img
              className="w-9 h-9 rounded-full cursor-pointer border shadow"
              src={userData?.avatar || assets.profile_icon}
              onClick={handleProfileClick}
              alt="profile"
            />

            {/* NEW — Hi Guest / Username */}
            <p className="text-gray-500 text-xs hidden md:block">
              Hi, {userData?.name?.split(" ")[0] || "Guest"}
            </p>

            {openDropdown && (
              <div className="absolute right-[-60px] mt-5 bg-white shadow-md rounded border w-[220px] p-2 text-sm z-50">
                <div className="flex items-center gap-3 p-2 border-b pb-3">
                  <img
                    src={userData?.avatar || assets.profile_icon}
                    alt="profile"
                    className="w-9 h-9 rounded-full bg-gray-200"
                  />
                  <div>
                    <p className="font-semibold">{userData?.name || "Guest"}</p>
                  </div>
                </div>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                >
                  My Orders
                </p>
                <p
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                >
                  My Profile
                </p>
                {isLoggedIn && (
                  <p
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-gray-100 p-2"
                  >
                    Logout
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="flex flex-col items-center">
            <Link to="/cart" className="relative">
              <img className="w-5" src={assets.cart_icon} alt="cart" />
              <span className="absolute right-[-6px] bottom-[-6px] bg-black text-white text-[9px] rounded-full w-4 text-center">
                {getCartCount()}
              </span>
            </Link>
            <p className="text-gray-500 text-xs mt-1 hidden md:block">Cart</p>
          </div>

          {/* MORE COMPONENT — SAME AS OLD */}
          {!isLoggedIn && (
            <div className="relative hidden md:block" ref={moreDropdownRef}>
              <div
                className="w-6 h-6 rounded border-2 border-black cursor-pointer flex items-center justify-center hover:bg-gray-100"
                onClick={() => setOpenMoreDropdown(!openMoreDropdown)}
              >
                <p className="mb-2">...</p>
              </div>
              <p className="text-gray-500 text-xs mt-2 text-center">More</p>

              {openMoreDropdown && (
                <div className="absolute mt-3 right-0 bg-white shadow-md rounded border w-[220px] p-2 text-sm z-50">
                  <a
                    href="https://admin-giftnest.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p
                      className="cursor-pointer hover:bg-gray-100 p-2"
                    >
                      Admin
                    </p>
                  </a>
                  <a
                    href="https://seller-giftnest.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="cursor-pointer hover:bg-gray-100 p-2">
                      Become a Seller / Supplier
                    </p>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Menu Icon (mobile) */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="menu icon"
            className="w-6 cursor-pointer block md:hidden"
          />
        </div>

        {/* Sidebar menu (mobile only) */}
        <div
          className={`fixed top-0 bottom-0 right-0 bg-white transition-all duration-300 z-50 md:hidden ${
            visible ? "w-80" : "w-0"
          }`}
        >
          <div className="flex flex-col text-gray-700 overflow-y-auto h-full">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-4 border-b cursor-pointer"
            >
              <img
                className="h-4 rotate-180"
                src={assets.dropdown_icon}
                alt="back"
              />
              <span>Back</span>
            </div>

            {/* Search inside menu */}
            <div className="px-4 py-3 border-b">
              <Search />
            </div>

            {/* Links */}
            <NavLink
              to="/"
              onClick={() => setVisible(false)}
              className="p-4 border-b hover:bg-gray-100"
            >
              Home
            </NavLink>

            <NavLink
              to="/orders"
              onClick={() => setVisible(false)}
              className="p-4 border-b hover:bg-gray-100"
            >
              My Orders
            </NavLink>
            <NavLink
              to="/profile"
              onClick={() => setVisible(false)}
              className="p-4 border-b hover:bg-gray-100"
            >
              My Profile
            </NavLink>
            <a
              href="https://admin-giftnest.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="cursor-pointer hover:bg-gray-100 p-2">Admin</p>
            </a>
            <a
              href="https://seller-giftnest.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="cursor-pointer hover:bg-gray-100 p-2">
                Become a Seller / Supplier
              </p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
