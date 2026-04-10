import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

const PromotionForm = ({ canteenName, onSubmit }) => {
  const today = new Date();
  const todayString =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    promotionDate: todayString,
    isAvailable: true,
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [scheduledPromotions, setScheduledPromotions] = useState([]);
  const [showScheduled, setShowScheduled] = useState(false);

  const fetchScheduledPromotions = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/promotions/canteen/${encodeURIComponent(canteenName)}`,
      );
      if (response.ok) {
        const data = await response.json();
        setScheduledPromotions(data);
      }
    } catch (error) {
      console.error("Error fetching scheduled promotions:", error);
    }
  }, [canteenName]);

  // Fetch scheduled promotions for this canteen
  useEffect(() => {
    fetchScheduledPromotions();
  }, [fetchScheduledPromotions]);

  // Auto-select promotion based on current date
  useEffect(() => {
    const today = new Date();
    const todayString =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");
    const todayPromotion = scheduledPromotions.find(
      (p) => p.promotionDate === todayString,
    );

    if (todayPromotion) {
      setFormData({
        title: todayPromotion.title,
        description: todayPromotion.description,
        originalPrice: todayPromotion.originalPrice.toString(),
        discountedPrice: todayPromotion.discountedPrice.toString(),
        promotionDate: todayPromotion.promotionDate,
        isAvailable: todayPromotion.isAvailable,
        image: todayPromotion.image || "",
      });
      toast.success(
        `📅 Auto-loaded today's promotion: ${todayPromotion.title}`,
      );
    }
  }, [scheduledPromotions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
      newErrors.originalPrice = "Original price must be greater than 0";
    }

    if (
      !formData.discountedPrice ||
      parseFloat(formData.discountedPrice) <= 0
    ) {
      newErrors.discountedPrice = "Discounted price must be greater than 0";
    }

    if (
      formData.originalPrice &&
      formData.discountedPrice &&
      parseFloat(formData.discountedPrice) >= parseFloat(formData.originalPrice)
    ) {
      newErrors.discountedPrice =
        "Discounted price must be less than original price";
    }

    if (!formData.promotionDate) {
      newErrors.promotionDate = "Promotion date is required";
    } else {
      const selectedDate = new Date(formData.promotionDate);
      const today = new Date();
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      const selectedDateOnly = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );

      if (selectedDateOnly.getTime() !== todayDate.getTime()) {
        newErrors.promotionDate = "Promotion date must be today";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectScheduledPromotion = (promotion) => {
    const today = new Date();
    const todayString =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    setFormData({
      title: promotion.title,
      description: promotion.description,
      originalPrice: promotion.originalPrice.toString(),
      discountedPrice: promotion.discountedPrice.toString(),
      promotionDate: todayString,
      isAvailable: promotion.isAvailable,
      image: promotion.image || "",
    });
    setShowScheduled(false);
    toast.success(`✅ Selected promotion: ${promotion.title}`);
  };

  const handleDeletePromotion = async (id, title) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/promotions/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setScheduledPromotions((prev) => prev.filter((p) => p._id !== id));
        toast.success(`🗑️ Deleted promotion: ${title}`);
      } else {
        toast.error("Failed to delete promotion");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Error deleting promotion");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("💥 Please fix the errors and try again");
      return;
    }

    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        canteenName,
        originalPrice: parseFloat(formData.originalPrice),
        discountedPrice: parseFloat(formData.discountedPrice),
      };

      await onSubmit(submissionData);

      setFormData({
        title: "",
        description: "",
        originalPrice: "",
        discountedPrice: "",
        promotionDate: "",
        isAvailable: true,
        image: "",
      });

      setErrors({});
      toast.success("✅ Promotion added successfully");
    } catch (error) {
      console.error("Error submitting promotion:", error);
      toast.error("❌ Failed to add promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.08)]">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">
            Promotion Builder
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
            Create a polished promotion
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Fill in the form below to publish a new offer for {canteenName}{" "}
            without changing the underlying behavior.
          </p>

          {/* Scheduled Promotions Toggle */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={showScheduled}
                  onChange={() => setShowScheduled(!showScheduled)}
                  className="sr-only peer"
                />
                <div className="h-6 w-12 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 transition peer-checked:from-green-500 peer-checked:to-emerald-600 peer-checked:shadow-lg peer-checked:shadow-green-500/30"></div>
                <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-gradient-to-br from-white to-green-100 shadow-lg transition peer-checked:translate-x-6 peer-checked:from-green-50 peer-checked:to-green-200 peer-checked:shadow-green-500/50"></span>
              </label>
              <span
                className={`text-sm font-semibold transition-colors ${
                  showScheduled ? "text-green-700" : "text-slate-700"
                }`}
              >
                {showScheduled ? "Hide Scheduled" : "Show Scheduled"} (
                {scheduledPromotions.length})
              </span>
            </div>
            {scheduledPromotions.length > 0 && (
              <span className="text-xs text-slate-500">
                Today: {new Date().toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2.2fr_1fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-lg inline-block">
                  Issuing Campus
                </label>
                <div className="flex items-center gap-4 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 px-6 py-5 shadow-lg shadow-primary/10 relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(0, 86, 210, 0.1) 10px,
                        rgba(0, 86, 210, 0.1) 20px
                      )`,
                      }}
                    ></div>
                  </div>

                  <div className="flex-1 relative z-10">
                    <p className="text-lg font-bold text-slate-900">
                      {canteenName}
                    </p>
                    <p className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">
                      Selected Campus Location
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-primary/10 to-primary/20 border-2 border-primary/30 px-4 py-2 rounded-full relative z-10">
                    <p className="text-xs font-bold text-primary">ACTIVE</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Promotion Item
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Mid-Week Pasta Festival"
                    className={`w-full rounded-[1.5rem] border px-5 py-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                      errors.title
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-200 focus:ring-primary/20"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="promotionDate"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Promotion Date
                  </label>
                  <input
                    id="promotionDate"
                    type="date"
                    name="promotionDate"
                    value={formData.promotionDate}
                    onChange={handleChange}
                    min={todayString}
                    max={todayString}
                    className={`w-full rounded-[1.5rem] border px-5 py-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                      errors.promotionDate
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-200 focus:ring-primary/20"
                    }`}
                  />
                  {errors.promotionDate && (
                    <p className="text-sm text-red-600">
                      {errors.promotionDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the culinary highlights and student appeal..."
                  rows="5"
                  className={`w-full rounded-[1.5rem] border px-5 py-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                    errors.description
                      ? "border-red-400 focus:ring-red-200"
                      : "border-slate-200 focus:ring-primary/20"
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="originalPrice"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Original Price (LKR)
                  </label>
                  <div className="relative rounded-[1.5rem] border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                    <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                      Rs.
                    </span>
                    <input
                      id="originalPrice"
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className="w-full rounded-[1.5rem] border-none bg-transparent px-5 py-4 pl-16 text-sm text-slate-900 outline-none"
                    />
                  </div>
                  {errors.originalPrice && (
                    <p className="text-sm text-red-600">
                      {errors.originalPrice}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="discountedPrice"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Discounted Price (LKR)
                  </label>
                  <div className="relative rounded-[1.5rem] border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                    <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                      Rs.
                    </span>
                    <input
                      id="discountedPrice"
                      type="number"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className="w-full rounded-[1.5rem] border-none bg-transparent px-5 py-4 pl-16 text-sm text-slate-900 outline-none"
                    />
                  </div>
                  {errors.discountedPrice && (
                    <p className="text-sm text-red-600">
                      {errors.discountedPrice}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Availability
                  </label>
                  <div className="flex h-[54px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white px-4 shadow-sm">
                    <span className="text-sm font-medium text-slate-700">
                      {formData.isAvailable ? "Available" : "Unavailable"}
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-12 rounded-full bg-slate-300 transition peer-checked:bg-primary"></div>
                      <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-6"></span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="image"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Image URL (optional)
                  </label>
                  <input
                    id="image"
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      title: "",
                      description: "",
                      originalPrice: "",
                      discountedPrice: "",
                      promotionDate: "",
                      isAvailable: true,
                      image: "",
                    });
                    setErrors({});
                  }}
                  className="w-full rounded-3xl border border-slate-300 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 sm:w-auto"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary sm:w-auto"
                >
                  {loading ? "Adding Promotion..." : "Add Promotion"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Quick Info
              </h3>
              <div className="space-y-4">
                <div className="rounded-3xl bg-blue-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                    Canteen
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {canteenName}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formData.isAvailable
                      ? "Live / Available"
                      : "Not Available"}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Selected Date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formData.promotionDate || "No date selected"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Live Preview
              </h3>
              <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
                <div className="flex h-44 items-center justify-center bg-slate-200">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={formData.title || "Promotion preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-slate-500">
                      No image preview
                    </span>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                      {canteenName}
                    </p>
                    <h4 className="mt-1 text-lg font-bold text-slate-900">
                      {formData.title || "Promotion title"}
                    </h4>
                  </div>
                  <p className="line-clamp-3 text-sm text-slate-600">
                    {formData.description ||
                      "Promotion description will appear here."}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-extrabold text-blue-700">
                      {formData.discountedPrice
                        ? `Rs. ${formData.discountedPrice}`
                        : "Rs. 0.00"}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {formData.originalPrice
                        ? `Rs. ${formData.originalPrice}`
                        : "Rs. 0.00"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-medium text-slate-500">
                      {formData.promotionDate || "No promotion date"}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${formData.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {formData.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-blue-100 bg-blue-50 p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-blue-900">Tips</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Add a clear title for the promotion.</li>
                <li>
                  • Make sure discounted price is lower than original price.
                </li>
                <li>• Add an image URL if you want preview image support.</li>
                <li>• Select the correct promotion date before submitting.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scheduled Promotions List */}
        {showScheduled && scheduledPromotions.length > 0 && (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.08)]">
            <h3 className="mb-6 text-2xl font-bold text-slate-900">
              Scheduled Promotions
            </h3>
            <div className="space-y-4">
              {scheduledPromotions
                .sort(
                  (a, b) =>
                    new Date(a.promotionDate) - new Date(b.promotionDate),
                )
                .map((promotion) => (
                  <div
                    key={promotion._id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition cursor-pointer"
                    onClick={() => handleSelectScheduledPromotion(promotion)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">
                          {new Date(
                            promotion.promotionDate,
                          ).toLocaleDateString()}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-bold ${
                            promotion.isAvailable
                              ? "bg-secondary/20 text-secondary"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {promotion.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">
                        {promotion.title}
                      </h4>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {promotion.description}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-lg font-bold text-primary">
                          Rs. {promotion.discountedPrice}
                        </span>
                        <span className="text-sm text-slate-400 line-through">
                          Rs. {promotion.originalPrice}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                          -
                          {Math.round(
                            ((promotion.originalPrice -
                              promotion.discountedPrice) /
                              promotion.originalPrice) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectScheduledPromotion(promotion);
                        }}
                        className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition"
                      >
                        Use This
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePromotion(promotion._id, promotion.title);
                        }}
                        className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PromotionForm;
