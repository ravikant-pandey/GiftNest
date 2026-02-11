import React, { useEffect, useState } from "react";

const LoadingAnimation = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);

    const handler = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", handler);
    return () => darkModeQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-t-transparent border-[#1976d2] dark:border-[#1976d2] rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-t-transparent border-[#1976d2]/80 dark:border-[#1976d2]/80 rounded-full animate-spin-slow" />
          <div className="absolute inset-4 border-4 border-t-transparent border-[#1976d2]/60 dark:border-[#1976d2]/60 rounded-full animate-spin-slower" />
        </div>

        <div className="mt-8 text-2xl font-bold text-[#1976d2] dark:text-[#1976d2]">
          {"Loading".split("").map((char, index) => (
            <span
              key={index}
              className="inline-block animate-bounce"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {char}
            </span>
          ))}
        </div>

        <div className="flex space-x-2 mt-4">
          <div className="w-3 h-3 bg-[#1976d2] dark:bg-[#1976d2] rounded-full animate-pulse" />
          <div className="w-3 h-3 bg-[#1976d2] dark:bg-[#1976d2] rounded-full animate-pulse delay-100" />
          <div className="w-3 h-3 bg-[#1976d2] dark:bg-[#1976d2] rounded-full animate-pulse delay-200" />
        </div>

        <div className="mt-8 w-16 h-16 bg-gradient-to-r from-[#1976d2]/80 to-[#1976d2] dark:from-[#1976d2]/80 dark:to-[#1976d2] rounded-lg animate-morph" />
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slower {
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes morph {
          0% {
            border-radius: 60% 40% 30% 70%/60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40%/50% 60% 30% 60%;
          }
          100% {
            border-radius: 60% 40% 30% 70%/60% 30% 70% 40%;
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 4s linear infinite;
        }
        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
