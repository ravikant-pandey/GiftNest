import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

function Footer() {
  const [email, setEmail] = useState("");
  const { backendUrl } = useContext(AppContext);

  const onEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/newsletter/subscribe`, {
        email,
      });
      if (data.success) {
        toast.success(data.message);
        setEmail("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <footer className="bg-white shadow px-5 mt-10">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        {/* Brand */}
        <div className="max-w-80">
          <img src={assets.logo} alt="logo" className="mb-4 w-40 opacity-80" />
          <p className="text-sm text-gray-600">
            Discover premium gifts crafted for quality, comfort, and timeless
            style.
          </p>

          {/* Social */}
          <div className="flex items-center gap-3 mt-4 text-xl">
            <a
              href="https://github.com/ravikant-pandey"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:shadow-[0_0_12px_rgba(0,0,0,0.2)] rounded-full"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/ravikant04"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:shadow-[0_0_12px_rgba(0,0,0,0.2)] rounded-full"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://instagram.com/ravikant_pandey_04"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:shadow-[0_0_12px_rgba(0,0,0,0.2)] rounded-full"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com/ravikant04"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:shadow-[0_0_12px_rgba(0,0,0,0.2)] rounded-full"
            >
              <FaFacebook />
            </a>
          </div>
        </div>

        {/* Company */}
        <div>
          <p className="text-lg font-playfair text-gray-800">COMPANY</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-gray-600">
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <p className="text-lg font-playfair text-gray-800">CUSTOMER CARE</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-gray-600">
            <li>
              <Link to="/help-center" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:underline">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:underline">
                Return & Refund
              </Link>
            </li>
            <li>
              <Link to="/cancellation" className="hover:underline">
                Cancellation Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="max-w-80">
          <p className="text-lg text-gray-800 font-playfair">STAY UPDATED</p>
          <p className="mt-3 text-sm text-gray-600">
            Subscribe to get offers & gift ideas.
          </p>
          <div className="flex items-center mt-4">
            <input
              type="email"
              className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none w-full"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="bg-black h-9 w-10 rounded-r flex items-center justify-center"
              onClick={onEmailSubmit}
            >
              <img
                src={assets.dropdown_icon}
                alt="submit"
                className="w-3.5 invert"
              />
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 mt-10" />

      {/* Bottom */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between py-6 text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()}{" "}
          <Link to="/" className="font-medium hover:underline">
            GiftNest
          </Link>
          . All rights reserved.
        </p>

        <div className="flex gap-6">
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms-conditions" className="hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
