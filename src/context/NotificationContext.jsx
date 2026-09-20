import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    const all = JSON.parse(
      localStorage.getItem('annasetu_notifications') || '[]'
    );
    const userNotifs = all.filter((n) => n.userId === user.id);
    setNotifications(userNotifs);
    setUnreadCount(userNotifs.filter((n) => !n.read).length);
  }, [user]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = useCallback(
    (notifId) => {
      const all = JSON.parse(
        localStorage.getItem('annasetu_notifications') || '[]'
      );
      const idx = all.findIndex((n) => n.id === notifId);
      if (idx !== -1) {
        all[idx].read = true;
        localStorage.setItem('annasetu_notifications', JSON.stringify(all));
        loadNotifications();
      }
    },
    [loadNotifications]
  );

  const markAllAsRead = useCallback(() => {
    if (!user) return;
    const all = JSON.parse(
      localStorage.getItem('annasetu_notifications') || '[]'
    );
    all.forEach((n) => {
      if (n.userId === user.id) n.read = true;
    });
    localStorage.setItem('annasetu_notifications', JSON.stringify(all));
    loadNotifications();
  }, [user, loadNotifications]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        markAsRead,
        markAllAsRead,
        addToast,
        removeToast,
        loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
