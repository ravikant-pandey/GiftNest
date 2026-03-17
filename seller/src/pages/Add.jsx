import { assets } from "../assets/admin_assets/assets";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../Context/AppContext";

const Add = () => {
  const { backendUrl } = useContext(AppContext);
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image4, setImage4] = useState(false);
  const [image3, setImage3] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mrp, setMrp] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [stock, setStock] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("mrp", mrp);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("stock", stock);
      formData.append("deliveryDays", deliveryDays);

      // ⭐ IMPORTANT — SAME KEY FOR ALL IMAGES
      image1 && formData.append("images", image1);
      image2 && formData.append("images", image2);
      image3 && formData.append("images", image3);
      image4 && formData.append("images", image4);

      const { data } = await axios.post(
        backendUrl + "/product/add-product",
        formData,
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);

        // reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory("");
        setSubCategory("");
        setStock("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setBestseller(false);
        setDeliveryDays("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* IMAGES */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label className="cursor-pointer" htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt="upload_area"
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label className="cursor-pointer" htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt="upload_area"
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label className="cursor-pointer" htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt="upload_area"
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label className="cursor-pointer" htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt="upload_area"
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      {/* TITLE */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type Here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>

      {/* DESCRIPTION */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Add Product Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          name="description"
          required
        />
      </div>

      {/* CATEGORY */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="" disabled selected>
              Select one
            </option>
            <option value="birthday">Birthday</option>
            <option value="festival">Festival</option>
            <option value="wedding">Wedding</option>
            <option value="anniversary">Anniversary</option>
            <option value="flowers">Flowers</option>
            <option value="customizable">Customized</option>
            <option value="chocolates">Chocolates</option>
            <option value="plants">Plants</option>
          </select>
        </div>
        {/* SUB CATEGORY */}
        <div>
          <p className="mb-2">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
          >
            <option value="" disabled selected>
              Select one
            </option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </div>
      </div>

      {/* MRP */}
      <div className="max-w-2xl">
        <p className="mb-2">MRP (Actual Price)</p>
        <input
          className="w-full px-3 py-2 sm:w-[120px] border p-2 rounded"
          type="Number"
          placeholder="25"
          onChange={(e) => setMrp(e.target.value)}
          value={mrp}
          required
        />
      </div>

      {/* PRICE */}
      <div>
        <p className="mb-2 max-w-2xl">Product Price</p>
        <input
          className="w-full px-3 py-2 sm:w-[120px] border p-2 rounded "
          type="Number"
          placeholder="25"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          required
        />
      </div>

      {/* STOCK */}
      <div>
        <p className="mb-2">Product Stock</p>
        <input
          className="w-full px-3 py-2 sm:w-[120px]"
          type="Number"
          placeholder="25"
          onChange={(e) => setStock(e.target.value)}
          value={stock}
          required
        />
      </div>

      {/* DELIVERY DAYS */}
      <div className="max-w-2xl">
        <p className="mb-2">Delivery Days</p>
        <select
          value={deliveryDays}
          onChange={(e) => setDeliveryDays(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Delivery Days</option>
          <option value="1">1 Day</option>
          <option value="3">3 Days</option>
          <option value="5">5 Days</option>
          <option value="7">7 Days</option>
        </select>
      </div>

      {/* BESTSELLER */}
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      {/* SUBMIT BUTTON */}
      <button className="w-28 py-3 mt-4 bg-black text-white" type="submit">
        ADD
      </button>
    </form>
  );
};

export default Add;
