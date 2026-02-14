import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import ProductItems from "../Components/ProductItems/ProductItems";

function Wedding() {
  const { products } = useContext(AppContext);
  const weddingProducts = products.filter(
    (item) => item.category?.toLowerCase() === "wedding",
  );
  return (
    <div className="mt-10">
      {weddingProducts.length === 0 ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 text-lg text-center">
            No wedding products available right now.
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

export default Wedding;
