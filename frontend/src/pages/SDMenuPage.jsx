import { useState, useEffect, useContext } from "react";
import { SDCanteenContext } from "../context/SDCanteenContext";
import { CartContext } from "../context/CartContext";
import SDMenuItemCard from "../components/SDMenuItemCard";
import api from "../services/api";
import { feedbackAPI } from "../services/api";
import SDFooter from "../components/SDFooter";
import SDHeader from "../components/SDHeader";
import toast from "react-hot-toast";

const SDMenuPage = () => {
  const { selectedCanteenId, canteens } = useContext(SDCanteenContext);
  const { addToCart } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [todaysPromotions, setTodaysPromotions] = useState([]);
  const [promotionLoading, setPromotionLoading] = useState(false);

  const selectedCanteen = canteens.find(
    (canteen) => canteen._id === selectedCanteenId,
  );
  const selectedCanteenName = selectedCanteen?.name || "";

  const fetchMenuItems = async () => {
    if (!selectedCanteenId) return;
    setLoading(true);
    try {
      const res = await api.get("http://localhost:5001/api/inventory", {
        headers: { "x-canteen-id": selectedCanteenId },
      });
      setItems(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    setFeedbackLoading(true);
    setFeedbackError("");
    try {
      const response = await feedbackAPI.getAllFeedback();
      setFeedbackList(response.data || []);
    } catch (error) {
      console.error(error);
      setFeedbackError("Failed to load feedback");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const normalizeCanteenName = (canteenName) => {
    switch ((canteenName || "").trim()) {
      case "New canteen":
      case "New Canteen":
        return "Main Canteen";
      case "Basement canteen":
      case "Basement Canteen":
        return "Hostel Canteen";
      case "Anohana Canteen":
        return "Mini Canteen";
      default:
        return canteenName || "Unknown";
    }
  };

  const fetchTodaysPromotions = async () => {
    setPromotionLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5001/api/promotions/today",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch daily promotions");
      }

      const data = await response.json();
      setTodaysPromotions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setTodaysPromotions([]);
    } finally {
      setPromotionLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCanteenId]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    fetchTodaysPromotions();
  }, []);

  // Live search + category filter
  const filteredItems = items
    .filter(
      (item) => categoryFilter === "All" || item.category === categoryFilter,
    )
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const visibleFeedback = selectedCanteenName
    ? feedbackList.filter(
        (feedback) =>
          feedback.canteen?.trim().toLowerCase() ===
          selectedCanteenName.trim().toLowerCase(),
      )
    : feedbackList;

  const dailyPromotionForCanteen = selectedCanteenName
    ? todaysPromotions.find(
        (promotion) =>
          normalizeCanteenName(promotion.canteenName).trim().toLowerCase() ===
          selectedCanteenName.trim().toLowerCase(),
      )
    : null;

  const getFeedbackCanteenLabel = (canteen) => {
    const normalizedCanteen = canteen?.trim();

    if (
      !normalizedCanteen ||
      normalizedCanteen === "Choose the Canteen" ||
      normalizedCanteen === "Select Canteen"
    ) {
      return "Unknown Canteen";
    }

    return normalizedCanteen;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${index < rating ? "text-amber-400" : "text-slate-300"}`}
      >
        ★
      </span>
    ));
  };

  const handleAddPromotionToCart = () => {
    if (!dailyPromotionForCanteen) {
      toast.error("No daily promotion available for this canteen");
      return;
    }

    if (dailyPromotionForCanteen.isAvailable === false) {
      toast.error("This promotion is currently unavailable");
      return;
    }

    const promotionPrice = Number(dailyPromotionForCanteen.discountedPrice);
    if (!Number.isFinite(promotionPrice) || promotionPrice <= 0) {
      toast.error("Invalid promotion price");
      return;
    }

    const promotionItem = {
      _id:
        dailyPromotionForCanteen._id ||
        `promo-${selectedCanteenId || "canteen"}`,
      name: dailyPromotionForCanteen.title || "Daily Promotion",
      price: promotionPrice,
    };

    addToCart(promotionItem);
    toast.success("Daily promotion added to cart!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-400">
      {/* Advanced Navbar */}

      <SDHeader />

      <main className="pt-28 pb-12 px-8 max-w-7xl mx-auto">
        {/* Daily Promotion For Selected Canteen */}
        <section className="relative mb-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {promotionLoading ? (
            <div className="flex min-h-[260px] items-center justify-center">
              <p className="text-slate-600 font-medium">
                Loading today's promotion...
              </p>
            </div>
          ) : dailyPromotionForCanteen ? (
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative min-h-[260px] lg:min-h-[340px]">
                {dailyPromotionForCanteen.image ? (
                  <img
                    src={dailyPromotionForCanteen.image}
                    alt={dailyPromotionForCanteen.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100">
                    <span className="material-symbols-outlined text-6xl text-slate-400">
                      restaurant
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>

              <div className="flex flex-col justify-between p-6 lg:p-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
                    <span className="material-symbols-outlined text-base">
                      local_fire_department
                    </span>
                    DAILY PROMOTION ·{" "}
                    {selectedCanteenName || "Selected Canteen"}
                  </div>

                  <h2 className="text-3xl font-black leading-tight text-slate-900">
                    {dailyPromotionForCanteen.title}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {dailyPromotionForCanteen.description ||
                      "Special limited-time offer for today."}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Now
                      </p>
                      <p className="text-3xl font-black text-blue-700">
                        Rs. {dailyPromotionForCanteen.discountedPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Was</p>
                      <p className="text-sm text-slate-400 line-through">
                        Rs. {dailyPromotionForCanteen.originalPrice}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleAddPromotionToCart}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Add Promotion to Cart
                    <span className="material-symbols-outlined text-lg">
                      shopping_cart
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
              <span className="material-symbols-outlined mb-3 text-5xl text-slate-300">
                local_offer
              </span>
              <h2 className="text-xl font-bold text-slate-700">
                No daily promotion for this canteen
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Select another canteen or check back later for new offers.
              </p>
            </div>
          )}
        </section>

        {/* Menu Search */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 py-3.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {["All", "Short Eats", "Rice & Curry", "Beverages", "Desserts"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-8 py-3 rounded-3xl font-semibold transition-all text-sm ${
                  categoryFilter === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                {cat}
              </button>
            ),
          )}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <SDMenuItemCard key={item._id} item={item} />
          ))}
        </div>

        {/* User Feedback Section */}
        <section className="mt-20">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">
                Community Voice
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">
                What students are saying
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                {selectedCanteenName
                  ? `Showing feedback for ${selectedCanteenName}.`
                  : "Showing feedback from all canteens."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Filter
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {selectedCanteenName || "All Canteens"}
              </p>
            </div>
          </div>

          {feedbackLoading ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-600">
              Loading feedback...
            </div>
          ) : feedbackError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              {feedbackError}
            </div>
          ) : visibleFeedback.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-600">
              No feedback available for this canteen yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleFeedback.map((feedback) => (
                <article
                  key={feedback._id}
                  className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_-28px_rgba(0,86,210,0.22)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {feedback.name}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        <span className="material-symbols-outlined text-[16px] text-blue-600">
                          restaurant
                        </span>
                        Canteen: {getFeedbackCanteenLabel(feedback.canteen)}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 rounded-full bg-amber-50 px-3 py-1">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="break-words text-sm leading-relaxed text-slate-700 line-clamp-5">
                      {feedback.message}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                      {feedback.feedbackType}
                    </span>
                    <span>{feedback.userType}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Advanced Footer */}
      <SDFooter />
    </div>
  );
};

export default SDMenuPage;
