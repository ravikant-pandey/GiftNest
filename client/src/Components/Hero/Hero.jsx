import { Link } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets";

function Hero() {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 mt-6 rounded">
      {/* left */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed prata-regular">
            Latest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <Link to="/collection">
              <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            </Link>

            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 sm:p-0 p-2 sm:m-2">
        <img className="rounded-2xl" src={assets.Secret_Santa_Desk} alt="" />
      </div>
    </div>
  );
}

export default Hero;
