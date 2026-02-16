import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
function NewsLetters() {
    const [email, setEmail] = useState("");
    const { backendUrl } = useContext(AppContext);
    const onEmailSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `${backendUrl}/newsletter/subscribe`,
          {
            email,
          },
        );
        if (data.success) {
          toast.success(data.message);
          setEmail("");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-700">
        Subscribe now & get 20% off on your first order
      </p>
      <p className="text-gray-400 nt-3">
        Join our newsletter and take 20% off your first purchase—just for
        signing up.
      </p>
      <form
        onSubmit={onEmailSubmit}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 rounded"
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className=" uppercase bg-black text-white text-xs px-10 py-4 rounded"
          type="submit"
          disabled={!email}
          onClick={onEmailSubmit}
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

export default NewsLetters;
