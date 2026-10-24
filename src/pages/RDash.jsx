import React from "react";
import { StatusBadge } from "../components/StatusBadge";
import { SummaryCard } from "../components/SummaryCard";
import { Upcoming } from "../components/Upcoming";
import { ST } from "../utils/data";

export function RDash(P) {
  const { db, me } = P;
  const jobs = db.jobs.filter((j) => String(j.rid) === String(me.id));
  const apps = db.apps.filter((a) => String(a.rid) === String(me.id));
  const nm = (a) =>
    a.name || db.users.find((u) => String(u.id) === String(a.uid))?.name || "Candidate";

  const totalApps = apps.length || 1; // prevent divide by zero
  const shortlistedCount = apps.filter(
    (a) => a.status === "Shortlisted",
  ).length;
  const interviewCount = apps.filter((a) => a.status === "Interview").length;
  const selectedCount = apps.filter((a) => a.status === "Selected").length;
  const conversionRate = apps.length
    ? ((selectedCount / apps.length) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <div
        className="row"
        style={{ justifyContent: "space-between", marginBottom: 14 }}
      >
        <div>
          <h2>Recruiter Portal: Welcome back, {me.name}</h2>
          <p className="m" style={{ margin: 0 }}>
            Overview of your talent pipeline and active recruitments
          </p>
        </div>
        <div className="row" style={{ flex: "none", gap: 10 }}>
          <a className="btn" href="#/post">
            ➕ Post New Job
          </a>
          <a className="btn o" href="#/applicants">
            👥 All Applicants
          </a>
        </div>
      </div>

      <SummaryCard
        items={[
          ["Active Jobs", jobs.filter((j) => j.status === "Active").length],
          ["Total Applications", apps.length],
          ["Interviews Scheduled", interviewCount],
          ["Hired / Selected", `${selectedCount} (${conversionRate}%)`],
        ]}
      />

      {/* Recruiter Hiring Funnel Analytics */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h3>📊 Recruitment Funnel Analytics</h3>
          <span className="badge s-Active" style={{ fontSize: 13 }}>
            Conversion: {conversionRate}%
          </span>
        </div>
        <p className="m">
          Visual progression of candidates through your hiring stages
        </p>

        <div className="funnel-container">
          {[
            { label: "Applications", count: apps.length, color: "#3b82f6" },
            {
              label: "Under Review",
              count: apps.filter((a) => a.status === "Under Review").length,
              color: "#6366f1",
            },
            { label: "Shortlisted", count: shortlistedCount, color: "#8b5cf6" },
            { label: "Interviews", count: interviewCount, color: "#f59e0b" },
            {
              label: "Selected / Hired",
              count: selectedCount,
              color: "#10b981",
            },
          ].map((stage) => {
            const pct = apps.length
              ? Math.round((stage.count / totalApps) * 100)
              : 0;
            return (
              <div key={stage.label} className="funnel-row">
                <span className="funnel-label">{stage.label}</span>
                <div className="funnel-bar-bg">
                  <div
                    className="funnel-bar-fill"
                    style={{
                      width: `${Math.max(pct, stage.count > 0 ? 8 : 0)}%`,
                      background: stage.color,
                    }}
                  >
                    {stage.count}
                  </div>
                </div>
                <span className="funnel-percent">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-Job Performance Breakdown */}
      <div className="card">
        <h3>💼 Active Jobs Performance</h3>
        <div className="ov">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Mode</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => {
                const jApps = apps.filter((a) => a.jid === j.id);
                return (
                  <tr key={j.id}>
                    <td>
                      <b>{j.title}</b>
                    </td>
                    <td>{j.location}</td>
                    <td>{j.mode}</td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: "#e0f2fe", color: "#0369a1" }}
                      >
                        {jApps.length} candidates
                      </span>
                    </td>
                    <td>
                      <StatusBadge s={j.status} />
                    </td>
                    <td>
                      <a
                        className="btn o"
                        style={{ padding: "4px 10px", fontSize: 12 }}
                        href={`#/applicants/${j.id}`}
                      >
                        View Candidates
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!jobs.length && (
            <p className="m">You haven't posted any jobs yet.</p>
          )}
        </div>
      </div>

      <Upcoming db={db} list={apps} />

      {/* Recent Candidates */}
      <h3>Recent Applicants</h3>
      {apps
        .slice(-4)
        .reverse()
        .map((a) => (
          <div className="card row" key={a.id} style={{ alignItems: "center" }}>
            <div>
              <b>{nm(a)}</b>
              <p className="m" style={{ margin: "2px 0 0", fontSize: 12 }}>
                {a.email} · Applied on {a.date}
              </p>
            </div>
            <span>{db.jobs.find((j) => String(j.id) === String(a.jid))?.title}</span>
            <StatusBadge s={a.status} />
            <a
              className="btn o"
              style={{ flex: "none", padding: "6px 14px", fontSize: 12.5 }}
              href={`#/applicants/${a.jid}`}
            >
              Review
            </a>
          </div>
        ))}
      {!apps.length && <p className="m">No applications received yet.</p>}
    </div>
  );
}
