import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import TiltedCard from "../Components/ui/TiltedCard";

const SearchData = ({ id, images, title, price }) => {
  const firstImage = images?.[0];
  const { currency } = useContext(AppContext);
  return (
    <div>
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
    </div>
  );
};

export default SearchData;
