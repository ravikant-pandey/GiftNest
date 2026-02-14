import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Collection from "./Pages/Collection";
import Orders from "./Pages/Orders";
import Login from "./Pages/Login";
import Product from "./Pages/Product";
import PlaceOrder from "./Pages/PlaceOrder";
import Cart from "./Pages/Cart";
import Footer from "./Components/Footer/Footer";

import Birthday from "./Pages/Birthday";
import Festival from "./Pages/Festival";
import Wedding from "./Pages/Wedding";
import Flowers from "./Pages/Flowers";
import Customized from "./Pages/Customized";
import Chocolates from "./Pages/Chocolates";
import Anniversary from "./Pages/Anniversary";
import Navbar from "./Components/Navbar/Navbar";
import Profile from "./Pages/Profile";
import Plants from "./Pages/Plants";
import CustomizableProducts from "./Pages/CustomizableProducts";
import NotFound from "./Pages/NotFound";
import Verify from "./Pages/Verify";

function App() {
  return (
    <>
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-4">
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/cart" element={<Cart />} />

          {/* Categories */}
          <Route path="/birthday" element={<Birthday />} />
          <Route path="/festival" element={<Festival />} />
          <Route path="/wedding" element={<Wedding />} />
          <Route path="/anniversary" element={<Anniversary />} />
          <Route path="/flowers" element={<Flowers />} />
          <Route path="/chocolates" element={<Chocolates />} />
          <Route path="/plants" element={<Plants />} />

          {/* ✅ Customizable Flow */}
          <Route path="/customizable" element={<CustomizableProducts />} />
          <Route path="/customize/:id" element={<Customized />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/verify" element={<Verify />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
