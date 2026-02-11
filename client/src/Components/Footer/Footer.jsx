import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets";

function Footer() {
  return (
    <div className=" shadow px-5 bg-white py-2  mt-10">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        <div className="max-w-80">
          <img src={assets.logo} alt="logo" className="mb-4 w-40  opacity-80" />
          <p className="text-sm">
            Discover premium products crafted for quality, comfort, and timeless
            style.
          </p>
          <div className="flex items-center gap-3 mt-4 text-[20px] ">
            {/* Github */}
            <a
              href="https://github.com/ravikant-pandey"
              target="_blank"
              rel="noopener noreferrer"
              className=" rounded-full transition-shadow duration-300 hover:shadow-[0_0_15px_3px_rgba(156,163,175,0.8)]"
            >
              <FaGithub className="cursor-pointer" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/ravikant04"
              target="_blank"
              rel="noopener noreferrer"
              className=" rounded-full transition-shadow duration-300 hover:shadow-[0_0_15px_3px_rgba(156,163,175,0.8)]"
            >
              <FaLinkedin className="cursor-pointer" />
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com/ravikant_pandey_04"
              target="_blank"
              rel="noopener noreferrer"
              className=" rounded-full transition-shadow duration-300 hover:shadow-[0_0_15px_3px_rgba(156,163,175,0.8)]"
            >
              <FaInstagram className="cursor-pointer" />
            </a>
            {/* Facebook */}
            <a
              href="https://facebook.com/ravikant04"
              target="_blank"
              rel="noopener noreferrer"
              className=" rounded-full transition-shadow duration-300 hover:shadow-[0_0_15px_3px_rgba(156,163,175,0.8)]"
            >
              <FaFacebook className="cursor-pointer" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-lg font-playfair text-gray-800">COMPANY</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li className="group relative w-fit">
              <Link to="/about">About</Link>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative w-fit">
              <Link to="/careers">Careers</Link>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative w-fit">
              <Link to="/press">Press</Link>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative w-fit">
              <Link to="/blog">Blog</Link>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative w-fit">
              <Link to="/partners">Partners</Link>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg font-playfair text-gray-800">SUPPORT</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li className="group relative w-fit">
              <Link to="/help-center">Help Center</Link>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative w-fit">
              <Link to="/safety-information">Safety Information</Link>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative w-fit">
              <Link to="/cancellation-options">Cancellation Options</Link>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative w-fit">
              <Link to="/contact">Contact Us</Link>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative w-fit">
              <Link to="/accessibility">Accessibility</Link>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </li>
          </ul>
        </div>

        <div className="max-w-80">
          <p className="text-lg text-gray-800 font-playfair">STAY UPDATED</p>
          <p className="mt-3 text-sm">
            Subscribe to our newsletter for inspiration and special offers.
          </p>
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none"
              placeholder="Your email"
            />
            <button className="flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r">
              {/* Arrow icon */}
              <img
                src={assets.dropdown_icon}
                alt="arrow-icon"
                className="w-3.5 invert cursor-pointer"
              />
            </button>
          </div>
        </div>
      </div>
      <hr className="border-gray-300 mt-8" />
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <Link to="/" className="relative group">
            GiftNest
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          . All rights reserved.
        </p>

        <ul className="flex items-center gap-6 text-sm">
          <li>
            <Link to="/privacy-policy" className="relative group">
              Privacy Policy
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link to="/terms-conditions" className="relative group">
              Terms & Conditions
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link to="/sitemap" className="relative group">
              Sitemap
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
