import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const BookingPage = ({ cart, clearCart }) => {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const styles = {
    container: {
      maxWidth: "700px",
      margin: "0 auto",
      padding: "40px 20px",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "8px",
    },
    emptyContainer: {
      textAlign: "center",
      padding: "60px 20px",
      backgroundColor: "#f9fafb",
      borderRadius: "12px",
    },
    emptyText: {
      fontSize: "20px",
      color: "#6b7280",
      marginBottom: "24px",
    },
    button: {
      padding: "12px 24px",
      backgroundColor: "#1e40af",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    orderSummary: {
      backgroundColor: "#f9fafb",
      padding: "24px",
      borderRadius: "12px",
      marginBottom: "30px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    summaryTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "16px",
      color: "#1f2937",
    },
    summaryItem: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
      paddingBottom: "12px",
      borderBottom: "1px solid #e5e7eb",
      color: "#6b7280",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "16px",
      paddingTop: "16px",
      borderTop: "2px solid #1e40af",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#1f2937",
    },
    totalValue: {
      color: "#1e40af",
    },
    form: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    formGroup: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "600",
      color: "#1f2937",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      boxSizing: "border-box",
      transition: "border-color 0.3s",
    },
    submitButton: {
      width: "100%",
      padding: "12px 24px",
      backgroundColor: "#1e40af",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    alert: {
      padding: "12px 16px",
      borderRadius: "8px",
      marginBottom: "16px",
      fontSize: "14px",
      fontWeight: "600",
    },
    alertError: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    },
    alertSuccess: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const validateForm = () => {
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty! Please add items.");
      return false;
    }

    if (!studentName.trim()) {
      setError("Student name is required.");
      return false;
    }

    const idPattern = /^IT\d{8}$/;

    if (!idPattern.test(studentId)) {
      setError("Student ID must be like IT12345678");
      return false;
    }

    if (!pickupDate) {
      setError("Please select pickup date.");
      return false;
    }

    if (!pickupTime) {
      setError("Please select pickup time.");
      return false;
    }

    const selectedDateTime = new Date(`${pickupDate}T${pickupTime}`);

    if (selectedDateTime < new Date()) {
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
        studentId,

        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),

        total: calculateTotal(),
        pickupDate,
        pickupTime,
      };

      const response = await axios.post(
        "http://localhost:5001/orders/create",
        orderData,
      );

      setSuccess("Order Placed Successfully!");

      clearCart();

      setTimeout(() => {
        navigate("/order-status", {
          state: {
            orderId: String(response.data.order._id),
            justPlaced: true,
          },
        });
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to place order";

      setError("Error: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📋 Booking</h1>
        </div>

        <div style={styles.emptyContainer}>
          <div
            style={{
              fontSize: "64px",
              marginBottom: "20px",
            }}
          >
            🛒
          </div>

          <p style={styles.emptyText}>Your cart is empty!</p>

          <button style={styles.button} onClick={() => navigate("/")}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Booking Details</h1>
      </div>

      {error && (
        <div
          style={{
            ...styles.alert,
            ...styles.alertError,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            ...styles.alert,
            ...styles.alertSuccess,
          }}
        >
          {success}
        </div>
      )}

      {/* Order Summary */}

      <div style={styles.orderSummary}>
        <div style={styles.summaryTitle}>📦 Order Summary</div>

        {cart.map((item) => (
          <div key={item.id} style={styles.summaryItem}>
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              Rs.
              {item.price * item.quantity}
            </span>
          </div>
        ))}

        <div style={styles.totalRow}>
          <span>TOTAL:</span>

          <span style={styles.totalValue}>Rs. {calculateTotal()}</span>
        </div>
      </div>

      {/* Booking Form */}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Student Name */}

        <div style={styles.formGroup}>
          <label style={styles.label}>👤 Student Name</label>

          <input
            type="text"
            value={studentName}
            onChange={(e) => {
              const formattedValue = e.target.value
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase());

              setStudentName(formattedValue);
            }}
            style={styles.input}
            required
          />
        </div>

        {/* Student ID */}

        <div style={styles.formGroup}>
          <label style={styles.label}>🆔 Student ID</label>

          <input
            type="text"
            placeholder="IT12345678"
            value={studentId}
            onChange={(e) => {
              let value = e.target.value.toUpperCase();

              // If it doesn't start with IT, automatically add IT
              if (!value.startsWith("IT")) {
                value = "IT" + value.replace(/^IT/, "");
              }

              // Allow only digits after IT and max 8 digits
              const digits = value.slice(2).replace(/\D/g, "").slice(0, 8);

              setStudentId("IT" + digits);
            }}
            style={styles.input}
            required
          />
        </div>

        {/* Pickup Date */}

        <div style={styles.formGroup}>
          <label style={styles.label}>📅 Pickup Date</label>

          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            style={styles.input}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        {/* Pickup Time */}

        <div style={styles.formGroup}>
          <label style={styles.label}>🕐 Pickup Time</label>

          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? "⏳ Placing Order..." : "✓ Place Order"}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
