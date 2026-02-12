import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import TiltedCard from "../ui/TiltedCard";

const ProductItem = ({ id, images, title, price }) => {
  const firstImage = images?.[0];
  const { currency } = useContext(AppContext);
  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden rounded-2xl shadow-2xl aspect-[4/5]">
        <TiltedCard
          imageSrc={firstImage}
          altText={title}
          captionText={"Shop Now"}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{title}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
