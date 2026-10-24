import React, { useState } from "react";
import { JobCard } from "../components/JobCard";

export function Jobs(P) {
  const { db } = P;
  const [q, setQ] = useState(
    decodeURIComponent(location.hash.split("?")[1] || ""),
  );
  const [loc, setLoc] = useState("");
  const [type, setT] = useState("");
  const [mode, setM] = useState("");
  const [exp, setX] = useState("");
  const [comp, setCo] = useState("");
  const [minSalary, setMinSalary] = useState(0);
  const [sort, setS] = useState("latest");
  const [pg, setPg] = useState(0);

  const expOptions = ["All", "Fresher", "1–3 years", "3–5 years", "5+ years"];
  const modeOptions = ["All", "Remote", "Hybrid", "On-site"];

  let L = db.jobs.filter(
    (j) =>
      j.status === "Active" &&
      (!q ||
        (j.title + j.company + j.skills + j.cat)
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (!loc || j.location.toLowerCase().includes(loc.toLowerCase())) &&
      (!type || j.type === type) &&
      (!mode || mode === "All" || j.mode === mode) &&
      (!exp || exp === "All" || j.exp === exp) &&
      (!comp || j.company === comp) &&
      (!minSalary || j.max >= minSalary),
  );

  // Sorting
  L = [...L].sort((a, b) => {
    if (sort === "salary_desc") return b.max - a.max;
    if (sort === "salary_asc") return a.min - b.min;
    if (sort === "title") return a.title.localeCompare(b.title);
    return b.posted.localeCompare(a.posted); // default: latest
  });

  const pages = Math.ceil(L.length / 6) || 1;

  const clearFilters = () => {
    setQ("");
    setLoc("");
    setT("");
    setM("");
    setX("");
    setCo("");
    setMinSalary(0);
    setS("latest");
    setPg(0);
  };

  const hasActiveFilters =
    q ||
    loc ||
    type ||
    (mode && mode !== "All") ||
    (exp && exp !== "All") ||
    comp ||
    minSalary > 0;

  return (
    <div>
      {/* Top Search & Filter Bar */}
      <div className="card" style={{ padding: "18px 20px", marginBottom: 16 }}>
        <div className="row" style={{ marginBottom: 12 }}>
          <input
            placeholder="Search job title, skills, or company (e.g. React, Zoho)..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPg(0);
            }}
            style={{ margin: 0, flex: 2 }}
          />
          <input
            placeholder="Location (e.g. Chennai, Remote)..."
            value={loc}
            onChange={(e) => {
              setLoc(e.target.value);
              setPg(0);
            }}
            style={{ margin: 0, flex: 1.2 }}
          />
          <select
            value={sort}
            onChange={(e) => setS(e.target.value)}
            style={{ margin: 0, flex: 1 }}
          >
            <option value="latest">Sort: Newest First</option>
            <option value="salary_desc">Salary: High to Low</option>
            <option value="salary_asc">Salary: Low to High</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Experience Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            margin: "10px 0",
          }}
        >
          <span className="m" style={{ fontWeight: 600, minWidth: 80 }}>
            Experience:
          </span>
          <div className="tabs" style={{ margin: 0 }}>
            {expOptions.map((opt) => (
              <button
                key={opt}
                className={exp === opt || (!exp && opt === "All") ? "on" : ""}
                onClick={() => {
                  setX(opt === "All" ? "" : opt);
                  setPg(0);
                }}
                style={{ padding: "4px 12px", fontSize: 12.5 }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Work Mode Chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            margin: "10px 0",
          }}
        >
          <span className="m" style={{ fontWeight: 600, minWidth: 80 }}>
            Work Mode:
          </span>
          <div className="tabs" style={{ margin: 0 }}>
            {modeOptions.map((opt) => (
              <button
                key={opt}
                className={mode === opt || (!mode && opt === "All") ? "on" : ""}
                onClick={() => {
                  setM(opt === "All" ? "" : opt);
                  setPg(0);
                }}
                style={{ padding: "4px 12px", fontSize: 12.5 }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Slider & Dropdowns */}
        <div className="row" style={{ alignItems: "center", marginTop: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flex: 1.5,
            }}
          >
            <span
              className="m"
              style={{ fontWeight: 600, whiteSpace: "nowrap" }}
            >
              Min Salary:{" "}
              <b style={{ color: "var(--p)" }}>
                {minSalary ? `₹${minSalary} LPA` : "Any"}
              </b>
            </span>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={minSalary}
              onChange={(e) => {
                setMinSalary(+e.target.value);
                setPg(0);
              }}
              style={{ margin: 0, accentColor: "var(--p)" }}
            />
          </div>

          <select
            value={type}
            onChange={(e) => {
              setT(e.target.value);
              setPg(0);
            }}
            style={{ margin: 0, flex: 1 }}
          >
            <option value="">All Job Types</option>
            {["Full Time", "Part Time", "Internship", "Contract"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>

          <select
            value={comp}
            onChange={(e) => {
              setCo(e.target.value);
              setPg(0);
            }}
            style={{ margin: 0, flex: 1 }}
          >
            <option value="">All Companies</option>
            {[...new Set(db.jobs.map((j) => j.company))].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              className="btn o"
              onClick={clearFilters}
              style={{ padding: "8px 14px", flex: "none" }}
            >
              ✕ Reset Filters
            </button>
          )}
        </div>
      </div>

      <div
        className="row"
        style={{ justifyContent: "space-between", marginBottom: 12 }}
      >
        <p className="m" style={{ margin: 0 }}>
          Showing <b>{L.length}</b> verified opportunities
        </p>
        <span className="m" style={{ fontSize: 12 }}>
          Page {pg + 1} of {pages}
        </span>
      </div>

      {/* Jobs Grid */}
      {P.apiLoading && !db.jobs.length ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "40px 20px" }}
        >
          <span style={{ fontSize: 36 }}>⏳</span>
          <h3>Loading jobs from API...</h3>
          <p className="m">Fetching the latest verified opportunities.</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {L.slice(pg * 6, pg * 6 + 6).map((j) => (
              <JobCard key={j.id} j={j} {...P} />
            ))}
          </div>

          {!L.length && (
            <div
              className="card"
              style={{ textAlign: "center", padding: "40px 20px" }}
            >
              <span style={{ fontSize: 36 }}>🔍</span>
              <h3>No jobs found matching your criteria</h3>
              <p className="m">
                Try broadening your search query or reset active filters.
              </p>
              <button className="btn" onClick={clearFilters}>
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div
          className="row"
          style={{ justifyContent: "center", marginTop: 24, gap: 12 }}
        >
          <button
            className="btn o"
            disabled={pg === 0}
            onClick={() => setPg(pg - 1)}
          >
            ‹ Previous
          </button>
          <span className="m" style={{ alignSelf: "center", fontWeight: 600 }}>
            {pg + 1} / {pages}
          </span>
          <button
            className="btn o"
            disabled={pg + 1 >= pages}
            onClick={() => setPg(pg + 1)}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
