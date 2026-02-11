import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { House, ShieldCheck, ShoppingBag, Users } from "lucide-react";

const Sidebar = () => {
  const { isAdminLoggedIn } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-white border-r">
      {isAdminLoggedIn && (
        <ul className="text-[#515151] mt-5">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <House className="min-w-5" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          {/* Add Seller */}
          <NavLink
            to="/approve-stores"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <ShieldCheck className="min-w-5" />
            <p className="hidden md:block">Approve Store</p>
          </NavLink>

          {/* Seller List */}
          <NavLink
            to="/stores"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <Users className="min-w-5" />
            <p className="hidden md:block">Store</p>
          </NavLink>

          {/* Orders */}
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <ShoppingBag className="min-w-5" />
            <p className="hidden md:block">Orders</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
