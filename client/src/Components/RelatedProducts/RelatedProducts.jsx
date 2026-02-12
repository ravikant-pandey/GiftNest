import React, { useContext, useEffect, useState } from "react";
import Title from "../Title/Title";
import ProductItem from "../ProductItem/ProductItem";
import { AppContext } from "../../Context/AppContext";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(AppContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory,
      );
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products]);
  
 if (related.featured) return null;

    return (
      <div className="my-24">
        <div className="text-center text-3xl py-2">
          <Title text1={"RELATED"} text2={"PRODUCTS"} />
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-4 gap-y-6">
            {related.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                title={item.title}
                price={item.price}
                images={item.images}
              />
            ))}
          </div>
        </div>
      </div>
    );
};

export default RelatedProducts;
