import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import api from "../services/api";

const parseOrderDate = (order) => {
  const value = order?.createdAt || order?.pickupDate;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isWithinDateRange = (date, fromDate, toDate) => {
  if (!date) return false;

  const start = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
  const end = toDate ? new Date(`${toDate}T23:59:59.999`) : null;

  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

const formatMoney = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const Analytics = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/admin/orders");
        setOrders(response.data?.orders || []);
      } catch (error) {
        console.error("Failed to load order analytics:", error);
        toast.error(
          error?.response?.data?.message || "Failed to load order analytics",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const date = parseOrderDate(order);
      const statusMatch =
        statusFilter === "all" ? true : order.status === statusFilter;
      const dateMatch = isWithinDateRange(date, dateFrom, dateTo);
      return statusMatch && dateMatch;
    });
  }, [orders, statusFilter, dateFrom, dateTo]);

  const metrics = useMemo(() => {
    const statusCounts = {
      Pending: 0,
      Accepted: 0,
      Ready: 0,
      Completed: 0,
      Cancelled: 0,
    };

    let grossSales = 0;
    let completedSales = 0;
    let totalItemsQty = 0;

    for (const order of filteredOrders) {
      const numericTotal = Number(order.total || 0);
      if (order.status !== "Cancelled") {
        grossSales += numericTotal;
      }
      if (order.status === "Completed") {
        completedSales += numericTotal;
      }

      if (statusCounts[order.status] !== undefined) {
        statusCounts[order.status] += 1;
      }

      for (const item of order.items || []) {
        totalItemsQty += Number(item.quantity || 0);
      }
    }

    const totalOrders = filteredOrders.length;
    const cancelled = statusCounts.Cancelled;
    const completed = statusCounts.Completed;

    const cancelRate =
      totalOrders > 0 ? ((cancelled / totalOrders) * 100).toFixed(1) : "0.0";
    const completionRate =
      totalOrders > 0 ? ((completed / totalOrders) * 100).toFixed(1) : "0.0";

    return {
      totalOrders,
      grossSales,
      completedSales,
      totalItemsQty,
      statusCounts,
      cancelRate,
      completionRate,
    };
  }, [filteredOrders]);

  const topItems = useMemo(() => {
    const map = new Map();

    for (const order of filteredOrders) {
      for (const item of order.items || []) {
        const key = item.name;
        const current = map.get(key) || { qty: 0, revenue: 0, orders: 0 };
        current.qty += Number(item.quantity || 0);
        current.revenue += Number(item.price || 0) * Number(item.quantity || 0);
        current.orders += 1;
        map.set(key, current);
      }
    }

    return Array.from(map.entries())
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);
  }, [filteredOrders]);

  const hourlyBreakdown = useMemo(() => {
    const slots = new Map();

    for (const order of filteredOrders) {
      const rawHour = String(order.pickupTime || "").slice(0, 2);
      const key = /^\d{2}$/.test(rawHour) ? rawHour : "Unknown";
      slots.set(key, (slots.get(key) || 0) + 1);
    }

    return Array.from(slots.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredOrders]);

  const exportCsv = () => {
    if (!filteredOrders.length) {
      toast.error("No orders to export for current filters");
      return;
    }

    const rows = [
      [
        "Order ID",
        "Student Name",
        "Student ID",
        "Status",
        "Pickup Date",
        "Pickup Time",
        "Total",
        "Created At",
      ],
      ...filteredOrders.map((order) => [
        order._id,
        order.studentName,
        order.studentId,
        order.status,
        order.pickupDate,
        order.pickupTime,
        Number(order.total || 0).toFixed(2),
        formatDateTime(order.createdAt),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "quickbite-order-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (!filteredOrders.length) {
      toast.error("No orders to export for current filters");
      return;
    }

    try {
      setExporting(true);
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 28, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("QuickBite Order Analytics Report", 14, 18);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${formatDateTime(new Date())}`, 14, 38);
      doc.text(
        `Filters - Status: ${statusFilter}, From: ${dateFrom || "Any"}, To: ${dateTo || "Any"}`,
        14,
        44,
      );

      autoTable(doc, {
        startY: 52,
        head: [["Metric", "Value"]],
        body: [
          ["Total Orders", String(metrics.totalOrders)],
          ["Cancelled Orders", String(metrics.statusCounts.Cancelled)],
          ["Completion Rate", `${metrics.completionRate}%`],
          ["Cancellation Rate", `${metrics.cancelRate}%`],
          ["Gross Sales", formatMoney(metrics.grossSales)],
          ["Completed Sales", formatMoney(metrics.completedSales)],
          ["Total Item Quantity", String(metrics.totalItemsQty)],
        ],
        headStyles: { fillColor: [30, 64, 175] },
      });

      autoTable(doc, {
        startY: (doc.lastAutoTable?.finalY || 80) + 8,
        head: [["Status", "Count"]],
        body: Object.entries(metrics.statusCounts).map(([status, count]) => [
          status,
          String(count),
        ]),
        headStyles: { fillColor: [14, 116, 144] },
      });

      autoTable(doc, {
        startY: (doc.lastAutoTable?.finalY || 120) + 8,
        head: [["Top Item", "Qty Sold", "Revenue", "Order Lines"]],
        body: (topItems.length
          ? topItems
          : [{ name: "N/A", qty: 0, revenue: 0, orders: 0 }]
        ).map((item) => [
          item.name,
          String(item.qty),
          formatMoney(item.revenue),
          String(item.orders),
        ]),
        headStyles: { fillColor: [5, 150, 105] },
      });

      doc.save("quickbite-order-analytics-report.pdf");
      toast.success("PDF report generated");
    } catch (error) {
      console.error("Failed to export order report:", error);
      toast.error("Failed to generate report");
    } finally {
      setExporting(false);
    }
  };

  const kpiCards = [
    {
      title: "Total Orders",
      value: metrics.totalOrders,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      title: "Cancelled",
      value: metrics.statusCounts.Cancelled,
      color: "text-red-700",
      bg: "bg-red-50",
    },
    {
      title: "Completion Rate",
      value: `${metrics.completionRate}%`,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      title: "Gross Sales",
      value: formatMoney(metrics.grossSales),
      color: "text-indigo-700",
      bg: "bg-indigo-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm px-8 py-8 text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4" />
          <p className="text-slate-700 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-[250px] flex-col bg-white border-r border-slate-200 px-5 py-6">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                🎓
              </div>
              <div>
                <h2 className="text-[28px] leading-none font-bold text-blue-900">
                  Admin Portal
                </h2>
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mt-1">
                  Canteen Management
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <span className="text-base">👥</span>
              <span>User Management</span>
            </button>

            <button
              onClick={() => navigate("/admin/promotions")}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <span className="text-base">🍽️</span>
              <span>Promotion Management</span>
            </button>

            <button
              onClick={() => navigate("/admin/orders")}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <span className="text-base">🛒</span>
              <span>Orders</span>
            </button>

            <button className="w-full flex items-center gap-3 rounded-xl bg-blue-50 text-blue-700 px-4 py-3 text-sm font-semibold">
              <span className="text-base">📊</span>
              <span>Analytics</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-[24px] px-5 py-4 shadow-sm mb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-[34px] font-bold text-blue-900 tracking-tight">
                  Analytics
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Order report and performance insights for admin decisions.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportCsv}
                  className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Export CSV
                </button>
                <button
                  onClick={exportPdf}
                  disabled={exporting}
                  className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  {exporting ? "Generating..." : "Generate PDF Report"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[22px] px-5 py-4 mb-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Ready">Ready</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => {
                  setStatusFilter("all");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="h-11 px-4 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
            {kpiCards.map((card) => (
              <div
                key={card.title}
                className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm"
              >
                <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold">
                  {card.title}
                </p>
                <div className={`mt-3 text-3xl font-bold ${card.color}`}>
                  {card.value}
                </div>
                <div className={`mt-3 rounded-lg h-2 ${card.bg}`} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Order Status Breakdown
              </h2>
              <div className="space-y-3">
                {Object.entries(metrics.statusCounts).map(([status, count]) => {
                  const pct =
                    metrics.totalOrders > 0
                      ? Math.round((count / metrics.totalOrders) * 100)
                      : 0;
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">
                          {status}
                        </span>
                        <span className="text-slate-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Peak Pickup Hours
              </h2>
              <div className="space-y-3">
                {(hourlyBreakdown.length
                  ? hourlyBreakdown
                  : [{ hour: "N/A", count: 0 }]
                ).map((entry) => (
                  <div
                    key={entry.hour}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-slate-700">
                      {entry.hour === "N/A" || entry.hour === "Unknown"
                        ? "N/A"
                        : `${entry.hour}:00 - ${entry.hour}:59`}
                    </p>
                    <p className="text-sm text-slate-500">
                      {entry.count} orders
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Top Selling Items
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#f4f7fd]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Quantity Sold
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Order Lines
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(topItems.length
                    ? topItems
                    : [{ name: "No items", qty: 0, revenue: 0, orders: 0 }]
                  ).map((item) => (
                    <tr key={item.name} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {item.qty}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatMoney(item.revenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {item.orders}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Recent Orders in Report Scope
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#f4f7fd]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Pickup
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, 10).map((order) => (
                    <tr key={order._id} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-sm text-slate-700 font-semibold">
                        {order._id?.slice(-8)?.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {order.studentName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {order.status}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {order.pickupDate} {order.pickupTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatMoney(order.total)}
                      </td>
                    </tr>
                  ))}

                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-8 text-center text-sm text-slate-500"
                      >
                        No orders found for selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
