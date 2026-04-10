import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const BookingPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [studentIdDigits, setStudentIdDigits] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const studentId = `IT${studentIdDigits}`;

  const today = new Date().toISOString().split("T")[0];

  const handleStudentIdChange = (e) => {
    const raw = e.target.value.toUpperCase();
    const withoutPrefix = raw.startsWith("IT") ? raw.slice(2) : raw;
    const digitsOnly = withoutPrefix.replace(/\D/g, "").slice(0, 8);
    setStudentIdDigits(digitsOnly);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const validateForm = () => {
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty!");
      return false;
    }

    if (!studentName.trim()) {
      setError("Student name is required.");
      return false;
    }

    if (studentIdDigits.length !== 8) {
      setError("Student ID must be like IT12345678");
      return false;
    }

    if (!pickupDate || !pickupTime) {
      setError("Select pickup date & time.");
      return false;
    }

    const selected = new Date(`${pickupDate}T${pickupTime}`);
    if (selected < new Date()) {
      setError("Pickup time cannot be in the past.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderData = {
        studentName,
        studentId: `IT${studentIdDigits}`,
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: calculateTotal(),
        pickupDate,
        pickupTime,
      };

      const res = await api.post("/orders/create", orderData);

      setSuccess("Order Placed Successfully!");
      clearCart();

      setTimeout(() => {
        navigate("/order-status", {
          state: {
            orderId: String(res.data.order._id),
            justPlaced: true,
          },
        });
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to place order",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-orange-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-slate-800">Book Your Meal</h1>
          <p className="mt-2 text-slate-600">
            Quick, simple, and student-friendly pickup booking.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">
                Your cart is empty.
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-800">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-sky-600 px-4 py-3 text-white">
              <p className="text-sm opacity-90">Total Amount</p>
              <p className="text-2xl font-black">Rs. {calculateTotal()}</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-3"
          >
            <h2 className="mb-1 text-xl font-bold text-slate-800">
              Booking Details
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Please enter your details to confirm the pickup.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Student Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Student ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="IT12345678"
                    value={studentId}
                    onChange={handleStudentIdChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold tracking-wide outline-none transition focus:border-sky-500"
                    maxLength={10}
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Format: IT + 8 digits (example: IT12345678)
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={today}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-sky-600 px-4 py-3 text-lg font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Placing Order..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
