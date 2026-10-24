import React, { useState } from "react";
import { Logo } from "./Logo";
import { sal, today } from "../utils/data";

export function JobCard({ j, db, up, go, me }) {
  const sv = db.saved.some((s) => s.uid === me?.id && String(s.jid) === String(j.id));
  return (
    <div className="card job">
      <div className="row" style={{ flexWrap: "nowrap" }}>
        <Logo n={j.company} />
        <div>
          <b>{j.title}</b>
          <div className="m">
            {j.company} · {j.location}
          </div>
        </div>
      </div>
      <div className="tags">
        <span className="tag">{j.type}</span>
        <span className="tag">{j.mode}</span>
        <span className="tag g">{sal(j)}</span>
      </div>
      <div className="skills">
        {(j.skills || "").split(",").map((x) => (
          <span key={x}>{x.trim()}</span>
        ))}
      </div>
      <div className="row">
        <a className="btn" href={"#/job/" + j.id}>
          View Details
        </a>
        {(!me || me.role === "Candidate") && (
          <button
            className="btn o"
            onClick={() =>
              !me
                ? go("/login")
                : up((d) => ({
                    ...d,
                    saved: sv
                      ? d.saved.filter(
                          (s) => !(s.uid === me.id && String(s.jid) === String(j.id)),
                        )
                      : [...d.saved, { uid: me.id, jid: j.id, date: today() }],
                  }))
            }
          >
            {sv ? "★ Saved" : "☆ Save"}
          </button>
        )}
      </div>
    </div>
  );
}
