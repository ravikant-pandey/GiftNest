import BestSeller from "../components/BestSeller/BestSeller";
import Categories from "../components/Categories/Categories";
import Hero from "../components/Hero/Hero";
import LatestCollections from "../components/LatestCollections/LatestCollections";
import NewsLetters from "../Components/NewsLetters/NewsLetters";
import OurPolicy from "../components/OurPolicy/OurPolicy";
import Search from "../components/Search/Search";
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
