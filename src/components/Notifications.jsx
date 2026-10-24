import React, { useState, useRef, useEffect } from "react";

export function Notifications({ db, up, me }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!me) return null;

  // Filter notifications relevant to current user
  const userNotifs = (db.notifications || [])
    .filter((n) => n.recipientId === me.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unreadCount = userNotifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    up((d) => ({
      ...d,
      notifications: (d.notifications || []).map((n) =>
        n.recipientId === me.id ? { ...n, read: true } : n,
      ),
    }));
  };

  const markOneRead = (id, link) => {
    up((d) => ({
      ...d,
      notifications: (d.notifications || []).map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
    setOpen(false);
    if (link) {
      window.location.hash = link;
    }
  };

  const clearAll = () => {
    up((d) => ({
      ...d,
      notifications: (d.notifications || []).filter(
        (n) => n.recipientId !== me.id,
      ),
    }));
  };

  return (
    <div className="notif-wrapper" ref={ref}>
      <button
        className="notif-bell-btn"
        onClick={() => setOpen(!open)}
        title="Notifications"
        aria-label="View notifications"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h4>
              Notifications{" "}
              {unreadCount > 0 && (
                <span className="badge">{unreadCount} new</span>
              )}
            </h4>
            <div className="notif-actions">
              {unreadCount > 0 && (
                <button className="notif-btn-text" onClick={markAllRead}>
                  Mark all read
                </button>
              )}
              {userNotifs.length > 0 && (
                <button
                  className="notif-btn-text text-danger"
                  onClick={clearAll}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="notif-list">
            {userNotifs.length === 0 ? (
              <div className="notif-empty">
                <span style={{ fontSize: 28 }}>📭</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              userNotifs.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.read ? "unread" : ""}`}
                  onClick={() => markOneRead(n.id, n.link)}
                >
                  <div className="notif-icon-circle">
                    {n.type === "interview"
                      ? "📅"
                      : n.type === "status"
                        ? "📋"
                        : n.type === "apply"
                          ? "💼"
                          : "🔔"}
                  </div>
                  <div className="notif-body">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-message">{n.message}</div>
                    <div className="notif-time">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleDateString() +
                          " " +
                          new Date(n.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Recently"}
                    </div>
                  </div>
                  {!n.read && <span className="unread-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
