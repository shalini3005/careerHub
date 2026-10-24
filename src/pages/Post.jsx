import React, { useState } from "react";
import { today } from "../utils/data";
import { createJob, updateJob, isApiConfigured } from "../services/api";
import { v } from "../utils/validate";

const FErr = ({ msg }) =>
  msg ? <p style={{ color: "#dc2626", fontSize: 12, margin: "-4px 0 8px 2px" }}>⚠ {msg}</p> : null;

export function Post({ db, up, me, go, id, toast }) {
  const ex = db.jobs.find((j) => String(j.id) === String(id));
  const [f, setF] = useState(
    ex || {
      title: "",
      company: "",
      dept: "",
      type: "Full Time",
      exp: "Fresher",
      location: "",
      mode: "Remote",
      min: "",
      max: "",
      skills: "",
      desc: "",
      cat: "Frontend",
      resp: "",
      qual: "",
      benefits: "",
      deadline: "",
    },
  );
  const [e, setE] = useState("");
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState({});

  const s = (k) => (ev) => {
    setF({ ...f, [k]: ev.target.value });
    setErrs((prev) => ({ ...prev, [k]: "" }));
  };

  const save = async (status) => {
    if (saving) return;
    // Validate fields
    const fieldErrs = {
      title: v.jobTitle(f.title),
      company: v.company(f.company),
      location: v.location(f.location),
      min: v.salaryNum(f.min, "Min Salary"),
      max: v.salaryMax(f.max, f.min),
    };
    setErrs(fieldErrs);
    if (Object.values(fieldErrs).some(Boolean)) {
      setE("Please fix the errors above before saving.");
      return;
    }
    setE("");
    setSaving(true);

    const jobData = {
      ...f,
      status,
      min: +f.min || 0,
      max: +f.max || 0,
    };

    try {
      if (ex) {
        const resolved = { ...jobData, id: ex.id };
        // Update local state immediately
        up((d) => ({
          ...d,
          jobs: d.jobs.map((j) => (String(j.id) === String(ex.id) ? resolved : j)),
        }));
        // Try API sync
        if (isApiConfigured()) {
          try { await updateJob(ex.id, jobData); } catch (e) { console.warn("API sync:", e.message); }
        }
        if (toast) toast({ message: `Job "${jobData.title}" updated successfully!`, type: "success" });
      } else {
        const payload = { ...jobData, rid: me.id, posted: today() };
        const localJob = { ...payload, id: "j_" + Date.now() };
        // Update local state immediately
        up((d) => ({ ...d, jobs: [...d.jobs, localJob] }));
        // Try API sync
        if (isApiConfigured()) {
          try {
            const created = await createJob(payload);
            // Replace local placeholder with API-assigned ID
            up((d) => ({
              ...d,
              jobs: d.jobs.map((j) => (j.id === localJob.id ? created : j)),
            }));
          } catch (e) { console.warn("API sync:", e.message); }
        }
        if (toast) toast({ message: `Job "${jobData.title}" published successfully!`, type: "success" });
      }
      go("/myjobs");
    } catch (err) {
      const errMsg = err.message || "Failed to save job";
      setE(errMsg);
      if (toast) toast({ message: errMsg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2>{ex ? "Edit Job" : "Post a Job"}</h2>
        <div className="row" style={{ flexWrap: "wrap" }}>
          {[
            ["title", "Job Title *"],
            ["company", "Company *"],
            ["dept", "Department"],
            ["location", "Location *"],
            ["min", "Min Salary (LPA)"],
            ["max", "Max Salary (LPA)"],
            ["skills", "Skills (comma separated)"],
          ].map(([k, l]) => (
            <div key={k} style={{ flex: "1 1 200px" }}>
              <input placeholder={l} value={f[k]} onChange={s(k)} disabled={saving}
                style={errs[k] ? { borderColor: "#dc2626" } : {}} />
              <FErr msg={errs[k]} />
            </div>
          ))}
        </div>

      <div className="row">
        <select value={f.type} onChange={s("type")} disabled={saving}>
          {["Full Time", "Part Time", "Internship", "Contract"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select value={f.mode} onChange={s("mode")} disabled={saving}>
          {["Remote", "Hybrid", "On-site"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select value={f.exp} onChange={s("exp")} disabled={saving}>
          {["Fresher", "1–3 years", "3–5 years", "5+ years"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select value={f.cat} onChange={s("cat")} disabled={saving}>
          {["Frontend", "Backend", "UI/UX", "Testing", "Marketing", "Data"].map(
            (x) => (
              <option key={x}>{x}</option>
            ),
          )}
        </select>
      </div>
      <textarea
        rows="3"
        placeholder="About the role"
        value={f.desc}
        onChange={s("desc")}
        disabled={saving}
      />
      <textarea
        rows="3"
        placeholder="Responsibilities"
        value={f.resp}
        onChange={s("resp")}
        disabled={saving}
      />
      <textarea
        rows="3"
        placeholder="Qualifications"
        value={f.qual}
        onChange={s("qual")}
        disabled={saving}
      />
      <div className="row">
        <input
          placeholder="Benefits (e.g. Health Insurance, Paid Leave)"
          value={f.benefits}
          onChange={s("benefits")}
          disabled={saving}
        />
        <input
          type="date"
          title="Application deadline"
          value={f.deadline}
          onChange={s("deadline")}
          disabled={saving}
        />
      </div>
      {e && <p style={{ color: "#dc2626" }}>{e}</p>}
      <div className="row" style={{ justifyContent: "flex-start" }}>
        <button
          className="btn o"
          disabled={saving}
          onClick={() => save("Draft")}
        >
          {saving ? "Saving..." : "Save Draft"}
        </button>
        <a className="btn o" href="#/myjobs">
          Cancel
        </a>
        <button
          className="btn"
          disabled={saving}
          onClick={() => save("Active")}
        >
          {saving
            ? "Saving..."
            : ex
              ? "Update Job"
              : "Publish Job"}
        </button>
      </div>
      <h4>Live Preview</h4>
      <div className="card">
        <b>{f.title || "Job title"}</b>
        <div className="m">
          {f.company} · {f.location} · {f.mode} · {f.type} · {f.exp}
        </div>
        <p className="m">
          ₹{f.min || 0}–{f.max || 0} LPA · {f.skills}
        </p>
        <p>{f.desc}</p>
      </div>
    </div>
  );
}
