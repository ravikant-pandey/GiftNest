import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import ProductItems from "../Components/ProductItems/ProductItems";

function Birthday() {
  const { products } = useContext(AppContext);

  const birthdayProducts = products.filter(
    (item) => item.category?.toLowerCase() === "birthday",
  );

  return (
    <div className="mt-10">
      {birthdayProducts.length === 0 ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 text-lg text-center">
            No birthday products available right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {products.map((item, index) => (
            <ProductItems
              key={index}
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

export default Birthday;
