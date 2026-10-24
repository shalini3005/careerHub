import React, { useState } from "react";
import { JobCard } from "../components/JobCard";
import { Logo } from "../components/Logo";

export function Home(P) {
  const act = P.db.jobs.filter((j) => j.status === "Active");
  const [q, setQ] = useState("");
  const cos = [...new Set(act.map((j) => j.company))].slice(0, 5);
  return (
    <div>
      <div className="hero2">
        <div>
          <span className="pill">🚀 New roles added daily</span>
          <h1>
            Find Your <em>Dream Job</em>
          </h1>
          <p>
            Search thousands of opportunities from top companies and take the
            next step in your career.
          </p>
          <div className="search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="🔍 Job title, skill or company"
            />
            <button
              className="btn"
              onClick={() => P.go("/jobs?" + encodeURIComponent(q))}
            >
              Search Jobs
            </button>
          </div>
        </div>
        <svg viewBox="0 0 300 220" width="100%">
          <rect x="40" y="40" width="220" height="150" rx="16" fill="#fff" />
          <rect
            x="40"
            y="40"
            width="220"
            height="150"
            rx="16"
            fill="#2f6fdb"
            opacity=".92"
          />
          <rect x="58" y="60" width="90" height="12" rx="6" fill="#fff" />
          <rect
            x="58"
            y="82"
            width="140"
            height="8"
            rx="4"
            fill="#fff"
            opacity=".6"
          />
          <rect
            x="58"
            y="110"
            width="184"
            height="58"
            rx="10"
            fill="#fff"
            opacity=".2"
          />
          <circle cx="82" cy="139" r="14" fill="#fff" />
          <rect x="106" y="130" width="90" height="8" rx="4" fill="#fff" />
          <rect
            x="106"
            y="146"
            width="60"
            height="6"
            rx="3"
            fill="#fff"
            opacity=".6"
          />
          <rect x="190" y="12" width="96" height="40" rx="12" fill="#1d4ed8" />
          <text
            x="238"
            y="38"
            fill="#fff"
            font-size="14"
            font-weight="700"
            text-anchor="middle"
          >
            Hired! 🎉
          </text>
        </svg>
      </div>
      <div className="row" style={{ alignItems: "baseline" }}>
        <h3 style={{ flex: 3 }}>Featured Jobs</h3>
        <a href="#/jobs" style={{ flex: 1, textAlign: "right" }}>
          View All Jobs →
        </a>
      </div>
      <div className="grid">
        {act.slice(0, 4).map((j) => (
          <JobCard key={j.id} j={j} {...P} />
        ))}
      </div>
      <div className="hero2 tc">
        <div>
          <h3 style={{ margin: "0 0 12px" }}>Top Companies</h3>
          <b className="m">Popular Categories</b>
          <div className="tabs" style={{ marginTop: 8 }}>
            {[
              "Frontend",
              "Backend",
              "UI/UX",
              "Testing",
              "Marketing",
              "Data",
            ].map((c) => (
              <button key={c} onClick={() => P.go("/jobs?" + c)}>
                {c}
              </button>
            ))}
          </div>
          <b className="m">Companies hiring now</b>
          <div className="cos">
            {cos.map((c) => (
              <a
                key={c}
                href={"#/jobs?" + encodeURIComponent(c)}
                className="co"
              >
                <Logo n={c} />
                <span>{c}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <h3>How It Works</h3>
      <div className="grid">
        {[
          ["🔎", "Search Jobs", "Find roles by skill, company or location."],
          ["📨", "Apply Easily", "A quick 3-step application form."],
          ["📊", "Track Application", "See every status update live."],
        ].map((x) => (
          <div className="card step" key={x[1]}>
            <div className="ic">{x[0]}</div>
            <b>{x[1]}</b>
            <p className="m">{x[2]}</p>
          </div>
        ))}
      </div>
      <div className="cta">
        <h2>Ready to Start Your Career Journey?</h2>
        <div className="row" style={{ justifyContent: "center" }}>
          <a className="btn w" style={{ flex: "0 1 auto" }} href="#/jobs">
            Browse Jobs
          </a>
          {!P.me ? (
            <a
              className="btn gl"
              style={{ flex: "0 1 auto" }}
              href="#/register"
            >
              Create Account
            </a>
          ) : (
            <a
              className="btn gl"
              style={{ flex: "0 1 auto" }}
              href={P.me.role === "Candidate" ? "#/cdash" : "#/rdash"}
            >
              Go to Dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
