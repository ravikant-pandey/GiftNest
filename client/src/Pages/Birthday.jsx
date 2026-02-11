import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductItems from "../Components/ProductItems/ProductItems";

function Birthday() {
  const { products } = useContext(AppContext);

  return (
    <div className="mt-10">
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
    </div>
  );
}

export default Birthday;
