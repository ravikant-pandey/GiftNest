import { useState } from "react";
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) return;

    navigate(`/search?keyword=${keyword}`);
  };

  return (
    <div className="w-full relative">
      <img
        onClick={handleSearch}
        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        src={assets.search_icon}
        alt="search-icon"
      />

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full border py-2 pl-3 pr-9 rounded focus:outline-black"
        placeholder="Search..."
      />
    </div>
  );
}

export default Search;
