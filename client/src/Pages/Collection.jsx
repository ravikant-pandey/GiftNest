import { useContext, useEffect, useState } from "react";
import {
  assets,
  category as CATEGORY_LIST,
  subCategory as SUBCATEGORY_LIST,
} from "../assets/frontend_assets/assets";
import Title from "../components/Title/Title";
import ProductItem from "../components/ProductItem/ProductItem";
import { AppContext } from "../context/AppContext";

const Collection = () => {
  const { products, search, showSearch } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const toggleCategory = (e) => {
    const value = e.target.value;
    setSelectedCategory((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSelectedSubCategory((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  };

  useEffect(() => {
    let filtered = [...products];

    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (selectedCategory.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategory.some(
          (cat) => cat.toLowerCase() === item.category?.toLowerCase(),
        ),
      );
    }

    if (selectedSubCategory.length > 0) {
      filtered = filtered.filter((item) =>
        selectedSubCategory.some(
          (sub) => sub.toLowerCase() === item.subCategory?.toLowerCase(),
        ),
      );
    }

    if (sortType === "low-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sortType === "high-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilterProducts(filtered);
    setCurrentPage(1);
  }, [
    products,
    search,
    showSearch,
    selectedCategory,
    selectedSubCategory,
    sortType,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filterProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
      {/* Filters */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {CATEGORY_LIST.map((item) => (
              <label key={item} className="flex gap-2">
                <input
                  type="checkbox"
                  value={item}
                  checked={selectedCategory.includes(item)}
                  onChange={toggleCategory}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Sub Category */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {SUBCATEGORY_LIST.map((item) => (
              <label key={item} className="flex gap-2">
                <input
                  type="checkbox"
                  value={item}
                  checked={selectedSubCategory.includes(item)}
                  onChange={toggleSubCategory}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />

          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {paginatedProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              title={item.title}
              price={item.price}
              images={item.images}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
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
    </div>
  );
};

export default Collection;
