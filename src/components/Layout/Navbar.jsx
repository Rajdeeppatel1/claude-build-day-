import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Menu, X } from 'lucide-react';
import { timeAgo } from '../../utils/helpers';

export default function Navbar({ title, onToggleSidebar }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
          <Menu size={22} />
        </button>
        <h2 className="navbar-title">{title}</h2>
      </div>
      <div className="navbar-right" ref={dropdownRef}>
        <div style={{ position: 'relative' }}>
          <button
            className="notification-btn"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          {showDropdown && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: '32px',
                      textAlign: 'center',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.85rem',
                    }}
                  >
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${
                        !notif.read ? 'unread' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notif.id);
                      }}
                    >
                      <div className="notification-item-title">
                        {notif.title}
                      </div>
                      <div className="notification-item-message">
                        {notif.message}
                      </div>
                      <div className="notification-item-time">
                        {timeAgo(notif.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
