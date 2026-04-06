import { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../Context/AppContext";

const RefundForm = ({ orderId, amount, onClose }) => {
  const { backendUrl } = useContext(AppContext);

  const [formData, setFormData] = useState({
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    accountHolderName: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/refund/get-refund`,
        {
          orderId,
          amount,
          ...formData,
        },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 border rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Refund Request</h2>

      <input
        type="text"
        name="accountHolderName"
        placeholder="Account Holder Name"
        value={formData.accountHolderName}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="accountNumber"
        placeholder="Account Number"
        value={formData.accountNumber}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="bankName"
        placeholder="Bank Name"
        value={formData.bankName}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="ifscCode"
        placeholder="IFSC Code"
        value={formData.ifscCode}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded"
      >
        Submit Refund Request
      </button>
    </form>
  );
};

export default RefundForm;
