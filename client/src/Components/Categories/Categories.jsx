import { NavLink } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets";

function Categories() {
  return (
    <ul
      className="
      grid grid-cols-3 gap-4 px-3 mt-4
      sm:grid-cols-4
      md:grid-cols-5
      lg:flex lg:flex-wrap lg:justify-center lg:gap-10
      text-xs sm:text-sm text-gray-700
    "
    >
      <NavLink to="/birthday" className="flex flex-col items-center gap-1">
        <img
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover transition-transform duration-300 hover:scale-105"
          src={assets.Birthday_icon}
          alt="Birthday"
        />
        <p>Birthday</p>
      </NavLink>

      <NavLink to="/festival" className="flex flex-col items-center gap-1">
        <img
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover transition-transform duration-300 hover:scale-105"
          src={assets.Occasion}
          alt="Occasions"
        />
        <p>Festival</p>
      </NavLink>

      <NavLink to="/wedding" className="flex flex-col items-center gap-1">
        <img
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover transition-transform duration-300 hover:scale-105"
          src={assets.Wedding_Icon_Desk}
          alt="Wedding"
        />
        <p>Wedding</p>
      </NavLink>

      <NavLink to="/anniversary" className="flex flex-col items-center gap-1">
        <img
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover transition-transform duration-300 hover:scale-105"
          src={assets.anniversary_icon}
          alt="Anniversary"
        />
        <p>Anniversary</p>
      </NavLink>

      <NavLink to="/flowers" className="flex flex-col items-center gap-1">
        <img
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover transition-transform duration-300 hover:scale-105"
          src={assets.Flowers}
          alt="Flowers"
        />
        <p>Flowers</p>
      </NavLink>

      <NavLink to="/customizable" className="flex flex-col items-center gap-1">
        <img
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover transition-transform duration-300 hover:scale-105"
          src={assets.Personalised}
          alt="customized"
        />
        <p>Customized</p>
      </NavLink>

      <NavLink to="/chocolates" className="flex flex-col items-center gap-1">
        <img
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover transition-transform duration-300 hover:scale-105"
          src={assets.chocolat}
          alt="Chocolates"
        />
        <p>Chocolates</p>
      </NavLink>

      <NavLink to="/plants" className="flex flex-col items-center gap-1">
        <img
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover transition-transform duration-300 hover:scale-105"
          src={assets.plants_icon}
          alt="plants"
        />
        <p>Plants</p>
      </NavLink>
    </ul>
  );
}

export default Categories;
