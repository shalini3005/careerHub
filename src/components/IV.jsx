import React, { useState } from "react";

export function IV({ a, pat }) {
  const [d, setD] = useState(a.iv || { date: "", time: "", mode: "Online" });
  return (
    <div className="row">
      <input
        type="date"
        value={d.date}
        onChange={(e) => setD({ ...d, date: e.target.value })}
      />
      <input
        type="time"
        value={d.time}
        onChange={(e) => setD({ ...d, time: e.target.value })}
      />
      <select
        value={d.mode}
        onChange={(e) => setD({ ...d, mode: e.target.value })}
      >
        {["Online", "On-site", "Phone"].map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <button
        className="btn"
        onClick={() =>
          d.date
            ? pat(a.id, { status: "Interview", iv: d })
            : alert("Pick a date")
        }
      >
        Schedule Interview
      </button>
    </div>
  );
}
