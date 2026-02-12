import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "../Components/ui/TiltedCard";
import Title from "../Components/Title/Title";
import { AppContext } from "../context/AppContext";

export default function CustomizableProducts() {
  const navigate = useNavigate();
  const { products } = useContext(AppContext);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Case-insensitive filter
  const customizableProducts = products.filter(
    (item) => item.category?.toLowerCase() === "customizable",
  );

  // Pagination logic
  const totalPages = Math.ceil(customizableProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = customizableProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="m-5">
      <div className="text-2xl mb-3">
        <Title text1={"CUSTOMIZABLE"} text2={"CHoose one image"} />
      </div>
      {/* Products */}
      {customizableProducts.length === 0 ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-500 text-lg text-center">
            No customizable products available right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
          {paginatedProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/customize/${product._id}`)}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
            >
              <div className="aspect-[4/5]">
                <TiltedCard
                  imageSrc={product.images?.[0]}
                  altText={product.title}
                  captionText={"Customize Now"}
                />
              </div>

              <p className="text-center mt-2 font-medium">{product.title}</p>
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 items-center">
          {/* Prev */}
          <button
            className="btn btn-sm bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {/* Numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-active" : "btn-outline"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            className="btn btn-sm bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200"
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
