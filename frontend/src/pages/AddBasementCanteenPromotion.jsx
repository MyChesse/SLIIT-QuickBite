import React from 'react';
import { useLocation } from 'react-router-dom';
import PromotionForm from '../components/PromotionForm';
import StaffSidebarLayout from '../components/StaffSidebarLayout';
import AdminSidebarLayout from '../components/AdminSidebarLayout';

const AddBasementCanteenPromotion = () => {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/add-promotion');
  const isAdminRoute = location.pathname.startsWith('/admin/promotions');

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

  const content = (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.08)]">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">Hostel Canteen</p>
        <h1 className="mt-3 text-4xl font-extrabold text-slate-950">Add Promotion</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500">Create a standout promotion for the Hostel Canteen using the clean admin builder.</p>
      </div>
      <PromotionForm canteenName="Hostel Canteen" onSubmit={handleSubmit} />
    </section>
  );

  if (isStaffRoute) {
    return <StaffSidebarLayout>{content}</StaffSidebarLayout>;
  }

  if (isAdminRoute) {
    return <AdminSidebarLayout activePage="promotions">{content}</AdminSidebarLayout>;
  }

  return content;
};

export default AddBasementCanteenPromotion;
