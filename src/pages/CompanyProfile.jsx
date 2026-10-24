import React, { useState } from "react";
import { JobCard } from "../components/JobCard";
import { Logo } from "../components/Logo";

export function CompanyProfile({ db, id, ...P }) {
  const c = decodeURIComponent(id || "");
  const js = db.jobs.filter((j) => j.company === c && j.status === "Active");
  return (
    <div>
      <div className="card row" style={{ flexWrap: "nowrap" }}>
        <Logo n={c || "?"} />
        <div>
          <h2 style={{ margin: 0 }}>{c}</h2>
          <div className="m">
            {js[0]?.location} · {js.length} open roles
          </div>
        </div>
      </div>
      <div className="card">
        <h4>About</h4>
        <p>
          {c} is a growing company hiring across engineering, design and data.
          Company size: 50–500 employees.
        </p>
      </div>
      <h3>Open Positions</h3>
      <div className="grid">
        {js.map((j) => (
          <JobCard key={j.id} j={j} db={db} {...P} />
        ))}
      </div>
    </div>
  );
}
