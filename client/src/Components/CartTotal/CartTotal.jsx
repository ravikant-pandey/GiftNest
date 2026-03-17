import { useContext } from "react";
import Title from "../Title/Title";
import { AppContext } from "../../Context/AppContext";

const CartTotal = () => {
  const { currency, delivery_fees, getCartAmount } = useContext(AppContext);

  const { amount, totalMrp, discount } = getCartAmount();
  const subtotal = amount;

  const isFreeDelivery = subtotal >= 500 && subtotal !== 0;

  const total =
    subtotal === 0 ? 0 : subtotal < 500 ? subtotal + delivery_fees : subtotal;
  const savedAmount = isFreeDelivery ? discount + delivery_fees : discount;
  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        {/* MRP */}
        <div className="flex justify-between">
          <p>MRP</p>
          <p className="line-through text-gray-400">
            {currency}
            {totalMrp}.00
          </p>
        </div>

        <hr />
        <div className="flex justify-between">
          <p>Price</p>
          <p className=" text-gray-400">
            {currency}
            {amount}.00
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
                {delivery_fees}
              </span>
              FREE
            </p>
          ) : (
            <p className="text-red-500 font-medium">
              {currency}
              {subtotal === 0 ? 0 : delivery_fees}.00
            </p>
          )}
        </div>

        <hr />

        {/* Discount */}
        <div className="flex justify-between items-center">
          <p>Discount</p>
          <p className="text-green-600 font-medium">
            - {currency}
            {discount}.00
          </p>
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
        {/* You will Save */}
        <div className="bg-green-100 text-green-700 text-sm font-semibold p-2 rounded mt-2 ">
          <p className="text-center">
            🎉 You will save {currency}
            {savedAmount}.00 on this order
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
