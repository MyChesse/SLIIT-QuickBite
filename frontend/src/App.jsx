import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router';
import DailyPromotions from './pages/DailyPromotions';
import AddNewCanteenPromotion from './pages/AddNewCanteenPromotion';
import AddBasementCanteenPromotion from './pages/AddBasementCanteenPromotion';
import AddAnohanaCanteenPromotion from './pages/AddAnohanaCanteenPromotion';

const App = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-100/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">Campus Promotions</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Admin dashboard</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            <Link
              to="/promotions"
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive('/promotions') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-neutral hover:bg-slate-100'}`}
            >
              Daily Promotions
            </Link>
            <Link
              to="/admin/promotions/new-canteen"
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive('/admin/promotions/new-canteen') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-neutral hover:bg-slate-100'}`}
            >
              New Canteen
            </Link>
            <Link
              to="/admin/promotions/basement-canteen"
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive('/admin/promotions/basement-canteen') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-neutral hover:bg-slate-100'}`}
            >
              Basement Canteen
            </Link>
            <Link
              to="/admin/promotions/anohana-canteen"
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive('/admin/promotions/anohana-canteen') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-neutral hover:bg-slate-100'}`}
            >
              Anohana Canteen
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/promotions" replace />} />
          <Route path="/promotions" element={<DailyPromotions />} />
          <Route path="/admin/promotions/new-canteen" element={<AddNewCanteenPromotion />} />
          <Route path="/admin/promotions/basement-canteen" element={<AddBasementCanteenPromotion />} />
          <Route path="/admin/promotions/anohana-canteen" element={<AddAnohanaCanteenPromotion />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
