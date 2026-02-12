import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import Title from "../Title/Title";
import ProductItems from "../ProductItems/ProductItems";

function LatestCollections() {
  const { products } = useContext(AppContext);

  const [latestProducts, setLatestProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const filtered = products
      .filter((p) => p.featured === true) //  featured only
      .slice(0, 10); // latest 10

    setLatestProducts(filtered);
    setCurrentPage(1);
  }, [products]);


  // Pagination logic
  const totalPages = Math.ceil(latestProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = latestProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (latestProducts.featured) return null;

  return (
    <div className="mt-6">
      <div className="text-center py-8 text-2xl md:text-3xl">
        <Title text1="Latest" text2="Collections" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore the latest collection where timeless elegance meets modern
          design.
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-4 gap-y-6">
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

export default LatestCollections;
