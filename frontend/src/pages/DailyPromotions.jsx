import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const DailyPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const canteen = promotion.canteenName || 'Unknown';
    if (!acc[canteen]) acc[canteen] = [];
    acc[canteen].push(promotion);
    return acc;
  }, {});

  return (
    <main className="pt-24 pb-20 px-8 max-w-7xl mx-auto bg-gradient-to-br from-blue-50/50 to-indigo-50/50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <header className="mb-16">
        <span className="font-label text-xs font-bold tracking-[0.05em] text-primary uppercase mb-2 block">Exclusive Offers</span>
        <h1 className="font-headline text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Daily Promotion</h1>
        <p className="text-slate-600 max-w-2xl leading-relaxed text-lg">Curated flavors for the academic community. Explore today's special offers across SLIIT campuses.</p>
      </header>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Loading today's promotions...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-red-500 mb-4">error</span>
          <h3 className="text-xl font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* New Canteen Section */}
          <section className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="font-headline text-3xl font-bold text-slate-900">New Canteen</h2>
                <p className="text-slate-600 font-body">Today's signature selections</p>
              </div>
              <span className="text-primary font-label text-sm font-semibold px-4 py-1 bg-primary/10 rounded-full border border-primary/20">
                {groupedPromotions['New canteen']?.length || 0} OFFERS
              </span>
            </div>
            
            {groupedPromotions['New canteen']?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Featured Card */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] overflow-hidden group relative border border-slate-200 shadow-xl">
                  <div className="flex flex-col lg:flex-row h-full">
                    <div className="lg:w-1/2 relative overflow-hidden h-64 lg:h-auto">
                      {groupedPromotions['New canteen'][0].image ? (
                        <img 
                          src={groupedPromotions['New canteen'][0].image} 
                          alt={groupedPromotions['New canteen'][0].title}
                          className="h-full w-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-6xl text-primary/30">restaurant</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary px-3 py-1 text-white text-xs font-bold rounded-lg shadow-lg">FEATURED</span>
                      </div>
                    </div>
                    <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-headline text-2xl font-bold text-slate-900">{groupedPromotions['New canteen'][0].title}</h3>
                          <span className="text-secondary font-bold text-2xl">Rs. {groupedPromotions['New canteen'][0].discountedPrice}</span>
                        </div>
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">{groupedPromotions['New canteen'][0].description}</p>
                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-slate-400 line-through text-sm">Rs. {groupedPromotions['New canteen'][0].originalPrice}</span>
                          <span className="text-orange-700 bg-orange-100 text-xs font-bold px-2 py-0.5 rounded-full">
                            SAVE {Math.round(((groupedPromotions['New canteen'][0].originalPrice - groupedPromotions['New canteen'][0].discountedPrice) / groupedPromotions['New canteen'][0].originalPrice) * 100)}%
                          </span>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
                
                {/* Secondary Cards */}
                {groupedPromotions['New canteen'].slice(1, 3).map((promotion) => (
                  <div key={promotion._id} className="bg-white rounded-[1.5rem] p-6 border border-slate-200 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="aspect-video rounded-xl overflow-hidden mb-4">
                        {promotion.image ? (
                          <img src={promotion.image} alt={promotion.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-primary/20">restaurant</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-headline text-lg font-bold mb-2 text-slate-900">{promotion.title}</h3>
                      <p className="text-xs text-slate-600 mb-4 line-clamp-2">{promotion.description}</p>
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-xl font-bold text-secondary">Rs. {promotion.discountedPrice}</span>
                        <span className="text-sm text-slate-400 line-through mb-1">Rs. {promotion.originalPrice}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date: Today</span>
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-bold">
                        {promotion.isAvailable ? 'AVAILABLE' : 'SOLD OUT'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-300 p-16 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">restaurant_menu</span>
                <h3 className="font-headline text-xl font-bold text-slate-600 mb-2">No promotions available today</h3>
                <p className="text-slate-500 text-sm">Check back later for new offers!</p>
              </div>
            )}
          </section>

          {/* Basement Canteen Section */}
          <section className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="font-headline text-3xl font-bold text-slate-900">Basement Canteen</h2>
                <p className="text-slate-600 font-body">Ground floor dining experience</p>
              </div>
              <span className="text-primary font-label text-sm font-semibold px-4 py-1 bg-primary/10 rounded-full border border-primary/20">
                {groupedPromotions['Basement canteen']?.length || 0} OFFERS
              </span>
            </div>
            
            {groupedPromotions['Basement canteen']?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Featured Card */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] overflow-hidden group relative border border-slate-200 shadow-xl">
                  <div className="flex flex-col lg:flex-row h-full">
                    <div className="lg:w-1/2 relative overflow-hidden h-64 lg:h-auto">
                      {groupedPromotions['Basement canteen'][0].image ? (
                        <img 
                          src={groupedPromotions['Basement canteen'][0].image} 
                          alt={groupedPromotions['Basement canteen'][0].title}
                          className="h-full w-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-6xl text-primary/30">restaurant</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary px-3 py-1 text-white text-xs font-bold rounded-lg shadow-lg">FEATURED</span>
                      </div>
                    </div>
                    <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-headline text-2xl font-bold text-slate-900">{groupedPromotions['Basement canteen'][0].title}</h3>
                          <span className="text-secondary font-bold text-2xl">Rs. {groupedPromotions['Basement canteen'][0].discountedPrice}</span>
                        </div>
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">{groupedPromotions['Basement canteen'][0].description}</p>
                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-slate-400 line-through text-sm">Rs. {groupedPromotions['Basement canteen'][0].originalPrice}</span>
                          <span className="text-orange-700 bg-orange-100 text-xs font-bold px-2 py-0.5 rounded-full">
                            SAVE {Math.round(((groupedPromotions['Basement canteen'][0].originalPrice - groupedPromotions['Basement canteen'][0].discountedPrice) / groupedPromotions['Basement canteen'][0].originalPrice) * 100)}%
                          </span>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
                
                {/* Secondary Cards */}
                {groupedPromotions['Basement canteen'].slice(1, 3).map((promotion) => (
                  <div key={promotion._id} className="bg-white rounded-[1.5rem] p-6 border border-slate-200 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="aspect-video rounded-xl overflow-hidden mb-4">
                        {promotion.image ? (
                          <img src={promotion.image} alt={promotion.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-primary/20">restaurant</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-headline text-lg font-bold mb-2 text-slate-900">{promotion.title}</h3>
                      <p className="text-xs text-slate-600 mb-4 line-clamp-2">{promotion.description}</p>
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-xl font-bold text-secondary">Rs. {promotion.discountedPrice}</span>
                        <span className="text-sm text-slate-400 line-through mb-1">Rs. {promotion.originalPrice}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date: Today</span>
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-bold">
                        {promotion.isAvailable ? 'AVAILABLE' : 'SOLD OUT'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-300 p-16 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">shopping_basket</span>
                <h3 className="font-headline text-xl font-bold text-slate-600 mb-2">No promotions available today</h3>
                <p className="text-slate-500 text-sm">Check back later for new offers!</p>
              </div>
            )}
          </section>

          {/* Anohana Canteen Section */}
          <section className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="font-headline text-3xl font-bold text-slate-900">Anohana Canteen</h2>
                <p className="text-slate-600 font-body">Premium fusion culinary experiences</p>
              </div>
              <span className="text-primary font-label text-sm font-semibold px-4 py-1 bg-primary/10 rounded-full border border-primary/20">
                {groupedPromotions['Anohana Canteen']?.length || 0} OFFERS
              </span>
            </div>
            
            {groupedPromotions['Anohana Canteen']?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Featured Card */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] overflow-hidden group relative border border-slate-200 shadow-xl">
                  <div className="flex flex-col lg:flex-row h-full">
                    <div className="lg:w-1/2 relative overflow-hidden h-64 lg:h-auto">
                      {groupedPromotions['Anohana Canteen'][0].image ? (
                        <img 
                          src={groupedPromotions['Anohana Canteen'][0].image} 
                          alt={groupedPromotions['Anohana Canteen'][0].title}
                          className="h-full w-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-6xl text-primary/30">restaurant</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary px-3 py-1 text-white text-xs font-bold rounded-lg shadow-lg">FEATURED</span>
                      </div>
                    </div>
                    <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-headline text-2xl font-bold text-slate-900">{groupedPromotions['Anohana Canteen'][0].title}</h3>
                          <span className="text-secondary font-bold text-2xl">Rs. {groupedPromotions['Anohana Canteen'][0].discountedPrice}</span>
                        </div>
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">{groupedPromotions['Anohana Canteen'][0].description}</p>
                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-slate-400 line-through text-sm">Rs. {groupedPromotions['Anohana Canteen'][0].originalPrice}</span>
                          <span className="text-orange-700 bg-orange-100 text-xs font-bold px-2 py-0.5 rounded-full">
                            SAVE {Math.round(((groupedPromotions['Anohana Canteen'][0].originalPrice - groupedPromotions['Anohana Canteen'][0].discountedPrice) / groupedPromotions['Anohana Canteen'][0].originalPrice) * 100)}%
                          </span>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
                
                {/* Secondary Cards */}
                {groupedPromotions['Anohana Canteen'].slice(1, 3).map((promotion) => (
                  <div key={promotion._id} className="bg-white rounded-[1.5rem] p-6 border border-slate-200 shadow-lg flex flex-col justify-between">
                    <div>
                      <div className="aspect-video rounded-xl overflow-hidden mb-4">
                        {promotion.image ? (
                          <img src={promotion.image} alt={promotion.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-primary/20">restaurant</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-headline text-lg font-bold mb-2 text-slate-900">{promotion.title}</h3>
                      <p className="text-xs text-slate-600 mb-4 line-clamp-2">{promotion.description}</p>
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-xl font-bold text-secondary">Rs. {promotion.discountedPrice}</span>
                        <span className="text-sm text-slate-400 line-through mb-1">Rs. {promotion.originalPrice}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date: Today</span>
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-bold">
                        {promotion.isAvailable ? 'AVAILABLE' : 'SOLD OUT'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-300 p-16 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">restaurant_menu</span>
                <h3 className="font-headline text-xl font-bold text-slate-600 mb-2">No promotions available today</h3>
                <p className="text-slate-500 text-sm">Check back later for new offers!</p>
              </div>
            )}
          </section>

          
        </>
      )}
    </main>
  );
};

export default DailyPromotions;
