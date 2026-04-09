import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const PromotionForm = ({ canteenName, onSubmit }) => {
  const today = new Date();
  const todayString = today.getFullYear() + '-' + 
    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
    String(today.getDate()).padStart(2, '0');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    promotionDate: todayString,
    isAvailable: true,
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [scheduledPromotions, setScheduledPromotions] = useState([]);
  const [showScheduled, setShowScheduled] = useState(false);
  const [imageFileName, setImageFileName] = useState('');

  const fetchScheduledPromotions = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/promotions/canteen/${encodeURIComponent(canteenName)}`);
      if (response.ok) {
        const data = await response.json();
        setScheduledPromotions(data);
      }
    } catch (error) {
      console.error('Error fetching scheduled promotions:', error);
    }
  }, [canteenName]);

  // Fetch scheduled promotions for this canteen
  useEffect(() => {
    fetchScheduledPromotions();
  }, [fetchScheduledPromotions]);

  // Auto-select promotion based on current date
  useEffect(() => {
    const today = new Date();
    const todayString = today.getFullYear() + '-' + 
      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
      String(today.getDate()).padStart(2, '0');
    const todayPromotion = scheduledPromotions.find(p => p.promotionDate === todayString);
    
    if (todayPromotion) {
      setFormData({
        title: todayPromotion.title,
        description: todayPromotion.description,
        originalPrice: todayPromotion.originalPrice.toString(),
        discountedPrice: todayPromotion.discountedPrice.toString(),
        promotionDate: todayPromotion.promotionDate,
        isAvailable: todayPromotion.isAvailable,
        image: todayPromotion.image || ''
      });
      toast.success(`📅 Auto-loaded today's promotion: ${todayPromotion.title}`);
    }
  }, [scheduledPromotions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast.error('Please upload a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be 10MB or less');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result || ''
      }));
      setImageFileName(file.name);
      toast.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
      newErrors.originalPrice = 'Original price must be greater than 0';
    }

    if (!formData.discountedPrice || parseFloat(formData.discountedPrice) <= 0) {
      newErrors.discountedPrice = 'Discounted price must be greater than 0';
    }

    if (
      formData.originalPrice &&
      formData.discountedPrice &&
      parseFloat(formData.discountedPrice) >= parseFloat(formData.originalPrice)
    ) {
      newErrors.discountedPrice = 'Discounted price must be less than original price';
    }

    if (!formData.promotionDate) {
      newErrors.promotionDate = 'Promotion date is required';
    } else {
      const selectedDate = new Date(formData.promotionDate);
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      
      if (selectedDateOnly.getTime() !== todayDate.getTime()) {
        newErrors.promotionDate = 'Promotion date must be today';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectScheduledPromotion = (promotion) => {
    const today = new Date();
    const todayString = today.getFullYear() + '-' + 
      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
      String(today.getDate()).padStart(2, '0');
      
    setFormData({
      title: promotion.title,
      description: promotion.description,
      originalPrice: promotion.originalPrice.toString(),
      discountedPrice: promotion.discountedPrice.toString(),
      promotionDate: todayString,
      isAvailable: promotion.isAvailable,
      image: promotion.image || ''
    });
    setShowScheduled(false);
    toast.success(`✅ Selected promotion: ${promotion.title}`);
  };

  const handleDeletePromotion = async (id, title) => {
    try {
      const response = await fetch(`http://localhost:5001/api/promotions/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setScheduledPromotions((prev) => prev.filter((p) => p._id !== id));
        toast.success(`🗑️ Deleted promotion: ${title}`);
      } else {
        toast.error('Failed to delete promotion');
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('Error deleting promotion');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('💥 Please fix the errors and try again');
      return;
    }

    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        canteenName,
        originalPrice: parseFloat(formData.originalPrice),
        discountedPrice: parseFloat(formData.discountedPrice)
      };

      const createdPromotion = await onSubmit(submissionData);

      if (createdPromotion && createdPromotion._id) {
        setScheduledPromotions((prev) => {
          const exists = prev.some((item) => item._id === createdPromotion._id);
          if (exists) {
            return prev;
          }
          return [...prev, createdPromotion];
        });
      } else {
        await fetchScheduledPromotions();
      }

      setShowScheduled(true);

      setFormData({
        title: '',
        description: '',
        originalPrice: '',
        discountedPrice: '',
        promotionDate: '',
        isAvailable: true,
        image: ''
      });
      setImageFileName('');

      setErrors({});
      toast.success('✅ Promotion added successfully');
    } catch (error) {
      console.error('Error submitting promotion:', error);
      toast.error('❌ Failed to add promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="rounded-[2rem] border border-[#d7deeb] bg-[#f4f6fb] p-5 shadow-[0_30px_80px_-35px_rgba(30,41,59,0.25)] md:p-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1d4fa5]">Campaign Management</p>
          <h2 className="mt-2 text-4xl font-extrabold leading-tight text-slate-900">Promotion Form</h2>
          <p className="mt-2 text-lg text-slate-600">Craft a compelling offer for {canteenName} students.</p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-2 shadow-sm">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={showScheduled}
                  onChange={() => setShowScheduled(!showScheduled)}
                  className="sr-only peer"
                />
                <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-[#1d4fa5]"></span>
                <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"></span>
              </label>
              <span className="text-sm font-semibold text-slate-700">
                {showScheduled ? 'Hide' : 'Show'} Scheduled ({scheduledPromotions.length})
              </span>
            </div>
            <span className="text-sm text-slate-500">Today: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="rounded-[1.6rem] border border-[#d4dbe8] bg-[#e8edf6] p-6 shadow-sm md:p-7">
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="title" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Promotion Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Mid-Week Pasta Festival"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:ring-2 ${
                    errors.title ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#8fb0e6]'
                  }`}
                />
                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="promotionDate" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Promotion Date</label>
                  <input
                    id="promotionDate"
                    type="date"
                    name="promotionDate"
                    value={formData.promotionDate}
                    onChange={handleChange}
                    min={todayString}
                    max={todayString}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:ring-2 ${
                      errors.promotionDate ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#8fb0e6]'
                    }`}
                  />
                  {errors.promotionDate && <p className="text-sm text-red-600">{errors.promotionDate}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Category</label>
                  <div className="flex h-[50px] items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-slate-800">
                    <span className="text-sm font-semibold">{canteenName}</span>
                    <span className="text-slate-400">▾</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the offer and student appeal..."
                  rows="5"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:ring-2 ${
                    errors.description ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#8fb0e6]'
                  }`}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="originalPrice" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Original Price (LKR)</label>
                  <div className="relative rounded-xl border border-slate-200 bg-white">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">Rs.</span>
                    <input
                      id="originalPrice"
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className="w-full rounded-xl border-none bg-transparent px-4 py-3 pl-14 text-base text-slate-900 outline-none"
                    />
                  </div>
                  {errors.originalPrice && <p className="text-sm text-red-600">{errors.originalPrice}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="discountedPrice" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Discounted Price (LKR)</label>
                  <div className="relative rounded-xl border border-slate-200 bg-white">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#bf5a04]">Rs.</span>
                    <input
                      id="discountedPrice"
                      type="number"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className="w-full rounded-xl border-none bg-transparent px-4 py-3 pl-14 text-base text-[#9a4302] outline-none"
                    />
                  </div>
                  {errors.discountedPrice && <p className="text-sm text-red-600">{errors.discountedPrice}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">Image & Visibility</h3>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Promotion Poster</p>
                  <div className="mt-3 overflow-hidden rounded-2xl border-2 border-dashed border-[#ccd6e6] bg-[#f8faff]">
                    <div className="flex h-44 items-center justify-center bg-[#eef2f9]">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt={formData.title || 'Promotion preview'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl text-[#1d4fa5] shadow-sm">☁</div>
                          <p className="text-sm font-semibold text-slate-700">Click or drag image</p>
                          <p className="text-xs text-slate-400">PNG, JPG up to 10MB (16:9)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="imageUpload" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Upload Image</label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="imageUpload"
                      className="inline-flex cursor-pointer items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Choose Image
                    </label>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, image: '' }));
                          setImageFileName('');
                        }}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {imageFileName || (formData.image ? 'Image selected' : 'No file selected')}
                  </p>
                </div>

                <div className="rounded-xl bg-[#edf2fb] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Live Visibility</p>
                      <p className="text-xs text-slate-500">Show in mobile app now</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <span className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-[#1d4fa5]"></span>
                      <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-[#0f4fb9] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#0c4299] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Publishing...' : 'Publish Now'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    originalPrice: '',
                    discountedPrice: '',
                    promotionDate: '',
                    isAvailable: true,
                    image: ''
                  });
                  setErrors({});
                  setImageFileName('');
                }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {/* Scheduled Promotions List */}
        {showScheduled && scheduledPromotions.length > 0 && (
          <div className="mt-8 rounded-[1.6rem] border border-[#d7deeb] bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-3xl font-bold text-slate-900">Recent & Upcoming Promotions</h3>
            <div className="space-y-4">
              {scheduledPromotions
                .sort((a, b) => new Date(a.promotionDate) - new Date(b.promotionDate))
                .map((promotion) => (
                  <div
                    key={promotion._id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dee4ef] bg-[#eef2fa] p-4 transition hover:bg-[#e7edf8]"
                    onClick={() => handleSelectScheduledPromotion(promotion)}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-300">
                        {promotion.image ? (
                          <img src={promotion.image} alt={promotion.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-600">IMG</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#dbe6fa] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1d4fa5]">
                            {promotion.isAvailable ? 'Active' : 'Completed'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(promotion.promotionDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="truncate text-lg font-bold text-slate-900">{promotion.title}</h4>
                        <p className="line-clamp-1 text-sm text-slate-600">{promotion.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-slate-900">Rs. {promotion.discountedPrice}</p>
                        <p className="text-sm text-slate-400 line-through">Rs. {promotion.originalPrice}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectScheduledPromotion(promotion);
                          }}
                          className="rounded-lg bg-[#0f4fb9] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0c4299]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePromotion(promotion._id, promotion.title);
                          }}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
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
