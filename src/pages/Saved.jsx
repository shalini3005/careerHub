import React, { useState } from "react";
import { JobCard } from "../components/JobCard";

export function Saved(P) {
  const { db, me } = P;
  const [q, setQ] = useState("");
  const [t, setT] = useState("All Saved");
  const [typ, setTy] = useState("");
  const [lc, setLc] = useState("");
  const [mode, setM] = useState("");
  const ap = (j) => db.apps.some((a) => a.uid === me.id && String(a.jid) === String(j.id));
  let sv = db.saved.filter((x) => x.uid === me.id);
  if (t === "Recently Saved")
    sv = [...sv].sort((a, b) => b.date.localeCompare(a.date));
  const L = sv
    .map((x) => db.jobs.find((j) => String(j.id) === String(x.jid)))
    .filter(
      (j) =>
        j &&
        (!q || (j.title + j.company).toLowerCase().includes(q.toLowerCase())) &&
        (!mode || j.mode === mode) &&
        (!typ || j.type === typ) &&
        (!lc || j.location.toLowerCase().includes(lc.toLowerCase())) &&
        (t === "Applied" ? ap(j) : t === "Not Applied" ? !ap(j) : true),
    );
  return (
    <div>
      <h2>Saved Jobs</h2>
      <div className="tabs">
        {["All Saved", "Recently Saved", "Applied", "Not Applied"].map((x) => (
          <button
            key={x}
            className={t === x ? "on" : ""}
            onClick={() => setT(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="row">
        <input
          placeholder="Search saved jobs"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={mode} onChange={(e) => setM(e.target.value)}>
          <option value="">Work mode</option>
          {["Remote", "Hybrid", "On-site"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select value={typ} onChange={(e) => setTy(e.target.value)}>
          <option value="">Job type</option>
          {["Full Time", "Part Time", "Internship", "Contract"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <input
          placeholder="Location"
          value={lc}
          onChange={(e) => setLc(e.target.value)}
        />
      </div>
      {!L.length && <p className="m">No saved jobs.</p>}
      <div className="grid">
        {L.map((j) => (
          <JobCard key={j.id} j={j} {...P} />
        ))}
      </div>
    </div>
  );
}
