import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import TiltedCard from "../ui/TiltedCard";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(AppContext);

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden rounded-2xl shadow-2xl">
        <TiltedCard
          imageSrc={image[0]}
          altText={name}
          captionText={"Shop Now"}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
