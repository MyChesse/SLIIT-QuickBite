import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../services/api";

/** Mongo/API may expose _id as string or an object with toString() */
const normalizeOrderId = (id) => {
  if (id == null) return "";
  if (typeof id === "string") return id;
  if (typeof id.toString === "function") return id.toString();
  return String(id);
};

const formatMoney = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDateOnly = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-LK", {
    dateStyle: "medium",
  });
};

const sanitizeFileName = (value) =>
  String(value || "receipt")
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const OrderStatusPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptLoadingId, setReceiptLoadingId] = useState("");
  const [cancelTargetId, setCancelTargetId] = useState("");
  const [completeTargetId, setCompleteTargetId] = useState("");
  const [popup, setPopup] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const justPlaced = location.state?.justPlaced;

  useEffect(() => {
    fetchOrders(true);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchOrders(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const response = await api.get("/orders");
      setOrders(response.data.filter((order) => order.status !== "Cancelled"));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f59e0b";
      case "Accepted":
        return "#3b82f6";
      case "Ready":
        return "#a855f7";
      case "Completed":
        return "#10b981";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#9ca3af";
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Accepted":
        return "✓";
      case "Ready":
        return "🎁";
      case "Completed":
        return "✅";
      case "Cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  const downloadReceipt = async (order) => {
    const normalizedId = normalizeOrderId(order?._id);

    if (!normalizedId) {
      setPopup({
        open: true,
        type: "error",
        message: "Invalid order selected for receipt download.",
      });
      return;
    }

    if (order.status !== "Completed") {
      setPopup({
        open: true,
        type: "error",
        message: "The receipt will be available after the order is completed.",
      });
      return;
    }

    try {
      setReceiptLoadingId(normalizedId);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      const generatedOn = new Date();
      const receiptId = `QB-${normalizedId.slice(-8).toUpperCase()}`;
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
      doc.text(normalizedId, margin + 34, 66);

      doc.setFont("helvetica", "bold");
      doc.text("Status:", pageWidth - 72, 58);
      doc.setFont("helvetica", "normal");
      doc.text(order.status, pageWidth - 48, 58);

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
      doc.roundedRect(margin, summaryY + 4, contentWidth, 28, 4, 4, "FD");

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

      doc.setFont("helvetica", "bold");
      doc.text("Status", margin + 6, summaryY + 24);
      doc.setFont("helvetica", "normal");
      doc.text(
        String(order.status || "-"),
        pageWidth - margin - 6,
        summaryY + 24,
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

      const fileName = `quickbite-receipt-${sanitizeFileName(normalizedId)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating receipt:", error);
      setPopup({
        open: true,
        type: "error",
        message: "Failed to generate the receipt PDF. Please try again.",
      });
    } finally {
      setReceiptLoadingId("");
    }
  };

  const OrderStatusFlow = ({ status }) => {
    const statuses =
      status === "Cancelled"
        ? ["Pending", "Accepted", "Cancelled"]
        : ["Pending", "Accepted", "Ready", "Completed"];
    const currentIndex = statuses.indexOf(status);

    return (
      <div style={styles.statusFlow}>
        {statuses.map((s, index) => (
          <div key={s} style={styles.statusStep}>
            <div
              style={{
                ...styles.statusDot,
                backgroundColor:
                  index <= currentIndex ? getStatusColor(status) : "#d1d5db",
              }}
            />
            <span
              style={{
                ...styles.statusText,
                color:
                  index <= currentIndex ? getStatusColor(status) : "#9ca3af",
                fontWeight: s === status ? "bold" : "normal",
              }}
            >
              {s}
            </span>
            {index < statuses.length - 1 && (
              <div
                style={{
                  ...styles.statusLine,
                  backgroundColor:
                    index < currentIndex ? getStatusColor(status) : "#d1d5db",
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleCancelOrder = (id) => {
    const normalized = normalizeOrderId(id);
    if (!normalized) {
      setPopup({
        open: true,
        type: "error",
        message: "Invalid order id.",
      });
      return;
    }

    setCancelTargetId(normalized);
  };

  const closePopup = () => {
    setPopup({ open: false, type: "success", message: "" });
  };

  const confirmCancelOrder = async () => {
    if (!cancelTargetId) return;

    try {
      await api.put(`/orders/${encodeURIComponent(cancelTargetId)}/cancel`);
      setOrders((prev) =>
        prev.filter((order) => normalizeOrderId(order._id) !== cancelTargetId),
      );
      setPopup({
        open: true,
        type: "success",
        message: "Order cancelled successfully.",
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      setPopup({
        open: true,
        type: "error",
        message: msg || "Failed to cancel the order. Please try again.",
      });
    } finally {
      setCancelTargetId("");
    }
  };

  const handleCompleteOrder = (id) => {
    const normalized = normalizeOrderId(id);
    if (!normalized) {
      setPopup({
        open: true,
        type: "error",
        message: "Invalid order id.",
      });
      return;
    }

    setCompleteTargetId(normalized);
  };

  const confirmCompleteOrder = async () => {
    if (!completeTargetId) return;

    try {
      await api.put(`/orders/${encodeURIComponent(completeTargetId)}/complete`);
      setOrders((prev) =>
        prev.map((order) =>
          normalizeOrderId(order._id) === completeTargetId
            ? { ...order, status: "Completed" }
            : order,
        ),
      );
      setPopup({
        open: true,
        type: "success",
        message: "Order marked as completed.",
      });
    } catch (error) {
      console.error("Error completing order:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      setPopup({
        open: true,
        type: "error",
        message: msg || "Failed to complete the order. Please try again.",
      });
    } finally {
      setCompleteTargetId("");
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>📦 Order Status</h1>
        <p style={styles.loadingText}>⏳ Loading orders...</p>
      </div>
    );
  }

  // Show justPlaced alert only if the order exists and is not cancelled
  const currentOrder = orders.find(
    (o) => normalizeOrderId(o._id) === normalizeOrderId(orderId),
  );

  const renderReceiptAction = (order) => {
    const normalizedId = normalizeOrderId(order?._id);
    const isCompleted = order?.status === "Completed";

    if (!isCompleted) {
      return (
        <div style={styles.receiptNote}>
          Receipt will be available after the order is completed.
        </div>
      );
    }

    return (
      <button
        style={styles.receiptButton}
        onClick={() => downloadReceipt(order)}
        disabled={receiptLoadingId === normalizedId}
      >
        {receiptLoadingId === normalizedId
          ? "Generating Receipt..."
          : "⬇️ Download Receipt PDF"}
      </button>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 Order Status</h1>
      </div>

      {currentOrder && justPlaced && (
        <div style={styles.newOrderAlert}>
          <h2 style={styles.newOrderTitle}>🎉 Order Placed Successfully!</h2>
          <div style={styles.newOrderCard}>
            <div style={styles.orderHeader}>
              <h3 style={styles.orderTitle}>Order ID: {currentOrder._id}</h3>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(currentOrder.status),
                }}
              >
                {getStatusEmoji(currentOrder.status)} {currentOrder.status}
              </span>
            </div>

            <div style={styles.orderDetails}>
              <div style={styles.orderItems}>
                <h4 style={styles.subTitle}>📋 Items:</h4>
                {currentOrder.items.map((item, index) => (
                  <div key={index} style={styles.orderItem}>
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={styles.orderInfo}>
                <p>
                  <strong>👤 Student Name:</strong> {currentOrder.studentName}
                </p>
                <p>
                  <strong>🆔 Student ID:</strong> {currentOrder.studentId}
                </p>
                <p>
                  <strong>💰 Total:</strong> Rs. {currentOrder.total}
                </p>
                <p>
                  <strong>📅 Pickup Date:</strong> {currentOrder.pickupDate}
                </p>
                <p>
                  <strong>🕐 Pickup Time:</strong> {currentOrder.pickupTime}
                </p>
              </div>
            </div>

            <div style={styles.statusSection}>
              <h4 style={styles.subTitle}>🔄 Status Flow:</h4>
              <OrderStatusFlow status={currentOrder.status} />
            </div>

            <div style={styles.receiptSection}>
              {renderReceiptAction(currentOrder)}
            </div>
          </div>
        </div>
      )}

      <div style={styles.allOrdersSection}>
        <h2 style={styles.sectionTitle}>
          {currentOrder && justPlaced
            ? "📋 All Recent Orders"
            : "📋 Your Orders"}
        </h2>

        {orders.length === 0 ? (
          <div style={styles.noOrders}>
            <div style={styles.emptyIcon}>🛒</div>
            <p>No orders found yet</p>
            <button style={styles.shopButton} onClick={() => navigate("/menu")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map((order) => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <h3 style={styles.orderTitle}>Order ID: {order._id}</h3>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(order.status),
                    }}
                  >
                    {getStatusEmoji(order.status)} {order.status}
                  </span>
                </div>

                <div style={styles.orderDetails}>
                  <div style={styles.orderItems}>
                    <h4 style={styles.subTitle}>Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} style={styles.orderItem}>
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div style={styles.orderInfo}>
                    <p>
                      <strong>👤 Student Name:</strong> {order.studentName}
                    </p>
                    <p>
                      <strong>🆔 Student ID:</strong> {order.studentId}
                    </p>
                    <p>
                      <strong>💰 Total:</strong> Rs. {order.total}
                    </p>
                    <p>
                      <strong>📅 Pickup Date:</strong> {order.pickupDate}
                    </p>
                    <p>
                      <strong>🕐 Pickup Time:</strong> {order.pickupTime}
                    </p>
                  </div>
                </div>

                <div style={styles.statusSection}>
                  <h4 style={styles.subTitle}>Status Flow:</h4>
                  <OrderStatusFlow status={order.status} />
                </div>

                <div style={styles.receiptSection}>
                  {renderReceiptAction(order)}
                </div>

                {(order.status === "Pending" ||
                  order.status === "Accepted") && (
                  <button
                    style={styles.cancelButton}
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    ❌ Cancel Order
                  </button>
                )}

                {order.status === "Ready" && (
                  <button
                    style={styles.completeButton}
                    onClick={() => handleCompleteOrder(order._id)}
                  >
                    ✅ Complete Order
                  </button>
                )}

                {order.status === "Cancelled" && (
                  <div style={styles.rejectedMessage}>
                    {order.cancelledByAdmin
                      ? order.statusMessage || "Kitchen rejected the order"
                      : order.statusMessage || "Order cancelled"}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.actionButtons}>
        <button style={styles.refreshButton} onClick={fetchOrders}>
          🔄 Refresh Orders
        </button>
        <button style={styles.menuButton} onClick={() => navigate("/menu")}>
          🍽️ Go to Menu
        </button>
        <button style={styles.backButton} onClick={() => navigate("/")}>
          🛍️ Continue Shopping
        </button>
      </div>

      {cancelTargetId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>Cancel This Order?</h3>
            <p style={styles.modalText}>
              This action will remove the order from your active list.
            </p>
            <div style={styles.modalActions}>
              <button
                style={styles.modalCancelButton}
                onClick={() => setCancelTargetId("")}
              >
                Keep Order
              </button>
              <button
                style={styles.modalConfirmButton}
                onClick={confirmCancelOrder}
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {completeTargetId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>Complete This Order?</h3>
            <p style={styles.modalText}>
              Mark this ready order as completed after pickup.
            </p>
            <div style={styles.modalActions}>
              <button
                style={styles.modalCancelButton}
                onClick={() => setCompleteTargetId("")}
              >
                Not Yet
              </button>
              <button
                style={styles.modalSuccessCloseButton}
                onClick={confirmCompleteOrder}
              >
                Yes, Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {popup.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3
              style={{
                ...styles.modalTitle,
                color: popup.type === "success" ? "#166534" : "#991b1b",
              }}
            >
              {popup.type === "success" ? "Success" : "Something went wrong"}
            </h3>
            <p style={styles.modalText}>{popup.message}</p>
            <div style={styles.modalActionsSingle}>
              <button
                style={
                  popup.type === "success"
                    ? styles.modalSuccessCloseButton
                    : styles.modalErrorCloseButton
                }
                onClick={closePopup}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" },
  header: { textAlign: "center", marginBottom: "40px" },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px",
  },
  loadingText: { textAlign: "center", color: "#6b7280", fontSize: "16px" },
  noOrders: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
  },
  completeButton: {
    marginTop: "16px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  rejectedMessage: {
    marginTop: "12px",
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    fontSize: "13px",
    fontWeight: "600",
  },
  emptyIcon: { fontSize: "64px", marginBottom: "20px" },
  shopButton: {
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#1e40af",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
  ordersList: { marginBottom: "30px" },
  orderCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    backgroundColor: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "2px solid #e5e7eb",
  },
  orderTitle: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
  },
  statusBadge: {
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  orderDetails: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  orderItems: { margin: 0 },
  subTitle: {
    margin: "0 0 12px 0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1f2937",
  },
  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: "14px",
    color: "#6b7280",
    borderBottom: "1px solid #f3f4f6",
  },
  orderInfo: { margin: 0, fontSize: "14px", color: "#6b7280" },
  statusSection: { marginTop: "20px" },
  receiptSection: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "flex-start",
  },
  receiptButton: {
    border: "none",
    background:
      "linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(37, 99, 235) 100%)",
    color: "white",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow: "0 10px 20px rgba(15, 23, 42, 0.18)",
  },
  receiptNote: {
    padding: "12px 14px",
    borderRadius: "10px",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "600",
  },
  statusFlow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "15px",
    gap: "8px",
  },
  statusStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  statusDot: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    marginBottom: "8px",
  },
  statusText: { fontSize: "12px", textAlign: "center", fontWeight: "500" },
  statusLine: {
    position: "absolute",
    top: "12px",
    left: "50%",
    width: "100%",
    height: "2px",
  },
  refreshButton: {
    backgroundColor: "#059669",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
  menuButton: {
    backgroundColor: "#0ea5e9",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#1e40af",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: "12px",
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  newOrderAlert: {
    backgroundColor: "#dcfce7",
    border: "2px solid #86efac",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "30px",
  },
  newOrderTitle: {
    color: "#166534",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },
  newOrderCard: {
    border: "2px solid #10b981",
    borderRadius: "12px",
    padding: "24px",
    backgroundColor: "#f0fdf4",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  allOrdersSection: { marginTop: "40px" },
  sectionTitle: {
    color: "#1f2937",
    marginBottom: "20px",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "12px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginTop: "30px",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    backdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
  },
  modalCard: {
    width: "100%",
    maxWidth: "440px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.25)",
  },
  modalTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    fontWeight: "800",
    color: "#1f2937",
  },
  modalText: {
    margin: 0,
    color: "#475569",
    fontSize: "15px",
    lineHeight: 1.6,
  },
  modalActions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "18px",
  },
  modalActionsSingle: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "18px",
  },
  modalCancelButton: {
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#334155",
    borderRadius: "10px",
    padding: "10px 14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  modalConfirmButton: {
    border: "none",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "10px 14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  modalSuccessCloseButton: {
    border: "none",
    backgroundColor: "#16a34a",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "10px 18px",
    fontWeight: "700",
    cursor: "pointer",
  },
  modalErrorCloseButton: {
    border: "none",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "10px 18px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default OrderStatusPage;
