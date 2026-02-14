import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import ProductItems from "../Components/ProductItems/ProductItems";

function Flowers() {
  const { products } = useContext(AppContext);
  const flowersProducts = products.filter(
    (item) => item.category?.toLowerCase() === "flowers",
  );
  return (
    <div className="mt-10">
      {flowersProducts.length === 0 ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 text-lg text-center">
            No flowers products available right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {products.map((item, index) => (
            <ProductItems
              key={index}
              name={item.name}
              price={item.price}
              image={item.image}
              id={item._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Flowers;
