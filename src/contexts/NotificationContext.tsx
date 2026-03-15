import React, { createContext, useContext, useState, useCallback } from "react";

export interface NotificationMessage {
  id: string;
  type: "order" | "shipping" | "delivery" | "alert";
  title: string;
  description: string;
  orderId: string;
  orderData?: {
    trackingId: string;
    date: string;
    customer: string;
    email: string;
    phone: string;
    amount: number;
    items: any[];
    paymentMethod: string;
    status: string;
  };
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: NotificationMessage[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationMessage, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>(() => {
    try {
      const stored = localStorage.getItem("notifications");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveToLocalStorage = (newNotifications: NotificationMessage[]) => {
    localStorage.setItem("notifications", JSON.stringify(newNotifications));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (notification: Omit<NotificationMessage, "id" | "timestamp" | "read">) => {
      const newNotification: NotificationMessage = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        read: false,
      };

      const updatedNotifications = [newNotification, ...notifications];
      setNotifications(updatedNotifications);
      saveToLocalStorage(updatedNotifications);
    },
    [notifications]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    saveToLocalStorage([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
