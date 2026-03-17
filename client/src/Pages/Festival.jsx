import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import ProductItems from "../Components/ProductItems/ProductItems";

function Festival() {
  const { products } = useContext(AppContext);

  const festivalProducts = products.filter(
    (item) => item.category?.toLowerCase() === "festival",
  );
  return (
    <div className="mt-10">
      {festivalProducts.length === 0 ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 text-lg text-center">
            No festival products available right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {festivalProducts.map((item) => (
            <ProductItems
              key={item._id}
              title={item.title}
              price={item.price}
              images={item.images}
              id={item._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Festival;
