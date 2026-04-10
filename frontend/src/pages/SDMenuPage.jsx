import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SDCanteenContext } from "../context/SDCanteenContext";
import { CartContext } from "../context/CartContext";

import SDMenuItemCard from "../components/SDMenuItemCard";
import SDFooter from "../components/SDFooter";
import SDHeader from "../components/SDHeader";
import api from "../services/api";
import ramen from "../assets/ramen.jpg";

const SDMenuPage = () => {
  const navigate = useNavigate();

  const { selectedCanteenId } = useContext(SDCanteenContext);
  const { addToCart } = useContext(CartContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMenuItems = async () => {
    if (!selectedCanteenId) return;

    setLoading(true);
    try {
      const res = await api.get("http://localhost:5001/api/inventory", {
        headers: {
          "x-canteen-id": selectedCanteenId,
        },
      });

      setItems(res.data.data);
    } catch (error) {
      console.error("Menu fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCanteenId]);

  const filteredItems = items
    .filter(
      (item) => categoryFilter === "All" || item.category === categoryFilter,
    )
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  // 👉 FIXED ORDER BUTTON FLOW
  const handleOrderClick = (item) => {
    addToCart(item);

    // 🚀 instead of login page → go to order status
    navigate("/order-status", {
      state: {
        fromMenu: true,
        item,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-400">
      <SDHeader />

      <main className="pt-28 pb-12 px-8 max-w-7xl mx-auto">
        {/* HERO */}
        <section className="relative h-[460px] rounded-3xl overflow-hidden mb-16 shadow-xl">
          <img src={ramen} className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-center px-12">
            <div className="text-white max-w-xl">
              <h1 className="text-6xl font-black mb-6">
                Sri Lankan Spiced Ramen
              </h1>

              <button
                onClick={() =>
                  handleOrderClick({
                    _id: "special",
                    name: "Ramen Special",
                    price: 850,
                    quantity: 1,
                  })
                }
                className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold"
              >
                Order Now — Rs. 850
              </button>
            </div>
          </div>
        </section>

        {/* FILTER */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {["All", "Short Eats", "Rice & Curry", "Beverages", "Desserts"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-8 py-3 rounded-3xl font-semibold ${
                  categoryFilter === cat ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                {cat}
              </button>
            ),
          )}
        </div>

        {/* MENU GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            filteredItems.map((item) => (
              <SDMenuItemCard
                key={item._id}
                item={item}
                addToCart={handleOrderClick} // 🔥 FIX HERE
              />
            ))
          )}
        </div>
      </main>

      <SDFooter />
    </div>
  );
};

export default SDMenuPage;
