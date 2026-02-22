import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import SearchData from "./SearchData";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!keyword) return;

      try {
        const { data } = await axios.get(
          `${backendUrl}/product/search?keyword=${keyword}`,
        );

        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [keyword]);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-xl font-semibold mb-6">
        Search Results for "{keyword}"
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item) => (
          <SearchData
            key={item._id}
            id={item._id}
            images={item.images}
            title={item.title}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
