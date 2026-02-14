import BestSeller from "../Components/BestSeller/BestSeller";
import Categories from "../Components/Categories/Categories";
import Hero from "../Components/Hero/Hero";
import LatestCollections from "../Components/LatestCollections/LatestCollections";
import NewsLetters from "../Components/NewsLetters/NewsLetters";
import OurPolicy from "../Components/OurPolicy/OurPolicy";
import Search from "../Components/Search/Search";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
function Home() {
  const { visible } = useContext(AppContext);
  return (
    <div>
      {!visible && (
        <div className=" mt-2 md:hidden">
          <Search />
        </div>
      )}

      <Categories />
      <Hero />
      <LatestCollections />
      <BestSeller />
      <OurPolicy />
      <NewsLetters />
    </div>
  );
}

export default Home;
