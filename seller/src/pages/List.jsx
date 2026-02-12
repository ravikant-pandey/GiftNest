import axios from "axios";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const List = () => {
  const { backendUrl, currency, productList, fetchProducts } =
    useContext(AppContext);

  const removeProduct = async (id) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/product/delete-product/${id}`,
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
        await fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <p className="mb-2">All Products List</p>

      {productList && productList.length > 0 ? (
        <div className="flex flex-col gap-2">
          {/* List Table Title */}
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
            <b>Image</b>
            <b>Title</b>
            <b>Category</b>
            <b>Price</b>
            <b className="text-center">Action</b>
          </div>

          {/* Product List */}
          {productList.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            >
              <img className="w-12" src={item.images[0]} alt="product-image" />
              <p>{item.title}</p>
              <p>{item.category}</p>
              <p>
                {currency}
                {item.price}
              </p>
              <p
                onClick={() => removeProduct(item._id)}
                className="text-right md:text-center cursor-pointer text-lg"
              >
                X
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 border rounded">
          <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
          <p>You haven't added any products yet.</p>
        </div>
      )}
    </>
  );
};

export default List;
