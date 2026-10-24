import React, { useState } from "react";
import { AppList } from "../components/AppList";
import { JobCard } from "../components/JobCard";
import { SummaryCard } from "../components/SummaryCard";

export function CDash(P) {
  const { db, me } = P;
  const mine = db.apps.filter((a) => String(a.uid) === String(me.id));

  // Dynamically calculate profile completion based on user-provided profile fields
  const prof = me.profile || {};
  const profileFields = [
    prof.phone,
    prof.loc,
    prof.skills,
    prof.exp,
    prof.edu,
    prof.work,
    prof.resume,
    prof.notice,
    prof.salary,
  ];
  const filledCount = profileFields.filter(
    (v) => v && String(v).trim().length > 0,
  ).length;
  const completionPct = Math.round((filledCount / profileFields.length) * 100);

  return (
    <div>
      <h2>Hello, {me.name}</h2>
      <SummaryCard
        items={[
          ["Total Applications", mine.length],
          [
            "Saved Jobs",
            db.saved.filter((s) => String(s.uid) === String(me.id)).length,
          ],
          ["Interviews", mine.filter((a) => a.status === "Interview").length],
          ["Selected", mine.filter((a) => a.status === "Selected").length],
        ]}
      />

      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <b>
            Profile Completion: {completionPct}%
            {completionPct === 0 && (
              <span
                style={{
                  fontWeight: 400,
                  fontSize: 13,
                  color: "var(--muted)",
                  marginLeft: 8,
                }}
              >
                (No details added yet)
              </span>
            )}
          </b>
          <a
            href="#/profile"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--p)",
              textDecoration: "none",
            }}
          >
            {completionPct === 100 ? "Edit Profile ✏️" : "Complete Profile →"}
          </a>
        </div>

        <div
          style={{
            background: "var(--border)",
            borderRadius: 999,
            height: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background:
                completionPct === 100
                  ? "var(--p)"
                  : completionPct >= 50
                    ? "#3b82f6"
                    : "#f59e0b",
              width: `${Math.max(completionPct, 4)}%`,
              height: "100%",
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {completionPct < 100 && (
          <p className="m" style={{ fontSize: 12.5, margin: "8px 0 0" }}>
            Add your contact number, city, skills, experience, and resume to enable 1-click job applications.
          </p>
        )}
      </div>

      <h3>Recent Applications</h3>
      <AppList {...P} list={mine.slice(-3)} />

      <h3>Recommended Jobs</h3>
      <div className="grid">
        {db.jobs
          .filter((j) => j.status === "Active")
          .slice(0, 3)
          .map((j) => (
            <JobCard key={j.id} j={j} {...P} />
          ))}
      </div>
    </div>
  );
}
