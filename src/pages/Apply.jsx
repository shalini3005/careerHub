import React, { useState } from "react";
import { sendEmail } from "../utils/email";
import { sal, today } from "../utils/data";
import { createApplication, isApiConfigured } from "../services/api";
import { v } from "../utils/validate";

/** Inline field error */
const FErr = ({ msg }) =>
  msg ? (
    <p style={{ color: "#dc2626", fontSize: 12, margin: "-6px 0 8px 2px" }}>
      ⚠ {msg}
    </p>
  ) : null;

export function Apply({ db, up, go, me, id, toast }) {
  const j = db.jobs.find((x) => String(x.id) === String(id));
  const [step, setStep] = useState(1);
  const prof = me.profile || {};
  const hasProfile = !!(prof.phone || prof.skills || prof.resume);

  const [f, setF] = useState({
    name: me.name || "",
    email: me.email || "",
    phone: prof.phone || "",
    loc: prof.loc || "",
    notice: prof.notice || "",
    salary: prof.salary || "",
    resume: prof.resume || "",
    resumeData: prof.resumeData || "",
    cover: "",
    exp: prof.exp || "",
    skills: prof.skills || "",
    edu: prof.edu || "",
    work: prof.work || "",
    terms: false,
  });

  const [errs, setErrs] = useState({});
  const [submitErr, setSubmitErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!j) return <p>Job not found.</p>;

  const setField = (k) => (ev) => {
    setF((prev) => ({ ...prev, [k]: ev.target.value }));
    setErrs((prev) => ({ ...prev, [k]: "" }));
  };

  const validateStep1 = () => {
    const e = {
      name:   v.name(f.name),
      email:  v.email(f.email),
      phone:  v.phone(f.phone),
      salary: v.salary(f.salary),
      exp:    v.exp(f.exp),
      skills: v.skills(f.skills),
      edu:    v.edu(f.edu),
      resume: !f.resume ? "Resume is required. Please upload your CV." : "",
      terms:  !f.terms ? "Please accept the Terms & Conditions to continue." : "",
    };
    setErrs(e);
    return Object.values(e).every((x) => !x);
  };

  const next = () => {
    if (validateStep1()) {
      setSubmitErr("");
      setStep(2);
    }
  };

  const submit = async () => {
    if (submitting) return;
    if (db.apps.some((a) => a.uid === me.id && String(a.jid) === String(j.id)))
      return setSubmitErr("You have already applied for this job.");

    setSubmitting(true);
    setSubmitErr("");
    const rc = db.users.find((u) => String(u.id) === String(j.rid));
    const { terms, resumeData, ...appDetails } = f;
    const appPayload = { ...appDetails, uid: me.id, jid: j.id, rid: j.rid, status: "Applied", date: today() };

    try {
      let createdApp;
      if (isApiConfigured()) {
        try { createdApp = await createApplication(appPayload); }
        catch (err) { createdApp = { ...appPayload, id: "app_" + Date.now(), resumeData }; }
      } else {
        createdApp = { ...appPayload, id: "app_" + Date.now(), resumeData };
      }

      const candidateNotif = {
        id: "n_c_" + Date.now(), recipientId: me.id,
        title: "Application Submitted 💼",
        message: `Your application for ${j.title} at ${j.company} was submitted.`,
        type: "apply", link: "#/apps", read: false, createdAt: new Date().toISOString(),
      };
      const recruiterNotif = rc ? {
        id: "n_r_" + Date.now(), recipientId: rc.id,
        title: `New Applicant: ${f.name} 👤`,
        message: `${f.name} applied for ${j.title}.`,
        type: "apply", link: `#/applicants/${j.id}`, read: false, createdAt: new Date().toISOString(),
      } : null;

      up((d) => ({
        ...d,
        apps: [...d.apps, createdApp],
        notifications: [...(d.notifications || []), candidateNotif, ...(recruiterNotif ? [recruiterNotif] : [])],
      }));

      try {
        await sendEmail({ to_email: f.email, to_name: f.name,
          subject: "Application received: " + j.title + " at " + j.company,
          message: `Hi ${f.name}, we received your application for ${j.title} at ${j.company}. Track it under My Applications.`,
        });
        if (rc) await sendEmail({ to_email: rc.email, to_name: rc.name,
          subject: "New applicant for " + j.title,
          message: `${f.name} (${f.email}) applied for ${j.title}. Open Applicants to review.`,
        });
      } catch (_) {}

      if (toast) toast({ message: `Applied to ${j.title}! Confirmation sent to your email.`, type: "email" });
      setStep(3);
    } catch (err) {
      const msg = err.message || "Failed to submit application";
      setSubmitErr(msg);
      if (toast) toast({ message: msg, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const inp = (k) => errs[k] ? { borderColor: "#dc2626", background: "#fff8f8" } : {};

  return (
    <div className="grid two">
      <div className="card">
        <h3>Apply — Step {step} of 3</h3>

        {step === 1 && (
          <>
            {hasProfile && (
              <div style={{ background: "#dcfce7", color: "#166534", padding: "10px 14px",
                borderRadius: 10, fontSize: 13, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <span>✨</span> <b>Auto-filled from your profile.</b> You can edit any field before submitting.
              </div>
            )}

            <label className="m">Full Name *</label>
            <input placeholder="e.g. Priya Sharma" value={f.name} onChange={setField("name")} style={inp("name")} />
            <FErr msg={errs.name} />

            <label className="m">Email Address *</label>
            <input type="email" placeholder="you@example.com" value={f.email} onChange={setField("email")} style={inp("email")} />
            <FErr msg={errs.email} />

            <label className="m">Phone Number *</label>
            <input placeholder="+91 9876543210 (7–15 digits)" value={f.phone}
              onChange={setField("phone")} inputMode="tel" style={inp("phone")} />
            <FErr msg={errs.phone} />

            <label className="m">Current Location</label>
            <input placeholder="e.g. Chennai, Bengaluru, Hyderabad" value={f.loc} onChange={setField("loc")} />

            <label className="m">Notice Period</label>
            <select value={f.notice} onChange={setField("notice")} style={{ marginBottom: 10 }}>
              <option value="">Select notice period...</option>
              <option value="Immediate">Immediate</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="60 Days">60 Days</option>
              <option value="90 Days">90 Days</option>
            </select>

            <label className="m">Expected Salary</label>
            <input placeholder="e.g. 8 LPA, 8–12 LPA" value={f.salary} onChange={setField("salary")} style={inp("salary")} />
            <FErr msg={errs.salary} />

            <label className="m">Experience</label>
            <input placeholder="e.g. 2 years, Fresher" value={f.exp} onChange={setField("exp")} style={inp("exp")} />
            <FErr msg={errs.exp} />

            <label className="m">Skills (comma separated)</label>
            <input placeholder="React, Node.js, SQL, Python" value={f.skills} onChange={setField("skills")} style={inp("skills")} />
            <FErr msg={errs.skills} />

            <label className="m">Education</label>
            <input placeholder="B.E. Computer Science, 2024" value={f.edu} onChange={setField("edu")} style={inp("edu")} />
            <FErr msg={errs.edu} />

            <label className="m">Work History / Projects</label>
            <textarea rows="2" placeholder="Briefly describe prior experience or projects (optional)"
              value={f.work} onChange={setField("work")} />

            {/* Resume */}
            <div style={{ background: "var(--bg)", padding: "12px 14px", borderRadius: 10, marginBottom: 4,
              border: errs.resume ? "1.5px solid #dc2626" : "1.5px solid var(--b)" }}>
              <label className="m" style={{ display: "block", marginBottom: 6 }}>📄 Resume (PDF / DOC) *</label>
              {f.resume ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>📎 <b>{f.resume}</b></span>
                  <button className="btn o" style={{ fontSize: 11, padding: "3px 8px" }}
                    onClick={() => { setF({ ...f, resume: "", resumeData: "" }); setErrs((p) => ({ ...p, resume: "" })); }}>
                    Change
                  </button>
                </div>
              ) : (
                <input type="file" accept=".pdf,.doc,.docx"
                  onChange={(ev) => {
                    const file = ev.target.files[0];
                    if (!file) return;
                    if (file.size > 300000) { setErrs((p) => ({ ...p, resume: "Resume must be under 300 KB." })); return; }
                    setErrs((p) => ({ ...p, resume: "" }));
                    const reader = new FileReader();
                    reader.onload = () => setF((p) => ({ ...p, resume: file.name, resumeData: reader.result }));
                    reader.readAsDataURL(file);
                  }} />
              )}
            </div>
            <FErr msg={errs.resume} />

            {/* Cover Letter */}
            <label className="m" style={{ marginTop: 8, display: "block" }}>Cover Letter (optional)</label>
            <textarea rows="3" placeholder="Why are you a great fit for this role? (max 1000 characters)"
              value={f.cover}
              onChange={(ev) => { if (ev.target.value.length <= 1000) setF({ ...f, cover: ev.target.value }); }} />
            {f.cover.length > 850 && (
              <p style={{ fontSize: 11, color: "#92400e", margin: "-6px 0 6px" }}>
                {1000 - f.cover.length} characters remaining
              </p>
            )}

            {/* Terms */}
            <label style={{ display: "flex", gap: 8, alignItems: "flex-start",
              cursor: "pointer", margin: "12px 0 4px", padding: 0 }}>
              <input type="checkbox" checked={f.terms}
                onChange={(ev) => { setF({ ...f, terms: ev.target.checked }); setErrs((p) => ({ ...p, terms: "" })); }}
                style={{ flexShrink: 0, width: 16, height: 16, marginTop: 2, cursor: "pointer", accentColor: "var(--p)" }} />
              <span className="m" style={{ fontSize: 13, lineHeight: 1.5 }}>
                I agree to the Terms &amp; Conditions and certify all details are accurate.
              </span>
            </label>
            <FErr msg={errs.terms} />

            <button className="btn" style={{ width: "100%", marginTop: 8 }} onClick={next}>
              Continue to Review ➔
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="m">Please review your details carefully before submitting your application.</p>
            {submitErr && (
              <p style={{ color: "#dc2626", background: "#fee2e2", padding: "8px 12px", borderRadius: 8 }}>
                {submitErr}
              </p>
            )}
            <div style={{ background: "var(--bg)", padding: 14, borderRadius: 12, marginBottom: 14 }}>
              {Object.entries(f)
                .filter(([k]) => k !== "resumeData" && k !== "terms")
                .map(([k, val]) => (
                  <p key={k} className="m" style={{ margin: "4px 0" }}>
                    <b style={{ textTransform: "capitalize" }}>{k}:</b> {val || "—"}
                  </p>
                ))}
            </div>
            <div className="row">
              <button className="btn o" disabled={submitting} onClick={() => setStep(1)}>Back</button>
              <button className="btn" disabled={submitting} onClick={submit}>
                {submitting && <span className="spinner" />}
                {submitting ? "Submitting Application..." : "Submit Application"}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <span style={{ fontSize: 44 }}>🎉</span>
              <h3>Application Submitted!</h3>
              <p className="m">
                We have delivered your application to the recruiter and sent a
                confirmation email to <b>{f.email}</b>.
              </p>
            </div>
            <div className="row">
              <a className="btn" href="#/apps">Track in My Applications</a>
              <a className="btn o" href="#/jobs">Browse More Jobs</a>
            </div>
          </>
        )}
      </div>

      <div className="card" style={{ height: "fit-content" }}>
        <h3>{j.title}</h3>
        <p className="m">
          <b>{j.company}</b> · {j.location} · {j.mode}
          <br />
          <b>Salary:</b> {sal(j)}
          <br />
          <b>Required Skills:</b> {j.skills}
        </p>
        <div className="badge s-Active" style={{ marginTop: 8 }}>{j.type}</div>
      </div>
    </div>
  );
}
