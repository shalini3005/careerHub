import React, { useState } from "react";
import { Logo } from "../components/Logo";

export function Companies({ db, go }) {
  const m = {};
  db.jobs
    .filter((j) => j.status === "Active")
    .forEach((j) => {
      (m[j.company] = m[j.company] || []).push(j);
    });
  return (
    <div>
      <h2>Companies hiring</h2>
      <div className="grid">
        {Object.entries(m).map(([c, js]) => (
          <div className="card" key={c}>
            <div className="row" style={{ flexWrap: "nowrap" }}>
              <Logo n={c} />
              <div>
                <b>{c}</b>
                <div className="m">{js[0].location}</div>
              </div>
            </div>
            <p className="m">
              {js.length} open role{js.length > 1 ? "s" : ""}:{" "}
              {js.map((j) => j.title).join(", ")}
            </p>
            <a className="btn o" href={"#/jobs?" + encodeURIComponent(c)}>
              View Jobs
            </a>{" "}
            <a href={"#/company/" + encodeURIComponent(c)}>Company Profile</a>
          </div>
        ))}
      </div>
    </div>
  );
}
