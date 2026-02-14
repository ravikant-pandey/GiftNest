import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { Link } from "react-router-dom";
import TiltedCard from "../ui/TiltedCard";

function ProductItems({ id, title, price, images }) {
  const { currency } = useContext(AppContext);
  const firstImage = images?.[0];
  return (
    <Link className="text-gray-700 cursor-pointer " to={`/product/${id}`}>
      <div className="overflow-hidden rounded-2xl shadow-lg flex items-center justify-center">
        <TiltedCard
          imageSrc={firstImage}
          altText={title}
          captionText="Shop Now!"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.05}
          showMobileWarning={false}
          showTooltip
          displayOverlayContent
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{title}</p>
      <p className="text-sm font-medium">
        {currency} {price}
      </p>
    </Link>
  );
}

export default ProductItems;
