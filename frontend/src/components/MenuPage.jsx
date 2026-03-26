import React from 'react';

const MenuPage = ({ addToCart }) => {
  // Hardcoded menu items
  const menuItems = [
    { id: 1, name: 'Chicken Curry', price: 350, description: 'Spiced chicken curry with rice' },
    { id: 2, name: 'Fish Curry', price: 400, description: 'Fresh fish in aromatic curry sauce' },
    { id: 3, name: 'Dhal Curry', price: 250, description: 'Lentils cooked with spices' },
    { id: 4, name: 'Vegetable Stir Fry', price: 280, description: 'Mixed vegetables stir fried' },
    { id: 5, name: 'Kottu Roti', price: 320, description: 'Chopped roti with meat and vegetables' },
    { id: 6, name: 'Hoppers', price: 180, description: 'Traditional hoppers with curry' },
    { id: 7, name: 'Lamprais', price: 380, description: 'Rice and meat wrapped in banana leaves' },
    { id: 8, name: 'Short Eats Mix', price: 200, description: 'Assorted short eats and pastries' },
    { id: 9, name: 'Fried Rice', price: 300, description: 'Fried rice with vegetables and egg' },
    { id: 10, name: 'Spring Rolls', price: 150, description: 'Crispy spring rolls (per piece)' },
    { id: 11, name: 'Sandwich', price: 120, description: 'Fresh sandwich with vegetables' },
    { id: 12, name: 'Juice', price: 100, description: 'Fresh fruit juice' }
  ];

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
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
    subtitle: {
      fontSize: '16px',
      color: '#6b7280'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '24px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    cardHover: {
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      transform: 'translateY(-4px)'
    },
    itemName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    },
    itemDescription: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '12px'
    },
    itemPrice: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1e40af',
      marginBottom: '12px'
    },
    button: {
      width: '100%',
      padding: '10px 16px',
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    buttonHover: {
      backgroundColor: '#1e3a8a'
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`${item.name} added to cart!`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🍽️ Order & Booking Management</h1>
        <p style={styles.subtitle}>Select your favorite items from our menu</p>
      </div>

      <div style={styles.grid}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              e.currentTarget.style.transform = styles.cardHover.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = styles.card.boxShadow;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={styles.itemName}>{item.name}</div>
            <div style={styles.itemDescription}>{item.description}</div>
            <div style={styles.itemPrice}>Rs. {item.price}</div>
            <button
              style={styles.button}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.button.backgroundColor;
              }}
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
