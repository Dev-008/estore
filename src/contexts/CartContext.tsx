import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/data/products";
import Logger from "@/lib/logger";
import { ValidationError } from "@/lib/errors";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getCartSummary: () => { itemCount: number; totalAmount: number };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    try {
      if (quantity <= 0) {
        throw new ValidationError("Quantity must be greater than 0");
      }

      setItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        const newItems = existing
          ? prev.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            )
          : [...prev, { product, quantity }];

        Logger.info(`Added to cart: ${product.name} (qty: ${quantity})`);
        return newItems;
      });
    } catch (error) {
      Logger.error("Error adding to cart", error);
      throw error;
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => {
      const removed = prev.find((item) => item.product.id === productId);
      if (removed) {
        Logger.info(`Removed from cart: ${removed.product.name}`);
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    try {
      if (quantity < 0) {
        throw new ValidationError("Quantity cannot be negative");
      }

      setItems((prev) => {
        if (quantity === 0) {
          const removed = prev.find((item) => item.product.id === productId);
          if (removed) {
            Logger.info(`Quantity set to 0, removing: ${removed.product.name}`);
          }
          return prev.filter((item) => item.product.id !== productId);
        }

        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      });
    } catch (error) {
      Logger.error("Error updating cart quantity", error);
      throw error;
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    Logger.info("Cart cleared");
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const getCartSummary = useCallback(
    () => ({
      itemCount: totalItems,
      totalAmount: totalPrice,
    }),
    [totalItems, totalPrice]
  );

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    getCartSummary,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
