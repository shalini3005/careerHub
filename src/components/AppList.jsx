import React, { useState } from "react";
import { Logo } from "./Logo";
import { StatusBadge } from "./StatusBadge";
import { sal } from "../utils/data";
import { deleteApplication } from "../services/api";

export function AppList({ db, up, list, toast }) {
  const [withdrawingId, setWithdrawingId] = useState(null);

  if (!list.length) return <p className="m">Nothing here yet.</p>;

  const handleWithdraw = async (a) => {
    if (withdrawingId) return;
    if (!confirm("Are you sure you want to withdraw this application?")) return;

    setWithdrawingId(a.id);
    try {
      await deleteApplication(a.id);
      up((d) => ({
        ...d,
        apps: d.apps.filter((x) => String(x.id) !== String(a.id)),
      }));
      if (toast) toast({ message: "Application withdrawn successfully.", type: "info" });
    } catch (err) {
      if (toast) toast({ message: err.message || "Failed to withdraw application", type: "error" });
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div>
      {list.map((a) => {
        const j = db.jobs.find((x) => String(x.id) === String(a.jid));
        if (!j) return null;
        const isWithdrawing = withdrawingId === a.id;

        return (
          <div
            className="card row"
            key={a.id}
            style={{ opacity: isWithdrawing ? 0.6 : 1 }}
          >
            <Logo n={j.company} />
            <div style={{ flex: 3 }}>
              <b>{j.title}</b>
              <div className="m">
                {j.company} · {j.location} · {j.mode} · {sal(j)} · Applied{" "}
                {a.date}
              </div>
            </div>
            <StatusBadge s={a.status} />
            <a href={"#/job/" + j.id}>View Details</a>
            {up && a.status !== "Selected" && (
              <button
                className="btn o"
                style={{ flex: "0 0 auto", minWidth: 0 }}
                disabled={isWithdrawing}
                onClick={() => handleWithdraw(a)}
              >
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
