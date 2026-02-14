import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Title from "../Title/Title";
import ProductItems from "../ProductItems/ProductItems";

function BestSeller() {
  const { products } = useContext(AppContext);

  const [bestseller, setBestSeller] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const bestProduct = products.filter(
      (product) => product.bestseller && product.featured,
    );

    setBestSeller(bestProduct);
    setCurrentPage(1);
  }, [products]);

  // Pagination logic
  const totalPages = Math.ceil(bestseller.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = bestseller.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="mt-6">
      <div className="text-center py-8 text-2xl md:text-3xl">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover the best sellers that define quality, style, and timeless
          appeal.
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6">
        {paginatedProducts.map((product) => (
          <ProductItems
            key={product._id}
            id={product._id}
            title={product.title}
            price={product.price}
            images={product.images}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-active" : ""
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default BestSeller;
