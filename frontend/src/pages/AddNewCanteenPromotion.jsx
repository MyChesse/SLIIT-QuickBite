import React from 'react';
import PromotionForm from '../components/PromotionForm';

const AddNewCanteenPromotion = () => {
  const handleSubmit = async (promotionData) => {
    const response = await fetch('http://localhost:5001/api/promotions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(promotionData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add promotion');
    }
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.08)]">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">New Canteen</p>
        <h1 className="mt-3 text-4xl font-extrabold text-slate-950">Add Promotion</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500">Fill in the promotion details below to create a fresh, modern offer for the New Canteen.</p>
      </div>
      <PromotionForm canteenName="New canteen" onSubmit={handleSubmit} />
    </section>
  );
};

export default AddNewCanteenPromotion;
