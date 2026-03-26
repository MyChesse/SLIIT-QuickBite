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
            console.log('Fetching orders...');
            const response = await axios.get('http://localhost:5001/orders');
            
            console.log('Orders response:', response.data);
            setOrders(response.data);
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
            case 'Cancelled': return '#ef4444';
            default: return '#9ca3af';
        }
    };

    const getStatusEmoji = (status) => {
        switch (status) {
            case 'Pending': return '⏳';
            case 'Accepted': return '✓';
            case 'Ready': return '🎁';
            case 'Completed': return '✅';
            case 'Cancelled': return '❌';
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
                                backgroundColor: index <= currentIndex
                                    ? getStatusColor(status) 
                                    : '#d1d5db'
                            }}
                        />
                        <span 
                            style={{
                                ...styles.statusText,
                                color: index <= currentIndex
                                    ? getStatusColor(status) 
                                    : '#9ca3af',
                                fontWeight: s === status ? 'bold' : 'normal'
                            }}
                        >
                            {s}
                        </span>
                        {index < statuses.length - 1 && (
                            <div 
                                style={{
                                    ...styles.statusLine,
                                    backgroundColor: index < currentIndex
                                        ? getStatusColor(status) 
                                        : '#d1d5db'
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <h1 style={styles.title}>📦 Order Status</h1>
                <p style={styles.loadingText}>⏳ Loading orders...</p>
            </div>
        );
    }

    const currentOrder = orders.find(o => o._id === orderId);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📦 Order Status</h1>
            </div>
            
            {/* Show newly placed order prominently */}
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
            
            {/* Show all orders */}
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
                        {orders.map((order) => (
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
                                        <p><strong>Total:</strong> Rs. {order.total}</p>
                                        <p><strong>Pickup Date:</strong> {order.pickupDate}</p>
                                        <p><strong>Pickup Time:</strong> {order.pickupTime}</p>
                                    </div>
                                </div>

                                <div style={styles.statusSection}>
                                    <h4 style={styles.subTitle}>Status Flow:</h4>
                                    <OrderStatusFlow status={order.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={styles.actionButtons}>
                <button 
                    style={styles.refreshButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#064e3b'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
                    onClick={fetchOrders}
                >
                    🔄 Refresh Orders
                </button>
                <button 
                    style={styles.backButton}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1e3a8a'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#1e40af'}
                    onClick={() => navigate('/')}
                >
                    🛍️ Continue Shopping
                </button>
            </div>
        </div>
    );
};

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
    loadingText: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '16px'
    },
    noOrders: {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px'
    },
    emptyIcon: {
        fontSize: '64px',
        marginBottom: '20px'
    },
    shopButton: {
        marginTop: '20px',
        padding: '12px 24px',
        backgroundColor: '#1e40af',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background-color 0.3s'
    },
    ordersList: {
        marginBottom: '30px'
    },
    orderCard: {
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s'
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '2px solid #e5e7eb'
    },
    orderTitle: {
        margin: '0',
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937'
    },
    statusBadge: {
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
    },
    orderDetails: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        marginBottom: '20px'
    },
    orderItems: {
        margin: 0
    },
    subTitle: {
        margin: '0 0 12px 0',
        fontSize: '14px',
        fontWeight: '600',
        color: '#1f2937'
    },
    orderItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        fontSize: '14px',
        color: '#6b7280',
        borderBottom: '1px solid #f3f4f6'
    },
    orderInfo: {
        margin: 0,
        fontSize: '14px',
        color: '#6b7280'
    },
    statusSection: {
        marginTop: '20px'
    },
    statusFlow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '15px',
        gap: '8px'
    },
    statusStep: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        position: 'relative'
    },
    statusDot: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        marginBottom: '8px'
    },
    statusText: {
        fontSize: '12px',
        textAlign: 'center',
        fontWeight: '500'
    },
    statusLine: {
        position: 'absolute',
        top: '12px',
        left: '50%',
        width: '100%',
        height: '2px'
    },
    refreshButton: {
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background-color 0.3s'
    },
    backButton: {
        backgroundColor: '#1e40af',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background-color 0.3s'
    },
    newOrderAlert: {
        backgroundColor: '#dcfce7',
        border: '2px solid #86efac',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px'
    },
    newOrderTitle: {
        color: '#166534',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold'
    },
    newOrderCard: {
        border: '2px solid #10b981',
        borderRadius: '12px',
        padding: '24px',
        backgroundColor: '#f0fdf4',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    allOrdersSection: {
        marginTop: '40px'
    },
    sectionTitle: {
        color: '#1f2937',
        marginBottom: '20px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '12px',
        fontSize: '20px',
        fontWeight: 'bold'
    },
    actionButtons: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginTop: '30px'
    }
};

export default OrderStatusPage;
