import React, { useState } from "react";
import { v } from "../utils/validate";

const FErr = ({ msg }) =>
  msg ? <p style={{ color: "#dc2626", fontSize: 12, margin: "-4px 0 8px 2px" }}>⚠ {msg}</p> : null;

export function Profile({ db, up, me, toast }) {
  const prof = me.profile || {};
  const initial = {
    phone: prof.phone || "",
    loc: prof.loc || "",
    notice: prof.notice || "",
    salary: prof.salary || "",
    exp: prof.exp || "",
    skills: prof.skills || "",
    edu: prof.edu || "",
    work: prof.work || "",
    linkedin: prof.linkedin || "",
    github: prof.github || "",
    portfolio: prof.portfolio || "",
    resume: prof.resume || "",
    resumeData: prof.resumeData || "",
  };

  const [p, setP] = useState(initial);
  const [name, setName] = useState(me.name || "");
  const [resumeErr, setResumeErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState({});

  const s = (k) => (e) => {
    setP({ ...p, [k]: e.target.value });
    setErrs((prev) => ({ ...prev, [k]: "" }));
  };

  const handleResume = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 300000) {
      setResumeErr("Resume must be under 300 KB");
      return;
    }
    setResumeErr("");
    const reader = new FileReader();
    reader.onload = () => {
      setP((prev) => ({
        ...prev,
        resume: file.name,
        resumeData: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    // Validate before saving
    const e = {
      name: v.name(name),
      phone: p.phone ? v.phone(p.phone) : "",
      salary: v.salary(p.salary),
      exp: v.exp(p.exp),
      skills: v.skills(p.skills),
      edu: v.edu(p.edu),
      linkedin: v.url(p.linkedin, "LinkedIn URL"),
      github: v.url(p.github, "GitHub / Portfolio URL"),
    };
    setErrs(e);
    if (Object.values(e).some(Boolean)) return;

    setSaving(true);
    const updatedUser = { ...me, name, profile: { ...p } };
    up((d) => ({
      ...d,
      users: d.users.map((u) => (u.id === me.id ? updatedUser : u)),
      me: updatedUser,
    }));
    setTimeout(() => {
      setSaving(false);
      if (toast) toast({ message: "Profile saved! Job applications will now auto-fill.", type: "success" });
    }, 250);
  };

  const hasSavedDetails = !!(p.phone || p.skills || p.resume || p.loc);

  return (
    <div style={{ maxWidth: 840, margin: "0 auto" }}>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="row" style={{ alignItems: "flex-start" }}>
          <div className="logo" style={{ width: 64, height: 64, fontSize: 26 }}>
            {me.name ? me.name[0].toUpperCase() : "U"}
          </div>
          <div style={{ flex: 1 }}>
            <h2>{me.name}</h2>
            <p className="m" style={{ margin: "4px 0" }}>
              {me.email} · {me.role}
            </p>
            {hasSavedDetails ? (
              <span className="badge s-Active">✨ Auto-Fill Active</span>
            ) : (
              <span
                className="badge"
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  border: "1px solid #fde68a",
                }}
              >
                ℹ️ Profile Incomplete — Fill details below and save
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Basic Information</h3>
        <div className="grid two" style={{ gap: 14 }}>
          <div>
            <label className="m">Full Name</label>
            <input value={name} onChange={(e) => { setName(e.target.value); setErrs((p) => ({ ...p, name: "" })); }}
              placeholder="Full Name" style={errs.name ? { borderColor: "#dc2626" } : {}} />
            <FErr msg={errs.name} />
          </div>
          <div>
            <label className="m">Email Address (Read Only)</label>
            <input value={me.email} disabled style={{ opacity: 0.7 }} />
          </div>
          <div>
            <label className="m">Phone Number</label>
            <input value={p.phone} onChange={s("phone")} placeholder="+91 9876543210"
              style={errs.phone ? { borderColor: "#dc2626" } : {}} />
            <FErr msg={errs.phone} />
          </div>
          <div>
            <label className="m">Current Location / City</label>
            <input value={p.loc} onChange={s("loc")} placeholder="e.g. Coimbatore, Chennai, Bengaluru" />
          </div>
        </div>

        <h3 style={{ marginTop: 24 }}>Professional Details</h3>
        <div className="grid two" style={{ gap: 14 }}>
          <div>
            <label className="m">Total Experience (Years)</label>
            <input value={p.exp} onChange={s("exp")} placeholder="e.g. 2 years or Fresher"
              style={errs.exp ? { borderColor: "#dc2626" } : {}} />
            <FErr msg={errs.exp} />
          </div>
          <div>
            <label className="m">Expected Salary (LPA)</label>
            <input value={p.salary} onChange={s("salary")} placeholder="e.g. 8 LPA"
              style={errs.salary ? { borderColor: "#dc2626" } : {}} />
            <FErr msg={errs.salary} />
          </div>
          <div>
            <label className="m">Notice Period</label>
            <select value={p.notice} onChange={s("notice")}>
              <option value="">Select notice period...</option>
              <option value="Immediate">Immediate</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="60 Days">60 Days</option>
              <option value="90 Days">90 Days</option>
            </select>
          </div>
          <div>
            <label className="m">Primary Skills (comma separated)</label>
            <input value={p.skills} onChange={s("skills")} placeholder="React, Node.js, TypeScript, SQL"
              style={errs.skills ? { borderColor: "#dc2626" } : {}} />
            <FErr msg={errs.skills} />
          </div>
        </div>

        <h3 style={{ marginTop: 24 }}>Education & Experience</h3>
        <div style={{ marginBottom: 12 }}>
          <label className="m">Highest Qualification / Education</label>
          <input value={p.edu} onChange={s("edu")} placeholder="B.E. Computer Science, 2024"
            style={errs.edu ? { borderColor: "#dc2626" } : {}} />
          <FErr msg={errs.edu} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="m">Work History / Projects Summary</label>
          <textarea
            rows="3"
            value={p.work}
            onChange={s("work")}
            placeholder="Briefly describe your previous experience or prominent projects..."
          />
        </div>

        <h3 style={{ marginTop: 24 }}>Online Presence</h3>
        <div className="grid two" style={{ gap: 14 }}>
          <div>
            <label className="m">LinkedIn URL</label>
            <input value={p.linkedin} onChange={s("linkedin")} placeholder="https://linkedin.com/in/username"
              style={errs.linkedin ? { borderColor: "#dc2626" } : {}} />
            <FErr msg={errs.linkedin} />
          </div>
          <div>
            <label className="m">GitHub / Portfolio URL</label>
            <input value={p.github} onChange={s("github")} placeholder="https://github.com/username"
              style={errs.github ? { borderColor: "#dc2626" } : {}} />
            <FErr msg={errs.github} />
          </div>
        </div>

        <h3 style={{ marginTop: 24 }}>Resume Attachment</h3>
        <div
          style={{
            background: "var(--bg)",
            padding: 16,
            borderRadius: 12,
            marginBottom: 14,
          }}
        >
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResume} />
          {p.resume && (
            <p
              className="m"
              style={{ color: "var(--p)", marginTop: 6, fontWeight: 600 }}
            >
              📄 Current Resume: {p.resume}
            </p>
          )}
          {resumeErr && (
            <p style={{ color: "#dc2626", margin: "4px 0" }}>{resumeErr}</p>
          )}
          <small className="m">
            Supported formats: PDF, DOCX (Max 300 KB for client storage)
          </small>
        </div>

        <button
          className="btn"
          disabled={saving}
          onClick={save}
          style={{ width: "100%", marginTop: 10 }}
        >
          {saving ? "Saving..." : "💾 Save Profile"}
        </button>
      </div>
    </div>
  );
}
