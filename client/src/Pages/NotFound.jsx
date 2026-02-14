import { Link } from "react-router-dom";
import VariableProximity from "../components/ui/VariableProximity";
import { useRef } from "react";
import Title from "../components/Title/Title";

function NotFound() {
  const containerRef = useRef(null);

  return (
    <div className="min-h-screen px-4 flex flex-col justify-center items-center gap-5 text-center">
      {/* Title */}
      <div className="text-4xl sm:text-5xl md:text-6xl">
        <Title text1={"404"} text2={"Page Not Found"} />
      </div>

      {/* Description */}
      <div
        ref={containerRef}
        className="relative flex flex-col items-center max-w-3xl"
      >
        <VariableProximity
          label="Oops! The page you’re looking for doesn’t exist or has been moved. Let’s get you back on track."
          className="variable-proximity-demo text-base sm:text-lg md:text-2xl leading-relaxed"
          fromFontVariationSettings="'wght' 400, 'opsz' 9"
          toFontVariationSettings="'wght' 1000, 'opsz' 40"
          containerRef={containerRef}
          radius={120}
          falloff="linear"
        />

        <Link to="/" className="mt-10">
          <button
            className="
      text-sm sm:text-base md:text-lg
      px-6 py-2
      rounded-2xl
      bg-gradient-to-r from-gray-700 via-gray-500 to-gray-800
      text-white
      border border-gray-600
      shadow-lg
      hover:from-gray-800 hover:via-gray-600 hover:to-gray-900
      hover:scale-105
      active:scale-95
      transition-all duration-300
      tracking-wide
    "
          >
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
