import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../services/api";

const formatMoney = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const displayStatus = (status) =>
  status === "Accepted" ? "Preparing" : status;

const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDateOnly = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-LK", { dateStyle: "medium" });
};

const sanitizeFileName = (value) =>
  String(value || "receipt")
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const getOrderTime = (order) => {
  const completedAtMs = Date.parse(order?.completedAt || "");
  if (!Number.isNaN(completedAtMs)) {
    return completedAtMs;
  }

  const createdAtMs = Date.parse(order?.createdAt || "");
  if (!Number.isNaN(createdAtMs)) {
    return createdAtMs;
  }

  // Fallback: derive timestamp from Mongo ObjectId when createdAt is unavailable.
  const objectId = String(order?._id || "");
  if (objectId.length >= 8) {
    const seconds = parseInt(objectId.slice(0, 8), 16);
    if (!Number.isNaN(seconds)) {
      return seconds * 1000;
    }
  }

  return 0;
};

const CompletedOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [receiptLoadingId, setReceiptLoadingId] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/orders");
      const completed = (Array.isArray(response.data) ? response.data : [])
        .filter((order) => order.status === "Completed")
        .sort((a, b) => getOrderTime(b) - getOrderTime(a));
      setOrders(completed);
    } catch (err) {
      console.error("Failed to load completed orders:", err);
      setError(
        err.response?.data?.message || "Failed to load completed orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalCompletedAmount = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders],
  );

  const downloadReceipt = async (order) => {
    const orderId = String(order?._id || "");

    if (!orderId) {
      return;
    }

    try {
      setReceiptLoadingId(orderId);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      const generatedOn = new Date();
      const receiptId = `QB-${orderId.slice(-8).toUpperCase()}`;
      const itemRows = (order.items || []).map((item, index) => [
        String(index + 1),
        item.name,
        String(item.quantity),
        formatMoney(item.price),
        formatMoney(item.price * item.quantity),
      ]);

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 32, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("QuickBite Receipt", margin, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Official order receipt", margin, 25);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Receipt Details", margin, 44);

      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, 48, contentWidth, 36, 4, 4, "FD");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Receipt No:", margin + 6, 58);
      doc.setFont("helvetica", "normal");
      doc.text(receiptId, margin + 34, 58);

      doc.setFont("helvetica", "bold");
      doc.text("Order ID:", margin + 6, 66);
      doc.setFont("helvetica", "normal");
      doc.text(orderId, margin + 34, 66);

      doc.setFont("helvetica", "bold");
      doc.text("Status:", pageWidth - 72, 58);
      doc.setFont("helvetica", "normal");
      doc.text(displayStatus(order.status), pageWidth - 48, 58);

      doc.setFont("helvetica", "bold");
      doc.text("Generated:", pageWidth - 72, 66);
      doc.setFont("helvetica", "normal");
      doc.text(formatDateTime(generatedOn), pageWidth - 44, 66);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Customer Details", margin, 96);

      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, 100, contentWidth, 44, 4, 4, "FD");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Name:", margin + 6, 110);
      doc.text("Student ID:", margin + 6, 118);
      doc.text("Pickup Date:", margin + 6, 126);
      doc.text("Pickup Time:", margin + 6, 134);

      doc.setFont("helvetica", "normal");
      doc.text(String(order.studentName || "-"), margin + 28, 110);
      doc.text(String(order.studentId || "-"), margin + 28, 118);
      doc.text(formatDateOnly(order.pickupDate), margin + 28, 126);
      doc.text(String(order.pickupTime || "-"), margin + 28, 134);

      doc.setFont("helvetica", "bold");
      doc.text("Order Items", margin, 158);

      autoTable(doc, {
        startY: 162,
        head: [["#", "Item", "Qty", "Unit Price", "Line Total"]],
        body: itemRows.length
          ? itemRows
          : [["-", "No items found", "-", "-", "-"]],
        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 3,
          textColor: [30, 41, 59],
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 78 },
          2: { halign: "center", cellWidth: 18 },
          3: { halign: "right", cellWidth: 36 },
          4: { halign: "right", cellWidth: 36 },
        },
      });

      const finalY = doc.lastAutoTable?.finalY || 162;
      const summaryY = finalY + 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Payment Summary", margin, summaryY);

      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, summaryY + 4, contentWidth, 20, 4, 4, "FD");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Total Amount", margin + 6, summaryY + 16);
      doc.setFont("helvetica", "normal");
      doc.text(
        formatMoney(order.total),
        pageWidth - margin - 6,
        summaryY + 16,
        {
          align: "right",
        },
      );

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(
        "Thank you for choosing QuickBite. Please keep this receipt for pickup verification.",
        pageWidth / 2,
        pageHeight - 14,
        { align: "center" },
      );

      doc.save(`quickbite-receipt-${sanitizeFileName(orderId)}.pdf`);
    } catch (err) {
      console.error("Failed to generate receipt:", err);
    } finally {
      setReceiptLoadingId("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
              Order Archive
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Completed Orders
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View all finished orders and the total cash collected from menu
              sales.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate("/order-status")}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Back to Orders
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Completed Orders
            </p>
            <p className="mt-2 text-3xl font-black text-emerald-900">
              {orders.length}
            </p>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              Total Collected
            </p>
            <p className="mt-2 text-3xl font-black text-sky-900">
              {formatMoney(totalCompletedAmount)}
            </p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              Current Status Display
            </p>
            <p className="mt-2 text-3xl font-black text-violet-900">
              Completed
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm">
            Loading completed orders...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm">
            No completed orders found yet.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Order ID
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      {order._id}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {order.studentName} · {order.studentId}
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {displayStatus(order.status)}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items?.map((item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-slate-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatMoney(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-slate-800">
                      Pickup:
                    </span>{" "}
                    {order.pickupDate} {order.pickupTime}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Total:</span>{" "}
                    {formatMoney(order.total)}
                  </p>
                </div>

                <button
                  onClick={() => downloadReceipt(order)}
                  disabled={receiptLoadingId === String(order._id)}
                  className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {receiptLoadingId === String(order._id)
                    ? "Generating Receipt..."
                    : "Download Receipt PDF"}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;
