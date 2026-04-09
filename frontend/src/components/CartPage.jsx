import React from 'react';
import { useNavigate } from 'react-router-dom';


const CartPage = ({ cart, removeFromCart, updateQuantity, clearCart }) => {
  const navigate = useNavigate();

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    },
    emptyContainer: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f9fafb',
      borderRadius: '12px'
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '20px'
    },
    emptyText: {
      fontSize: '20px',
      color: '#6b7280',
      marginBottom: '24px'
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    cartTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '30px',
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    tableHeader: {
      backgroundColor: '#f3f4f6',
      borderBottom: '2px solid #e5e7eb'
    },
    tableHeaderCell: {
      padding: '16px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#1f2937',
      fontSize: '14px'
    },
    tableRow: {
      borderBottom: '1px solid #e5e7eb'
    },
    tableCell: {
      padding: '16px',
      color: '#1f2937'
    },
    itemName: {
      fontWeight: '600',
      fontSize: '16px'
    },
    quantityControl: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    quantityButton: {
      width: '32px',
      height: '32px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e40af',
      transition: 'all 0.2s'
    },
    quantityInput: {
      width: '50px',
      padding: '4px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      textAlign: 'center',
      fontSize: '14px'
    },
    removeButton: {
      padding: '6px 12px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s'
    },
    summaryContainer: {
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '30px'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      fontSize: '16px'
    },
    sumLabel: {
      color: '#6b7280'
    },
    sumValue: {
      fontWeight: '600',
      color: '#1f2937'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '2px solid #e5e7eb',
      paddingTop: '12px',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    totalLabel: {
      color: '#1f2937'
    },
    totalValue: {
      color: '#1e40af'
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end'
    },
    buttonSecondary: {
      padding: '12px 24px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    buttonPrimary: {
      padding: '12px 32px',
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    }
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🛒 Your Cart</h1>
        </div>

        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>🛒</div>
          <p style={styles.emptyText}>Your cart is empty</p>
          <button
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1e3a8a'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1e40af'}
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛒 Your Cart</h1>
      </div>

      {/* Cart Items Table */}
      <table style={styles.cartTable}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.tableHeaderCell}>Item</th>
            <th style={styles.tableHeaderCell}>Price</th>
            <th style={styles.tableHeaderCell}>Quantity</th>
            <th style={styles.tableHeaderCell}>Total</th>
            <th style={styles.tableHeaderCell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} style={styles.tableRow}>
              <td style={styles.tableCell}>
                <div style={styles.itemName}>{item.name}</div>
              </td>
              <td style={styles.tableCell}>Rs. {item.price}</td>
              <td style={styles.tableCell}>
                <div style={styles.quantityControl}>
                  <button
                    style={styles.quantityButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e6f0ff'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    style={styles.quantityInput}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value) || 1;
                      updateQuantity(item.id, Math.max(1, newQty));
                    }}
                  />
                  <button
                    style={styles.quantityButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e6f0ff'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td style={styles.tableCell}>
                <strong>Rs. {item.price * item.quantity}</strong>
              </td>
              <td style={styles.tableCell}>
                <button
                  style={styles.removeButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Summary */}
      <div style={styles.summaryContainer}>
        <div style={styles.summaryRow}>
          <span style={styles.sumLabel}>Subtotal:</span>
          <span style={styles.sumValue}>Rs. {total}</span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.sumLabel}>Items Count:</span>
          <span style={styles.sumValue}>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>TOTAL:</span>
          <span style={styles.totalValue}>Rs. {total}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button
          style={styles.buttonSecondary}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
          onClick={() => {
            clearCart();
            navigate('/');
          }}
        >
          Clear Cart
        </button>
        <button
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1e3a8a'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#1e40af'}
          onClick={() => navigate('/booking')}
        >
          Proceed to Booking →
        </button>
      </div>
    </div>
  );
};

export default CartPage;
