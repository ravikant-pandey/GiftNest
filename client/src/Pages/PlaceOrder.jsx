import { useContext, useState } from "react";
import Title from "../Components/Title/Title";
import CartTotal from "../Components/CartTotal/CartTotal";
import { assets } from "../assets/frontend_assets/assets";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../Context/AppContext";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");

  const {
    navigate,
    backendUrl,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fees,
    userData,
  } = useContext(AppContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount, // ✅ already in paise
      currency: "INR",
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/order/verify-razorpay`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true },
          );

          if (data.success) {
            setCartItems([]);
            navigate("/orders");
            toast.success(data.message);
          } else {
            toast.error(data.message);
            window.location.reload();
          }
        } catch (error) {}
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const { amount } = getCartAmount();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    try {
      let price = amount;

      if (price <= 500) {
        price += delivery_fees;
      }

      const orderData = {
        address: formData,
        product: cartItems, // direct send
        amount: price,
      };

      if (method === "cod") {
        const { data } = await axios.post(
          `${backendUrl}/order/place-order`,
          orderData,
          { withCredentials: true },
        );

        if (data.success) {
          setCartItems([]); //  array empty
          navigate("/orders");
        } else {
          toast.error(data.message);
        }
      }

      if (method === "stripe") {
        const { data } = await axios.post(
          `${backendUrl}/order/place-order-stripe`,
          orderData,
          { withCredentials: true },
        );

        if (data.success) {
          window.location.replace(data.session_url);
        } else {
          toast.error(data.message);
        }
      }
      if (method === "razorpay") {
        const responseRazorPay = await axios.post(
          `${backendUrl}/order/razorpay`,
          orderData,
          { withCredentials: true },
        );

        if (responseRazorPay.data.success) {
          initPay(responseRazorPay.data.order);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* LEFT SIDE - ADDRESS FORM */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            required
            className="border rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First Name"
            name="firstName"
            onChange={onChangeHandler}
          />
          <input
            required
            className="border rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last Name"
            name="lastName"
            onChange={onChangeHandler}
          />
        </div>

        <input
          required
          className="border rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email Address"
          name="email"
          onChange={onChangeHandler}
        />
        <input
          required
          className="border rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
          name="street"
          onChange={onChangeHandler}
        />

        <div className="flex gap-3">
          <input
            required
            className="border rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
            name="city"
            onChange={onChangeHandler}
          />
          <input
            required
            className="border rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
            name="state"
            onChange={onChangeHandler}
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            className="border rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
            name="zipcode"
            onChange={onChangeHandler}
          />
          <input
            required
            className="border rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
            name="country"
            onChange={onChangeHandler}
          />
        </div>

        <input
          required
          className="border rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
          name="phone"
          onChange={onChangeHandler}
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="mt-8">
        <CartTotal />

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`}
              ></p>
              <img
                className={`h-5 mx-4`}
                src={assets.razorpay_logo}
                alt="Razorpay"
              />
            </div>
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
