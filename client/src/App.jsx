import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Collection from "./pages/Collection";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Product from "./pages/Product";
import PlaceOrder from "./pages/PlaceOrder";
import Cart from "./pages/Cart";
import Footer from "./components/Footer/Footer";

import Birthday from "./pages/Birthday";
import Festival from "./pages/Festival";
import Wedding from "./pages/Wedding";
import Flowers from "./pages/Flowers";
import Customized from "./pages/Customized";
import Chocolates from "./pages/Chocolates";
import Anniversary from "./pages/Anniversary";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile";
import Plants from "./pages/Plants";
import CustomizableProducts from "./pages/CustomizableProducts";
import NotFound from "./pages/NotFound";
import Verify from "./pages/Verify";

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
