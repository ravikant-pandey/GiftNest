import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Product = () => {
  const { productId } = useParams();
  const { products, backendUrl, currency, addToCart } = useContext(AppContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [personalisedText, setPersonalisedText] = useState("");
  const [personalisedImage, setPersonalisedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchProductData = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/product/single`, {
        productId,
      });
      if (data.success) {
        setProductData(data.product);
        setImage(data.product.images[0]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

const handleAddToCart = async () => {
  if (productData.category === "customizable") {
    if (!personalisedText.trim() && !personalisedImage) {
      toast.error("Please add text or upload image");
      return;
    }

    let imageUrl = null;

    try {
      if (personalisedImage) {
        const formData = new FormData();
        formData.append("image", personalisedImage);

        const uploadRes = await axios.post(
          `${backendUrl}/upload/upload-custom-image`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        imageUrl = uploadRes.data.imageUrl;
      }

      addToCart(productData._id, personalisedText || null, imageUrl || null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }

    return;
  }

  // normal product
  addToCart(productData._id);
};


  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData && productData.featured ? (
    <div className=" pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.images.map((item, index) => (
              <img
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-lg object-cover"
                src={item}
                alt="product_image"
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto rounded-2xl shadow-2xl"
              src={image}
              alt=""
            />
          </div>
        </div>
        {/* Product info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.title}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_dull_icon} alt="" />
            <p className="pl-2">122</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          {productData.category === "customizable" && (
            <div className="mt-6 bg-white p-6 rounded-xl shadow-md border">
              <form className="flex flex-col gap-5">
                {/* Text Input */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">
                    Add Personalised Text
                  </label>

                  <input
                    type="text"
                    placeholder="Eg: Happy Birthday Raj ❤️"
                    required
                    value={personalisedText}
                    onChange={(e) => setPersonalisedText(e.target.value)}
                    className="border rounded-lg px-4 py-2 outline-none 
                     focus:ring-2 focus:ring-black 
                     transition"
                  />
                </div>

                {/* File Upload */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">
                    Upload Image
                  </label>

                  <label className="border-2 rounded-lg p-2 text-center cursor-pointer hover:bg-gray-50 transition">
                    <p className="text-gray-500">Click to upload image</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                    <input
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setPersonalisedImage(file);
                        setPreviewImage(URL.createObjectURL(file));
                      }}
                      type="file"
                      className="hidden"
                    />
                  </label>
                </div>
                {previewImage && (
                  <div className="mt-3">
                    <p className="text-sm text-green-600 mb-2">
                      Image selected successfully ✅
                    </p>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </form>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 mt-4 rounded-2xl"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      {/* Description and review section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          {productData.description}
        </div>
      </div>
      {/* display related products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0">Loading....</div>
  );
};

export default Product;
