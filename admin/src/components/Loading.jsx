import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingIndicator = ({ message }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 2000); // Delay for showing the message

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
      {showMessage && (
        <p className="mt-2 text-lg text-center text-gray-700">
          {message || "Loading your content..."}
        </p>
      )}
    </div>
  );
};

export default LoadingIndicator;
