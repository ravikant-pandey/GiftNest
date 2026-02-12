import { assets } from "../../assets/frontend_assets/assets";

function Search() {
  
  return (
    <div className="w-full relative">
      <img
        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        src={assets.search_icon}
        alt="search-icon"
      />
      <input
        type="text"
        className="w-full border py-2 pl-3 pr-9 rounded focus:outline-black"
        placeholder="Search..."
      />
    </div>
  );
}

export default Search;
