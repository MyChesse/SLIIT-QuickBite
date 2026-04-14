import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import SDHeader from '../components/SDHeader';

const DailyPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeCanteenName = (canteenName) => {
    switch ((canteenName || '').trim()) {
      case 'New canteen':
      case 'New Canteen':
        return 'Main Canteen';
      case 'Basement canteen':
      case 'Basement Canteen':
        return 'Hostel Canteen';
      case 'Anohana Canteen':
        return 'Mini Canteen';
      default:
        return canteenName || 'Unknown';
    }
  };

  useEffect(() => {
    fetchTodaysPromotions();
  }, []);

  const fetchTodaysPromotions = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/promotions/today');
      if (!response.ok) {
        throw new Error('Failed to fetch promotions');
      }
      const data = await response.json();
      setPromotions(data);
      if (data.length === 0) {
        toast.success('No promotions for today');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Group promotions by canteen
  const groupedPromotions = promotions.reduce((acc, promotion) => {
    const canteen = normalizeCanteenName(promotion.canteenName);
    if (!acc[canteen]) acc[canteen] = [];
    acc[canteen].push(promotion);
    return acc;
  }, {});

  const canteenSections = [
    {
      key: 'Main Canteen',
      title: 'Main Canteen',
      subtitle: "Today's modern highlights",
      badge: 'New',
      emptyIcon: 'restaurant_menu',
      reverse: false
    },
    {
      key: 'Hostel Canteen',
      title: 'Hostel Canteen',
      subtitle: 'Comfort-focused favorites',
      badge: 'Classic',
      emptyIcon: 'shopping_basket',
      reverse: true
    },
    {
      key: 'Mini Canteen',
      title: 'Mini Canteen',
      subtitle: 'Refined signature picks',
      badge: 'Today',
      emptyIcon: 'restaurant',
      reverse: false
    }
  ];

  const renderEmptyState = (icon, title) => (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/70 px-8 py-16 text-center">
      <span className="material-symbols-outlined mb-4 text-6xl text-slate-300">{icon}</span>
      <h3 className="mb-2 text-xl font-bold text-slate-600">No promotions available today</h3>
      <p className="text-sm text-slate-500">{title} promotions will appear here once published.</p>
    </div>
  );

  const renderPromotionSection = (section) => {
    const sectionPromotions = groupedPromotions[section.key] || [];
    const featured = sectionPromotions[0];
    const secondary = sectionPromotions.slice(1, 3);

    return (
      <section key={section.key} className="mb-16">
        <div className="mb-6 flex flex-col gap-3 pb-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
            <p className="text-slate-600">{section.subtitle}</p>
          </div>
          <button className="group inline-flex items-center gap-1 self-start text-sm font-semibold text-[#0f4fb9] transition hover:text-[#0c4299] sm:self-auto">
            View All
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>

        {sectionPromotions.length === 0 && renderEmptyState(section.emptyIcon, section.title)}

        {sectionPromotions.length > 0 && (
          <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
            <div className={`rounded-2xl border border-[#dbe2ef] bg-[#edf2fb] p-3 shadow-sm xl:col-span-8 ${section.reverse ? 'xl:order-2' : ''}`}>
              <article className="group relative grid h-full min-h-[390px] grid-cols-1 overflow-hidden rounded-xl bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_42px_-24px_rgba(15,79,185,0.75)] xl:grid-cols-12">
                <div className="relative h-[300px] overflow-hidden xl:col-span-7 xl:h-full">
                  {featured?.image ? (
                    <img src={featured.image} alt={featured.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200">
                      <span className="material-symbols-outlined text-5xl text-slate-400">restaurant</span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100"></div>
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="rounded-full bg-[#0f4fb9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">{section.badge}</span>
                    <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">Available</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between p-5 xl:col-span-5 xl:p-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c26b12]">Daily Special</p>
                    <h3 className="mt-2 text-xl font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-[#0f4fb9] xl:text-2xl">{featured?.title || 'Untitled promotion'}</h3>
                    <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-slate-600 xl:text-sm">
                      {featured?.description || 'No description available.'}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Price</p>
                        <p className="text-3xl font-extrabold leading-none text-[#0f4fb9] transition-transform duration-300 group-hover:translate-x-1 xl:text-4xl">Rs. {featured?.discountedPrice ?? '0'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Was</p>
                        <p className="text-sm text-slate-400 line-through">Rs. {featured?.originalPrice ?? '0'}</p>
                        {featured && (
                          <p className="mt-1 rounded-md bg-[#ffedd5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#c26b12]">
                            Save {Math.round(((featured.originalPrice - featured.discountedPrice) / featured.originalPrice) * 100)}%
                          </p>
                        )}
                      </div>
                    </div>

                    <button className="group/cta w-full rounded-md bg-[#0f4fb9] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-[#0c4299] hover:shadow-[0_10px_20px_-12px_rgba(15,79,185,0.9)]">
                      <span className="inline-flex items-center gap-1">
                        Add to Cart
                        <span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pointer-events-none absolute right-4 top-4 hidden w-56 rounded-xl border border-[#d6dff0] bg-white/95 p-3 shadow-[0_16px_30px_-18px_rgba(15,79,185,0.7)] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 xl:block -translate-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f4fb9]">Quick View</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 line-clamp-1">{featured?.title || 'Promotion'}</p>
                  <p className="mt-1 text-xs text-slate-600">Limited-time campus deal</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#0f4fb9]">Rs. {featured?.discountedPrice ?? '0'}</span>
                    <span className="rounded-full bg-[#eff6ff] px-2 py-0.5 text-[10px] font-bold uppercase text-[#1d4fa5]">
                      {featured?.isAvailable ? 'Live' : 'Ended'}
                    </span>
                  </div>
                </div>
              </article>
            </div>

            <div className={`space-y-4 xl:col-span-4 ${section.reverse ? 'xl:order-1' : ''}`}>
              {secondary.map((promotion) => (
                <article key={promotion._id} className="group relative rounded-xl border border-[#dde4ef] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_-20px_rgba(15,79,185,0.75)]">
                  <div>
                    <div className="aspect-[16/9] overflow-hidden rounded-lg bg-slate-200">
                      {promotion.image ? (
                        <img src={promotion.image} alt={promotion.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="material-symbols-outlined text-3xl text-slate-400">restaurant</span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 pt-3">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-[#0f4fb9]">{promotion.title}</p>
                        <span className="rounded bg-[#fed7aa] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#9a3412]">Offer</span>
                      </div>
                      <p className="mt-2 text-base font-bold text-[#0f4fb9]">Rs. {promotion.discountedPrice}</p>
                      <p className="text-xs text-slate-400 line-through">Rs. {promotion.originalPrice}</p>
                      <span className="mt-2 inline-flex rounded-full bg-[#eff6ff] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#1d4fa5]">
                        {promotion.isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-[#d6dff0] bg-white/95 px-2.5 py-1.5 shadow-md opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 -translate-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#0f4fb9]">Preview</p>
                    <p className="text-[11px] font-bold text-slate-900">Rs. {promotion.discountedPrice}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <main className="min-h-screen w-full bg-[#eff2f8]">
      <SDHeader />
      <Toaster position="top-right" />
      
      <div className="mx-auto w-full max-w-7xl px-3 pb-20 pt-28 md:px-6 lg:px-8">
      <header className="mb-10 pb-6 text-center md:text-left">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.28em] text-[#1d4fa5]">Exclusive Deals</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0f4fb9] sm:text-5xl">Daily Promotions</h1>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base md:mx-0">
          Discover fresh promotions at all SLIIT canteens. Hand-picked, time-sensitive, and available
          for today only.
        </p>
      </header>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#1d4fa5]/20 border-t-[#1d4fa5]"></div>
          <p className="text-slate-600 font-medium">Loading today's promotions...</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-4xl text-red-500">error</span>
          <h3 className="mb-2 text-xl font-bold text-red-900">Oops! Something went wrong</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && canteenSections.map((section) => renderPromotionSection(section))}
      </div>
    </main>
  );
};

export default DailyPromotions;
