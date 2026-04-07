import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';

const OrderStatusPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const justPlaced = location.state?.justPlaced;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/orders');
      // Filter out cancelled orders immediately
      setOrders(response.data.filter(order => order.status !== 'Cancelled'));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f59e0b';
      case 'Accepted': return '#3b82f6';
      case 'Ready': return '#a855f7';
      case 'Completed': return '#10b981';
      default: return '#9ca3af';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Accepted': return '✓';
      case 'Ready': return '🎁';
      case 'Completed': return '✅';
      default: return '📦';
    }
  };

  const OrderStatusFlow = ({ status }) => {
    const statuses = ['Pending', 'Accepted', 'Ready', 'Completed'];
    const currentIndex = statuses.indexOf(status);

    return (
      <div style={styles.statusFlow}>
        {statuses.map((s, index) => (
          <div key={s} style={styles.statusStep}>
            <div
              style={{
                ...styles.statusDot,
                backgroundColor: index <= currentIndex ? getStatusColor(status) : '#d1d5db'
              }}
            />
            <span
              style={{
                ...styles.statusText,
                color: index <= currentIndex ? getStatusColor(status) : '#9ca3af',
                fontWeight: s === status ? 'bold' : 'normal'
              }}
            >
              {s}
            </span>
            {index < statuses.length - 1 && (
              <div
                style={{
                  ...styles.statusLine,
                  backgroundColor: index < currentIndex ? getStatusColor(status) : '#d1d5db'
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleCancelOrder = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await axios.put(`http://localhost:5001/orders/${id}/cancel`);
      // Remove cancelled order immediately from UI
      setOrders(prev => prev.filter(order => order._id !== id));
      alert('Order cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel the order. Please try again.');
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
  const currentOrder = orders.find(o => o._id === orderId);

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
                  backgroundColor: getStatusColor(currentOrder.status)
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
                    <span>{item.name} × {item.quantity}</span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={styles.orderInfo}>
                <p><strong>👤 Student Name:</strong> {currentOrder.studentName}</p>
                <p><strong>🆔 Student ID:</strong> {currentOrder.studentId}</p>
                <p><strong>💰 Total:</strong> Rs. {currentOrder.total}</p>
                <p><strong>📅 Pickup Date:</strong> {currentOrder.pickupDate}</p>
                <p><strong>🕐 Pickup Time:</strong> {currentOrder.pickupTime}</p>
              </div>
            </div>

            <div style={styles.statusSection}>
              <h4 style={styles.subTitle}>🔄 Status Flow:</h4>
              <OrderStatusFlow status={currentOrder.status} />
            </div>
          </div>
        </div>
      )}

      <div style={styles.allOrdersSection}>
        <h2 style={styles.sectionTitle}>
          {currentOrder && justPlaced ? '📋 All Recent Orders' : '📋 Your Orders'}
        </h2>

        {orders.length === 0 ? (
          <div style={styles.noOrders}>
            <div style={styles.emptyIcon}>🛒</div>
            <p>No orders found yet</p>
            <button
              style={styles.shopButton}
              onClick={() => navigate('/')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map(order => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <h3 style={styles.orderTitle}>Order ID: {order._id}</h3>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(order.status)
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
                        <span>{item.name} × {item.quantity}</span>
                        <span>Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div style={styles.orderInfo}>
                    <p><strong>👤 Student Name:</strong> {order.studentName}</p>
                    <p><strong>🆔 Student ID:</strong> {order.studentId}</p>
                    <p><strong>💰 Total:</strong> Rs. {order.total}</p>
                    <p><strong>📅 Pickup Date:</strong> {order.pickupDate}</p>
                    <p><strong>🕐 Pickup Time:</strong> {order.pickupTime}</p>
                  </div>
                </div>

                <div style={styles.statusSection}>
                  <h4 style={styles.subTitle}>Status Flow:</h4>
                  <OrderStatusFlow status={order.status} />
                </div>

                <button
                  style={styles.cancelButton}
                  onClick={() => handleCancelOrder(order._id)}
                >
                  ❌ Cancel Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.actionButtons}>
        <button style={styles.refreshButton} onClick={fetchOrders}>🔄 Refresh Orders</button>
        <button style={styles.backButton} onClick={() => navigate('/')}>🛍️ Continue Shopping</button>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' },
  loadingText: { textAlign: 'center', color: '#6b7280', fontSize: '16px' },
  noOrders: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9fafb', borderRadius: '12px' },
  emptyIcon: { fontSize: '64px', marginBottom: '20px' },
  shopButton: { marginTop: '20px', padding: '12px 24px', backgroundColor: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' },
  ordersList: { marginBottom: '30px' },
  orderCard: { border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e5e7eb' },
  orderTitle: { margin: '0', fontSize: '18px', fontWeight: '600', color: '#1f2937' },
  statusBadge: { color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  orderDetails: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' },
  orderItems: { margin: 0 },
  subTitle: { margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937' },
  orderItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#6b7280', borderBottom: '1px solid #f3f4f6' },
  orderInfo: { margin: 0, fontSize: '14px', color: '#6b7280' },
  statusSection: { marginTop: '20px' },
  statusFlow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px', gap: '8px' },
  statusStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  statusDot: { width: '24px', height: '24px', borderRadius: '50%', marginBottom: '8px' },
  statusText: { fontSize: '12px', textAlign: 'center', fontWeight: '500' },
  statusLine: { position: 'absolute', top: '12px', left: '50%', width: '100%', height: '2px' },
  refreshButton: { backgroundColor: '#059669', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' },
  backButton: { backgroundColor: '#1e40af', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' },
  cancelButton: { marginTop: '12px', padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  newOrderAlert: { backgroundColor: '#dcfce7', border: '2px solid #86efac', borderRadius: '12px', padding: '20px', marginBottom: '30px' },
  newOrderTitle: { color: '#166534', marginBottom: '20px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' },
  newOrderCard: { border: '2px solid #10b981', borderRadius: '12px', padding: '24px', backgroundColor: '#f0fdf4', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  allOrdersSection: { marginTop: '40px' },
  sectionTitle: { color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', fontSize: '20px', fontWeight: 'bold' },
  actionButtons: { display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '30px' }
};

export default OrderStatusPage;