import { useContext } from "react";
import Title from "../Title/Title";
import { AppContext } from "../../Context/AppContext";

const CartTotal = () => {
  const { currency, deliveryFee, getCartAmount } = useContext(AppContext);

  const subtotal = getCartAmount();
  const isFreeDelivery = subtotal >= 500 && subtotal !== 0;

  const total =
    subtotal === 0 ? 0 : subtotal < 500 ? subtotal + deliveryFee : subtotal;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}
            {subtotal}.00
          </p>
        </div>

        <hr />

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <p>Shipping Fee</p>

          {isFreeDelivery ? (
            <p className="text-green-600 font-semibold">
              <span className="line-through text-gray-400 mr-2">
                {currency}
                {deliveryFee}
              </span>
              FREE 
            </p>
          ) : (
            <p className="text-red-500 font-medium">
              {currency}
              {subtotal === 0 ? 0 : deliveryFee}.00
            </p>
          )}
        </div>

        <hr />

        {/* Total */}
        <div className="flex justify-between text-sm">
          <b>Total</b>
          <b className="text-green-700">
            {currency}
            {total}.00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
