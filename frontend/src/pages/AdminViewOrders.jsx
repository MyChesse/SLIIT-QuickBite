import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const SERVER_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/api\/?$/, "");

const AdminViewOrders = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const getErrorMessage = (error, fallback) => {
    const status = error?.response?.status;
    if (status === 404) {
      return "Order service endpoint was not found. Please restart the backend server.";
    }
    if (status === 401 || status === 403) {
      return "You are not authorized for this action. Please log in again as admin.";
    }
    if (!error?.response) {
      return "Cannot connect to server. Please check if backend is running.";
    }

    return (
      error?.response?.data?.message || error?.response?.data?.error || fallback
    );
  };

  const shouldTryFallback = (error) => {
    const status = error?.response?.status;
    return status === 401 || status === 403 || status === 404;
  };

  const fetchOrders = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      let res;

      try {
        res = await api.get("/admin/orders");
      } catch (adminError) {
        // Fallback for environments where admin routes are not yet available.
        if (adminError?.response?.status === 404) {
          try {
            res = await api.get("/orders");
          } catch (ordersApiError) {
            if (ordersApiError?.response?.status === 404) {
              res = await axios.get(`${SERVER_BASE_URL}/orders`);
            } else {
              throw ordersApiError;
            }
          }
        } else {
          throw adminError;
        }
      }

      const orderList = Array.isArray(res.data)
        ? res.data
        : res.data.orders || [];

      setOrders(orderList);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error(getErrorMessage(error, "Failed to load orders"));
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders(true);
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const intervalId = setInterval(() => {
      fetchOrders(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [token]);

  const handleAccept = async (orderId) => {
    try {
      setActionLoadingId(orderId);
      try {
        await api.put(`/admin/orders/${orderId}/accept`, {});
      } catch (adminError) {
        if (shouldTryFallback(adminError)) {
          try {
            await api.put(`/orders/${orderId}/accept`, {});
          } catch (ordersApiError) {
            if (ordersApiError?.response?.status === 404) {
              await axios.put(
                `${SERVER_BASE_URL}/orders/${orderId}/accept`,
                {},
              );
            } else {
              throw ordersApiError;
            }
          }
        } else {
          throw adminError;
        }
      }
      toast.success("Order accepted");
      await fetchOrders();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to accept order"));
    } finally {
      setActionLoadingId("");
    }
  };

  const handleReady = async (orderId) => {
    try {
      setActionLoadingId(orderId);
      try {
        await api.put(`/admin/orders/${orderId}/ready`, {});
      } catch (adminError) {
        if (shouldTryFallback(adminError)) {
          try {
            await api.put(`/orders/${orderId}/ready`, {});
          } catch (ordersApiError) {
            if (ordersApiError?.response?.status === 404) {
              await axios.put(`${SERVER_BASE_URL}/orders/${orderId}/ready`, {});
            } else {
              throw ordersApiError;
            }
          }
        } else {
          throw adminError;
        }
      }
      toast.success("Order marked ready");
      await fetchOrders();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to mark order as ready"));
    } finally {
      setActionLoadingId("");
    }
  };

  const handleCancel = async (orderId) => {
    try {
      setActionLoadingId(orderId);
      try {
        await api.put(`/admin/orders/${orderId}/cancel`, {});
      } catch (adminError) {
        if (shouldTryFallback(adminError)) {
          try {
            await api.put(`/orders/${orderId}/cancel`, { adminCancel: true });
          } catch (ordersApiError) {
            if (ordersApiError?.response?.status === 404) {
              await axios.put(`${SERVER_BASE_URL}/orders/${orderId}/cancel`, {
                adminCancel: true,
              });
            } else {
              throw ordersApiError;
            }
          }
        } else {
          throw adminError;
        }
      }
      toast.success("Order cancelled");
      await fetchOrders();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to cancel order"));
    } finally {
      setActionLoadingId("");
    }
  };

  const grouped = useMemo(() => {
    return {
      pending: orders.filter((o) => o.status === "Pending"),
      accepted: orders.filter((o) => o.status === "Accepted"),
      ready: orders.filter((o) => o.status === "Ready"),
      completed: orders.filter((o) => o.status === "Completed"),
      cancelled: orders.filter((o) => o.status === "Cancelled"),
    };
  }, [orders]);

  const renderOrderCard = (order) => {
    const busy = actionLoadingId === order._id;
    const canAccept = order.status === "Pending";
    const canReady = order.status === "Accepted";
    const canCancel = order.status === "Pending" || order.status === "Accepted";

    return (
      <div
        key={order._id}
        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Order #{order._id?.slice(-8)?.toUpperCase()}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {order.studentName} ({order.studentId})
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Pickup: {order.pickupDate} at {order.pickupTime}
            </p>
          </div>
          <div className="text-sm font-semibold text-blue-700">
            Rs. {order.total}
          </div>
        </div>

        <div className="mt-3 border-t border-slate-100 pt-3 space-y-1.5">
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-slate-700">
                {item.name} x {item.quantity}
              </span>
              <span className="text-slate-600">
                Rs. {item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center flex-wrap gap-2">
          <button
            onClick={() => handleAccept(order._id)}
            disabled={busy || !canAccept}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
              canAccept
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            } disabled:opacity-50`}
          >
            {busy && canAccept ? "Updating..." : "Accept"}
          </button>

          <button
            onClick={() => handleReady(order._id)}
            disabled={busy || !canReady}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
              canReady
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            } disabled:opacity-50`}
          >
            {busy && canReady ? "Updating..." : "Ready"}
          </button>

          <button
            onClick={() => handleCancel(order._id)}
            disabled={busy || !canCancel}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
              canCancel
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            } disabled:opacity-50`}
          >
            {busy && canCancel ? "Updating..." : "Cancel"}
          </button>

          {(order.status === "Ready" ||
            order.status === "Completed" ||
            order.status === "Cancelled") && (
            <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              {order.status}
            </span>
          )}
        </div>

        {order.status === "Cancelled" && order.statusMessage && (
          <p className="mt-3 text-sm font-medium text-red-600">
            {order.statusMessage}
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm px-8 py-8 text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4" />
          <p className="text-slate-700 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800 px-4 py-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-slate-200 rounded-[24px] px-5 py-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-bold text-blue-900 tracking-tight">
              Admin Orders
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Accept pending orders and mark accepted orders as ready.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="h-11 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-[#fff7ed] border border-orange-200 rounded-2xl p-4">
          <h2 className="text-sm font-bold text-orange-700 mb-3">
            Pending ({grouped.pending.length})
          </h2>
          <div className="space-y-3">
            {grouped.pending.length > 0 ? (
              grouped.pending.map(renderOrderCard)
            ) : (
              <p className="text-sm text-orange-700/70">No pending orders.</p>
            )}
          </div>
        </section>

        <section className="bg-[#eff6ff] border border-blue-200 rounded-2xl p-4">
          <h2 className="text-sm font-bold text-blue-700 mb-3">
            Accepted ({grouped.accepted.length})
          </h2>
          <div className="space-y-3">
            {grouped.accepted.length > 0 ? (
              grouped.accepted.map(renderOrderCard)
            ) : (
              <p className="text-sm text-blue-700/70">No accepted orders.</p>
            )}
          </div>
        </section>

        <section className="bg-[#ecfdf5] border border-emerald-200 rounded-2xl p-4">
          <h2 className="text-sm font-bold text-emerald-700 mb-3">
            Ready ({grouped.ready.length})
          </h2>
          <div className="space-y-3">
            {grouped.ready.length > 0 ? (
              grouped.ready.map(renderOrderCard)
            ) : (
              <p className="text-sm text-emerald-700/70">No ready orders.</p>
            )}
          </div>
        </section>

        <section className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-4">
          <h2 className="text-sm font-bold text-slate-700 mb-3">
            Completed + Cancelled (
            {grouped.completed.length + grouped.cancelled.length})
          </h2>
          <div className="space-y-3">
            {grouped.completed.concat(grouped.cancelled).length > 0 ? (
              grouped.completed.concat(grouped.cancelled).map(renderOrderCard)
            ) : (
              <p className="text-sm text-slate-500">
                No completed or cancelled orders.
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
        Logged in as:{" "}
        <span className="font-semibold text-slate-800">
          {user?.name || "Admin"}
        </span>
      </div>
    </div>
  );
};

export default AdminViewOrders;
