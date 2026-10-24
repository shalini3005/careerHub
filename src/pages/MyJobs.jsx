import React, { useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { patchJob, deleteJob, isApiConfigured } from "../services/api";

export function MyJobs({ db, up, me, toast }) {
  const [t, setT] = useState("All");
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState(null);

  const L = db.jobs.filter(
    (j) =>
      String(j.rid) === String(me.id) &&
      (t === "All" || j.status === t) &&
      j.title.toLowerCase().includes(q.toLowerCase()),
  );

  const setJobStatus = async (id, status) => {
    if (busyId) return;
    setBusyId(id);
    // Update local state immediately
    up((d) => ({
      ...d,
      jobs: d.jobs.map((j) => (String(j.id) === String(id) ? { ...j, status } : j)),
    }));
    if (isApiConfigured()) {
      try { await patchJob(id, { status }); } catch (e) { console.warn("API sync:", e.message); }
    }
    if (toast) toast({ message: `Job marked as ${status}.`, type: "info" });
    setBusyId(null);
  };

  const remove = async (j) => {
    if (busyId) return;
    if (!confirm(`Are you sure you want to delete "${j.title}"?`)) return;
    setBusyId(j.id);
    // Update local state immediately
    up((d) => ({
      ...d,
      jobs: d.jobs.filter((x) => String(x.id) !== String(j.id)),
    }));
    if (isApiConfigured()) {
      try { await deleteJob(j.id); } catch (e) { console.warn("API sync:", e.message); }
    }
    if (toast) toast({ message: `Job "${j.title}" deleted successfully.`, type: "info" });
    setBusyId(null);
  };

  return (
    <div>
      <div className="row">
        <h2>My Jobs</h2>
        <a className="btn" style={{ flex: 0 }} href="#/post">
          + Post New Job
        </a>
      </div>
      <div className="tabs">
        {["All", "Active", "Closed", "Draft"].map((x) => (
          <button
            key={x}
            className={t === x ? "on" : ""}
            onClick={() => setT(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <input
        placeholder="Search by title"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="card ov">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Applicants</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {L.map((j) => {
              const applicantCount = db.apps.filter(
                (a) => String(a.jid) === String(j.id),
              ).length;
              const isBusy = busyId === j.id;

              return (
                <tr key={j.id} style={{ opacity: isBusy ? 0.6 : 1 }}>
                  <td>
                    <b>{j.title}</b>
                  </td>
                  <td>{j.location}</td>
                  <td>{j.type}</td>
                  <td>
                    <a href={"#/applicants/" + j.id}>{applicantCount}</a>
                  </td>
                  <td>
                    <StatusBadge s={j.status} />
                  </td>
                  <td>
                    <a href={"#/job/" + j.id}>View</a> ·{" "}
                    <a href={"#/post/" + j.id}>Edit</a> ·{" "}
                    <a href={"#/applicants/" + j.id}>Applicants</a>
                    {j.status === "Active" ? (
                      <>
                        {" "}
                        ·{" "}
                        <button
                          className="btn-link"
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--p)",
                            cursor: "pointer",
                            padding: 0,
                            font: "inherit",
                          }}
                          disabled={isBusy}
                          onClick={() => setJobStatus(j.id, "Closed")}
                        >
                          Close
                        </button>
                      </>
                    ) : (
                      <>
                        {" "}
                        ·{" "}
                        <button
                          className="btn-link"
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--p)",
                            cursor: "pointer",
                            padding: 0,
                            font: "inherit",
                          }}
                          disabled={isBusy}
                          onClick={() => setJobStatus(j.id, "Active")}
                        >
                          Activate
                        </button>
                      </>
                    )}
                    {" "}
                    ·{" "}
                    <button
                      className="btn-link"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        padding: 0,
                        font: "inherit",
                      }}
                      disabled={isBusy}
                      onClick={() => remove(j)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!L.length && (
          <p className="m" style={{ textAlign: "center", padding: 20 }}>
            No jobs found.
          </p>
        )}
      </div>
    </div>
  );
}
