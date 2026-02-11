import { Facebook, Github, Instagram, LinkedinIcon } from "lucide-react";
import { assets } from "../assets/admin_assets/assets";

function Footer() {
  return (
    <div className="container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 mb-2 ">
      <img width={100} src={assets.logo} alt="logo" />

      <p className="flex-1 items-center pl-3 text-sm text-gray-500 border-l border-gray-400 max-sm:hidden ">
        Copyright &copy; 2025
        <a
          href="https://ravikantpandey.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          <span className="text-gray-800 font-medium ml-1 hover:underline">
            {" "}
            @Ravikant.dev
          </span>
        </a>{" "}
        | All rights reserved.
      </p>

      <div className="flex gap-2">
        {/* GitHub */}
        <a
          href="https://github.com/ravikant-pandey"
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 w-8 border border-gray-500 rounded-full flex justify-center items-center hover:bg-gray-100 shadow"
        >
          <Github width={20} className="cursor-pointer" />
        </a>

        {/* Facebook */}
        <a
          href="https://facebook.com/ravikant04"
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 w-8 border border-gray-500 rounded-full flex justify-center items-center hover:bg-gray-50 shadow"
        >
          <Facebook width={20} className="cursor-pointer" />
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com/ravikant_pandey_04"
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 w-8 border border-gray-500 rounded-full flex justify-center items-center hover:bg-gray-50 shadow"
        >
          <Instagram width={20} className="cursor-pointer" />
        </a>

        {/* LinkedIn */}
        <a
          href="https://linkedin.com/in/ravikant04"
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 w-8 border border-gray-500 rounded-full flex justify-center items-center hover:bg-gray-50 shadow"
        >
          <LinkedinIcon width={20} className="cursor-pointer" />
        </a>
      </div>
    </div>
  );
}

export default Footer;
