import React, { useState, useRef } from "react";
import { sendEmail } from "../utils/email";
import { IV } from "../components/IV";
import { StatusBadge } from "../components/StatusBadge";
import { ST, sal } from "../utils/data";
import { patchApplication, isApiConfigured } from "../services/api";

export function Applicants({ db, up, me, id, toast }) {
  const [t, setT] = useState("All");
  const [q, setQ] = useState("");
  const [viewMode, setViewMode] = useState("pipeline"); // 'pipeline' | 'table'
  const [sel, setSel] = useState(null);
  const [updating, setUpdating] = useState(false);
  const detailRef = useRef(null);

  const openReview = (appId) => {
    setSel(appId);
    // Scroll to detail panel after state update
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const job = db.jobs.find((j) => String(j.id) === String(id));
  const all = db.apps.filter(
    (a) =>
      String(a.rid) === String(me.id) &&
      (!id || String(a.jid) === String(id)),
  );
  const L = all.filter(
    (a) =>
      (t === "All" || a.status === t) &&
      (a.name + a.email + (a.skills || ""))
        .toLowerCase()
        .includes(q.toLowerCase()),
  );

  // Export filtered applicants to CSV
  const exportCSV = () => {
    if (!L.length) {
      if (toast)
        toast({ message: "No applicants found to export.", type: "info" });
      return;
    }

    const headers = [
      "Applicant Name",
      "Email",
      "Phone",
      "Job Title",
      "Status",
      "Experience",
      "Expected Salary",
      "Notice Period",
      "Location",
      "Skills",
      "Applied Date",
      "Notes",
    ];
    const rows = L.map((a) => {
      const jb = db.jobs.find((j) => String(j.id) === String(a.jid));
      return [
        `"${(a.name || "").replace(/"/g, '""')}"`,
        `"${(a.email || "").replace(/"/g, '""')}"`,
        `"${(a.phone || "").replace(/"/g, '""')}"`,
        `"${(jb?.title || "").replace(/"/g, '""')}"`,
        `"${(a.status || "").replace(/"/g, '""')}"`,
        `"${(a.exp || "").replace(/"/g, '""')}"`,
        `"${(a.salary || "").replace(/"/g, '""')}"`,
        `"${(a.notice || "").replace(/"/g, '""')}"`,
        `"${(a.loc || "").replace(/"/g, '""')}"`,
        `"${(a.skills || "").replace(/"/g, '""')}"`,
        `"${(a.date || "").replace(/"/g, '""')}"`,
        `"${(a.notes || "").replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `applicants_${job ? job.title.toLowerCase().replace(/\s+/g, "_") : "all"}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (toast)
      toast({
        message: `Exported ${L.length} applicants to CSV.`,
        type: "success",
      });
  };

  const notify = async (aid, status, extra) => {
    const ap = db.apps.find((x) => String(x.id) === String(aid));
    const jb = db.jobs.find((x) => String(x.id) === String(ap?.jid));
    if (!ap) return;

    setUpdating(true);

    // Create in-app notification for candidate
    const candidateNotif = {
      id: "n_u_" + Date.now(),
      recipientId: ap.uid,
      title: extra
        ? "Interview Scheduled 📅"
        : `Application Status: ${status} 📋`,
      message: `Your application for ${jb?.title || "job"} is now ${status}.${extra || ""}`,
      type: extra ? "interview" : "status",
      link: "#/apps",
      read: false,
      createdAt: new Date().toISOString(),
    };

    up((d) => ({
      ...d,
      notifications: [...(d.notifications || []), candidateNotif],
    }));

    try {
      const r = await sendEmail({
        to_email: ap.email,
        to_name: ap.name,
        subject: "Application update: " + (jb?.title || "your application"),
        message:
          "Hi " +
          ap.name +
          ", your application for " +
          jb?.title +
          " at " +
          jb?.company +
          " is now: " +
          status +
          "." +
          (extra || ""),
      });
      setUpdating(false);
      if (toast) {
        if (r.ok)
          toast({
            message: `Status updated to "${status}" & email sent to ${ap.email}`,
            type: "email",
          });
        else
          toast({
            message: `Status updated to "${status}". Email notice: ${r.reason}`,
            type: "info",
          });
      }
    } catch (err) {
      setUpdating(false);
      if (toast)
        toast({ message: `Status updated to "${status}".`, type: "info" });
    }
  };

  const setStatus = async (aid, status) => {
    setUpdating(true);
    // Always update local state immediately
    up((d) => ({
      ...d,
      apps: d.apps.map((a) =>
        String(a.id) === String(aid) ? { ...a, status } : a,
      ),
    }));
    // Try to sync to API if configured
    if (isApiConfigured()) {
      try {
        await patchApplication(aid, { status });
      } catch (err) {
        console.warn("API sync failed (local state updated):", err.message);
      }
    }
    await notify(aid, status);
  };

  const pat = async (aid, pt) => {
    setUpdating(true);
    // Always update local state immediately
    up((d) => ({
      ...d,
      apps: d.apps.map((x) =>
        String(x.id) === String(aid) ? { ...x, ...pt } : x,
      ),
    }));
    // Try to sync to API if configured
    if (isApiConfigured()) {
      try {
        await patchApplication(aid, pt);
      } catch (err) {
        console.warn("API sync failed (local state updated):", err.message);
      }
    }
    if (pt.status) {
      await notify(
        aid,
        pt.status,
        pt.iv ? ` Interview: ${pt.iv.date} ${pt.iv.time} (${pt.iv.mode}).` : "",
      );
    } else {
      setUpdating(false);
    }
  };

  const a = db.apps.find((x) => String(x.id) === String(sel));

  return (
    <div>
      <div
        className="row"
        style={{ justifyContent: "space-between", marginBottom: 14 }}
      >
        <div>
          <h2>Applicants {job ? ` — ${job.title}` : ""}</h2>
          {job && (
            <p className="m" style={{ margin: 0 }}>
              {job.company} · {job.location} · {sal(job)} · {all.length} total
              applicants · <StatusBadge s={job.status} />
            </p>
          )}
        </div>
        <div className="row" style={{ flex: "none", gap: 8 }}>
          <button
            className="btn o"
            onClick={exportCSV}
            title="Download applicants spreadsheet"
          >
            📥 Export CSV
          </button>
          <div className="tabs" style={{ margin: 0 }}>
            <button
              className={viewMode === "pipeline" ? "on" : ""}
              onClick={() => setViewMode("pipeline")}
            >
              📊 Pipeline View
            </button>
            <button
              className={viewMode === "table" ? "on" : ""}
              onClick={() => setViewMode("table")}
            >
              📋 Table View
            </button>
          </div>
        </div>
      </div>

      {job && (
        <div
          className="row"
          style={{ justifyContent: "flex-start", marginBottom: 16 }}
        >
          <a
            className="btn o"
            style={{ flex: "none" }}
            href={"#/post/" + job.id}
          >
            Edit Job
          </a>
          <a
            className="btn o"
            style={{ flex: "none" }}
            href={"#/job/" + job.id}
          >
            View Job Posting
          </a>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="card row"
        style={{ alignItems: "center", marginBottom: 14 }}
      >
        <input
          placeholder="Search applicants by name, email, or skills..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ margin: 0 }}
        />
        {viewMode === "table" && (
          <div className="tabs" style={{ margin: 0 }}>
            {["All", ...ST].map((x) => (
              <button
                key={x}
                className={t === x ? "on" : ""}
                onClick={() => setT(x)}
              >
                {x}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PIPELINE / KANBAN BOARD VIEW */}
      {viewMode === "pipeline" ? (
        <div className="kanban-board">
          {ST.map((statusCol) => {
            const colApps = L.filter((x) => x.status === statusCol);
            return (
              <div key={statusCol} className="kanban-col">
                <div className="kanban-col-head">
                  <span>{statusCol}</span>
                  <span className="kanban-count">{colApps.length}</span>
                </div>
                <div className="kanban-cards">
                  {colApps.length === 0 ? (
                    <p
                      className="m"
                      style={{
                        fontSize: 12,
                        textAlign: "center",
                        margin: "20px 0",
                      }}
                    >
                      No candidates
                    </p>
                  ) : (
                    colApps.map((app) => {
                      const jb = db.jobs.find((j) => String(j.id) === String(app.jid));
                      return (
                        <div
                          key={app.id}
                          className="kanban-card"
                          style={{ cursor: "pointer" }}
                          onClick={() => openReview(app.id)}
                        >
                          <h4>{app.name}</h4>
                          <div className="kanban-card-meta">
                            <div>💼 {jb?.title || "Job"}</div>
                            <div>
                              ⏳ {app.exp || "Fresher"} ·{" "}
                              {app.notice || "Immediate"}
                            </div>
                          </div>
                          {app.skills && (
                            <div className="kanban-card-skills">
                              {app.skills
                                .split(",")
                                .slice(0, 3)
                                .map((s, idx) => (
                                  <span key={idx}>{s.trim()}</span>
                                ))}
                            </div>
                          )}
                          <div
                            style={{
                              marginTop: 8,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ fontSize: 11, color: "var(--m)" }}>
                              {app.date}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--p)",
                                fontWeight: 600,
                              }}
                            >
                              Review ➔
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="card ov">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Email</th>
                <th>Applied Date</th>
                <th>Experience</th>
                <th>Skills</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {L.map((x) => (
                <tr key={x.id}>
                  <td>
                    <b>{x.name}</b>
                  </td>
                  <td>{x.email}</td>
                  <td>{x.date}</td>
                  <td>{x.exp || "—"}</td>
                  <td>{x.skills || "—"}</td>
                  <td>
                    <StatusBadge s={x.status} />
                  </td>
                  <td>
                    <button
                      className="btn o"
                      style={{ padding: "4px 10px", fontSize: 12 }}
                      onClick={() => setSel(x.id)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!L.length && (
            <p className="m" style={{ textAlign: "center", padding: 20 }}>
              No matching applicants found.
            </p>
          )}
        </div>
      )}

      {/* APPLICANT DETAIL / REVIEW MODAL CARD */}
      {a && (
        <div
          ref={detailRef}
          className="card"
          style={{ marginTop: 20, border: "2px solid var(--p)" }}
        >
          <div
            className="row"
            style={{
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h3>Candidate Details: {a.name}</h3>
              <p className="m">
                📧 {a.email} · 📞 {a.phone || "—"} · 📍 {a.loc || "—"}
                <br />
                <b>Experience:</b> {a.exp || "—"} · <b>Notice Period:</b>{" "}
                {a.notice || "—"} · <b>Expected Salary:</b> {a.salary || "—"}
                <br />
                <b>Skills:</b> {a.skills || "—"}
                <br />
                <b>Education:</b> {a.edu || "—"}
                <br />
                <b>Work History:</b> {a.work || "—"}
              </p>
              {a.cover && (
                <p style={{ fontSize: 13 }}>
                  <b>Cover Letter:</b> {a.cover}
                </p>
              )}
            </div>
            <div style={{ flex: "none", textAlign: "right" }}>
              <button className="btn o" onClick={() => setSel(null)}>
                ✕ Close
              </button>
              {a.resumeData && (
                <div style={{ marginTop: 8 }}>
                  <a className="btn" download={a.resume} href={a.resumeData}>
                    📄 Download Resume
                  </a>
                </div>
              )}
            </div>
          </div>

          <h4 style={{ marginTop: 18 }}>Advance Candidate Stage:</h4>
          <div className="tabs">
            {ST.filter((s) => s !== "Interview").map((s) => (
              <button
                key={s}
                className={a.status === s ? "on" : ""}
                disabled={updating}
                onClick={() => setStatus(a.id, s)}
              >
                {a.status === s ? `✓ ${s}` : s}
              </button>
            ))}
          </div>

          <IV key={a.id} a={a} pat={pat} />

          <div style={{ marginTop: 14 }}>
            <label className="m" style={{ fontWeight: 600 }}>
              Internal Recruiter Notes
            </label>
            <textarea
              key={"n" + a.id}
              rows="2"
              placeholder="Add private evaluation notes..."
              defaultValue={a.notes || ""}
              onBlur={(e) => {
                pat(a.id, { notes: e.target.value });
                if (toast) toast({ message: "Notes saved.", type: "info" });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
