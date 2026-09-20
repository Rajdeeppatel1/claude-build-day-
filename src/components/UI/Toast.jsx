import { useNotifications } from '../../context/NotificationContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export default function Toast() {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <Icon size={18} />
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              {toast.message && (
                <div className="toast-message">{toast.message}</div>
              )}
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
