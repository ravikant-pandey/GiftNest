import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductItems from "../Components/ProductItems/ProductItems";

function Anniversary() {
  const { products } = useContext(AppContext);
  const anniversaryProducts = products.filter(
    (item) => item.category?.toLowerCase() === "anniversary",
  );
  return (
    <div className="mt-10">
      {anniversaryProducts.length === 0 ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 text-lg text-center">
            No anniversary products available right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {anniversaryProducts.map((item) => (
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

export default Anniversary;
