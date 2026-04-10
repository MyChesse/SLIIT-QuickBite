import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ADD TO CART
  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item._id);

      if (exists) {
        return prev.map((i) =>
          i.id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      return [
        ...prev,
        {
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  // REMOVE
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  // UPDATE QTY
  const updateQuantity = (id, qty) => {
    if (qty < 1) return;

    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  };

  // CLEAR CART
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
