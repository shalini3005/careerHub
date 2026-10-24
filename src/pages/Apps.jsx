import React, { useState } from "react";
import { AppList } from "../components/AppList";
import { Upcoming } from "../components/Upcoming";
import { ST } from "../utils/data";

export function Apps(P) {
  const [t, setT] = useState("All");
  const [q, setQ] = useState("");
  const mine = P.db.apps.filter((a) => String(a.uid) === String(P.me.id));
  const L = mine.filter((a) => {
    const j = P.db.jobs.find((x) => String(x.id) === String(a.jid));
    if (!j) return t === "All" || a.status === t;
    return (
      (t === "All" || a.status === t) &&
      (!q ||
        (j.title + j.company + j.location)
          .toLowerCase()
          .includes(q.toLowerCase()))
    );
  });
  return (
    <div>
      <h2>My Applications</h2>
      <div className="tabs">
        {["All", ...ST].map((x) => (
          <button
            key={x}
            className={t === x ? "on" : ""}
            onClick={() => setT(x)}
          >
            {x} (
            {x === "All"
              ? mine.length
              : mine.filter((a) => a.status === x).length}
            )
          </button>
        ))}
      </div>
      <Upcoming db={P.db} list={mine} />
      <input
        placeholder="Search title, company, location"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <AppList {...P} list={L} />
    </div>
  );
}
