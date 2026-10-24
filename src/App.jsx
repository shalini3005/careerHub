import React, { useState, useEffect } from "react";
import { Footer } from "./components/Footer";
import { ToastContainer } from "./components/Toast";
import { Notifications } from "./components/Notifications";
import { About } from "./pages/About";
import { Applicants } from "./pages/Applicants";
import { Apply } from "./pages/Apply";
import { Apps } from "./pages/Apps";
import { Auth } from "./pages/Auth";
import { CDash } from "./pages/CDash";
import { Companies } from "./pages/Companies";
import { Contact } from "./pages/Contact";
import { CompanyProfile } from "./pages/CompanyProfile";
import { Detail } from "./pages/Detail";
import { Home } from "./pages/Home";
import { Jobs } from "./pages/Jobs";
import { MyJobs } from "./pages/MyJobs";
import { Post } from "./pages/Post";
import { Profile } from "./pages/Profile";
import { RDash } from "./pages/RDash";
import { Saved } from "./pages/Saved";
import { load, saveLocal, seed } from "./utils/data";
import { getJobs, getApplications, isApiConfigured } from "./services/api";

export default function App() {
  const [db, setDb] = useState(load);
  const [open, setOpen] = useState(false);
  const [h, setH] = useState(location.hash.slice(1) || "/");
  const [toasts, setToasts] = useState([]);
  const [apiLoading, setApiLoading] = useState(isApiConfigured());
  const [apiError, setApiError] = useState(null);
  const [apiConfigured, setApiConfigured] = useState(isApiConfigured());

  // Load jobs and applications asynchronously from MockAPI
  const loadApiData = async () => {
    if (!isApiConfigured()) {
      setApiConfigured(false);
      setApiLoading(false);
      setDb((prev) => ({
        ...prev,
        jobs: prev.jobs && prev.jobs.length > 0 ? prev.jobs : seed.jobs,
        apps: prev.apps && prev.apps.length > 0 ? prev.apps : seed.apps,
      }));
      return;
    }
    setApiConfigured(true);
    setApiLoading(true);
    setApiError(null);

    try {
      const [jobsData, appsData] = await Promise.all([
        getJobs(),
        getApplications(),
      ]);

      setDb((prev) => ({
        ...prev,
        jobs:
          Array.isArray(jobsData) && jobsData.length > 0
            ? jobsData
            : prev.jobs && prev.jobs.length > 0
              ? prev.jobs
              : seed.jobs,
        apps:
          Array.isArray(appsData) && appsData.length > 0
            ? appsData
            : prev.apps && prev.apps.length > 0
              ? prev.apps
              : seed.apps,
      }));
    } catch (err) {
      console.error("Failed to load MockAPI data:", err);
      setApiError(
        err.message || "Failed to load jobs and applications from MockAPI"
      );
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    loadApiData();
  }, []);

  useEffect(() => {
    const f = () => {
      setH(location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);

  // Update local-only state to localStorage, while keeping in-memory React state unified
  const up = (f) =>
    setDb((d) => {
      const n = f({ ...d });
      saveLocal(n);
      return n;
    });

  const go = (p) => {
    location.hash = p;
  };
  const [, pg, id] = h.split("?")[0].split("/");
  const me = db.me;

  const toast = ({ message, title, type = "info" }) => {
    const tid = "t_" + Date.now() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id: tid, message, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== tid));
    }, 4000);
  };

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const P = {
    db,
    up,
    go,
    me,
    id,
    toast,
    apiLoading,
    apiError,
    apiConfigured,
    refreshData: loadApiData,
  };
  const cand = me && me.role === "Candidate";
  const rec = me && me.role === "Recruiter";

  const links = cand
    ? [
        ["cdash", "🏠 Dashboard"],
        ["jobs", "💼 Jobs"],
        ["apps", "📄 My Applications"],
        ["saved", "⭐ Saved Jobs"],
        ["profile", "👤 My Profile"],
      ]
    : rec
      ? [
          ["rdash", "🏠 Dashboard"],
          ["myjobs", "💼 My Jobs"],
          ["post", "➕ Post Job"],
          ["applicants", "👥 Applicants"],
        ]
      : [];

  const authed = [
    "cdash",
    "apps",
    "saved",
    "rdash",
    "myjobs",
    "post",
    "applicants",
    "apply",
    "profile",
  ].includes(pg);

  let v;
  if (authed && !me) {
    v = <Auth {...P} mode="login" />;
  } else if ((pg === "login" || pg === "register") && me) {
    v = me.role === "Candidate" ? <CDash {...P} /> : <RDash {...P} />;
  } else {
    v = {
      "": <Home {...P} />,
      jobs: <Jobs {...P} />,
      companies: <Companies {...P} />,
      company: <CompanyProfile {...P} />,
      about: <About />,
      contact: <Contact {...P} />,
      job: <Detail {...P} />,
      login: <Auth {...P} mode="login" />,
      register: <Auth {...P} mode="register" />,
      apply: <Apply {...P} />,
      profile: <Profile {...P} />,
      cdash: <CDash {...P} />,
      saved: <Saved {...P} />,
      apps: <Apps {...P} />,
      rdash: <RDash {...P} />,
      myjobs: <MyJobs {...P} />,
      post: <Post {...P} />,
      applicants: <Applicants {...P} />,
    }[pg] || <Home {...P} />;
  }

  const side =
    me &&
    links.some(
      (l) => l[0] === pg || ((pg === "job" || pg === "apply") && cand),
    );


  return (
    <div className="app-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="nav">
        <b
          className="brand"
          onClick={() => go("/")}
          style={{ cursor: "pointer" }}
        >
          💼 Career<span>Hub</span>
        </b>
        <button className="burger" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>

        <div
          className={"links" + (open ? " open" : "")}
          onClick={() => setOpen(false)}
        >
          <a href="#/" className={pg === "" ? "act" : ""}>
            Home
          </a>
          <a
            href="#/jobs"
            className={pg === "jobs" || pg === "job" ? "act" : ""}
          >
            Jobs
          </a>
          <a href="#/companies" className={pg === "companies" ? "act" : ""}>
            Companies
          </a>
          <a href="#/about" className={pg === "about" ? "act" : ""}>
            About
          </a>
          <a href="#/contact" className={pg === "contact" ? "act" : ""}>
            Contact
          </a>

          {me ? (
            <div className="authg">
              <Notifications db={db} up={up} me={me} />
              <span className="who">
                <span className="av">
                  {me.name ? me.name[0].toUpperCase() : "U"}
                </span>
                <span className="m">{me.name}</span>
              </span>
              <a
                href="#/"
                onClick={() => {
                  up((d) => ({ ...d, me: null }));
                  toast({ message: "Logged out successfully.", type: "info" });
                }}
              >
                Logout
              </a>
            </div>
          ) : (
            <span className="authg">
              <a href="#/login" className="btn o">
                Login
              </a>
              <a href="#/register" className="btn or">
                Register
              </a>
            </span>
          )}
        </div>
      </div>

      {side ? (
        <div className="shell">
          <div className="side">
            {links.map((l) => (
              <a
                key={l[0]}
                href={"#/" + l[0]}
                className={pg === l[0] ? "on" : ""}
              >
                <i>{l[1].split(" ")[0]}</i>
                <span>{l[1].split(" ").slice(1).join(" ")}</span>
              </a>
            ))}
            <a
              href="#/"
              onClick={() => {
                up((d) => ({ ...d, me: null }));
                toast({ message: "Logged out successfully.", type: "info" });
              }}
            >
              <i>🚪</i>
              <span>Logout</span>
            </a>
          </div>
          <div className="main">
            {v}
          </div>
        </div>
      ) : (
        <main className="wrap">
          {v}
        </main>
      )}

      {!side && <Footer />}
    </div>
  );
}
