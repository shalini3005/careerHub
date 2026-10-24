import React from "react";

export function ToastContainer({ toasts, removeToast }) {
  if (!toasts || !toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item toast-${t.type || "info"}`}>
          <span className="toast-icon">
            {t.type === "success"
              ? "✅"
              : t.type === "error"
                ? "❌"
                : t.type === "email"
                  ? "📧"
                  : "ℹ️"}
          </span>
          <div className="toast-content">
            {t.title && <div className="toast-title">{t.title}</div>}
            <div className="toast-message">{t.message}</div>
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(t.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
