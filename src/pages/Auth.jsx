import React, { useState } from "react";
import { sendEmail } from "../utils/email";
import { Modal } from "../components/Modal";
import { v } from "../utils/validate";

const FErr = ({ msg }) =>
  msg ? <p style={{ color: "#dc2626", fontSize: 12, margin: "-4px 0 8px 2px" }}>⚠ {msg}</p> : null;

export function Auth({ db, up, go, mode, toast }) {
  const [f, setF] = useState({
    role: "Candidate",
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errs, setErrs] = useState({});
  const [e, setE] = useState("");
  const [busy, setBusy] = useState(false);

  // Forgot password modal state
  const [fpOpen, setFpOpen] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpErr, setFpErr] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpSuccess, setFpSuccess] = useState("");

  const s = (k) => (ev) => {
    setF({ ...f, [k]: ev.target.value });
    setErrs((prev) => ({ ...prev, [k]: "" }));
  };

  const submit = async () => {
    setE("");
    if (mode === "login") {
      // Validate login fields
      const loginErrs = {
        email: v.email(f.email),
        password: v.password(f.password),
      };
      setErrs(loginErrs);
      if (Object.values(loginErrs).some(Boolean)) return;

      const u = db.users.find(
        (u) => u.email === f.email && u.password === f.password && u.role === f.role,
      );
      if (!u) return setE("Invalid credentials or role. Please check your email, password and selected role.");
      up((d) => ({ ...d, me: u }));
      if (toast) toast({ message: `Welcome back, ${u.name}!`, type: "success" });
      go(u.role === "Candidate" ? "/cdash" : "/rdash");
    } else {
      // Validate register fields
      const regErrs = {
        name: v.name(f.name),
        email: v.email(f.email),
        password: v.password(f.password),
        confirm: v.confirmPassword(f.confirm, f.password),
      };
      setErrs(regErrs);
      if (Object.values(regErrs).some(Boolean)) return;

      if (db.users.some((u) => u.email === f.email))
        return setE("This email is already registered. Please log in.");

      setBusy(true);
      const u = {
        id: "u" + Date.now(),
        name: f.name.trim(),
        email: f.email.trim(),
        password: f.password,
        role: f.role,
        profile: {
          phone: "",
          loc: "",
          notice: "",
          salary: "",
          exp: "",
          skills: "",
          edu: "",
          work: "",
          linkedin: "",
          github: "",
          portfolio: "",
          resume: "",
          resumeData: "",
        },
      };

      // Add welcome notification
      const welcomeNotif = {
        id: "n_" + Date.now(),
        recipientId: u.id,
        title: "Welcome to CareerHub! 🎉",
        message: `Your ${u.role === "Candidate" ? "job seeker" : "recruiter"} account has been set up successfully.`,
        type: "status",
        read: false,
        createdAt: new Date().toISOString(),
      };

      try {
        await sendEmail({
          to_email: u.email,
          to_name: u.name,
          subject: "Welcome to CareerHub",
          message:
            "Hi " +
            u.name +
            ", your " +
            (u.role === "Candidate" ? "job seeker" : "recruiter") +
            " account is ready. Log in to get started.",
        });
      } catch (err) {
        console.error(err);
      }

      up((d) => ({
        ...d,
        users: [...d.users, u],
        notifications: [...(d.notifications || []), welcomeNotif],
        me: u,
      }));

      setBusy(false);
      if (toast)
        toast({
          message: "Account created! Welcome email dispatched.",
          type: "email",
        });
      go(u.role === "Candidate" ? "/cdash" : "/rdash");
    }
  };

  const handleForgotPassword = async () => {
    setFpErr("");
    setFpSuccess("");
    if (!fpEmail.trim()) {
      return setFpErr("Please enter your registered email address.");
    }
    const u = db.users.find(
      (x) => x.email.toLowerCase() === fpEmail.trim().toLowerCase(),
    );
    if (!u) {
      return setFpErr("No registered account found with that email address.");
    }

    setFpLoading(true);
    const tp = "ch" + Math.floor(1000 + Math.random() * 9000);
    up((d) => ({
      ...d,
      users: d.users.map((x) => (x.id === u.id ? { ...x, password: tp } : x)),
    }));

    const res = await sendEmail({
      to_email: u.email,
      to_name: u.name,
      subject: "Your CareerHub temporary password",
      message:
        "Hi " +
        u.name +
        ", your temporary password is " +
        tp +
        ". Please log in with it and update your password.",
    });

    setFpLoading(false);
    if (res.ok) {
      setFpSuccess(
        "A temporary password has been emailed to you. Check your inbox!",
      );
      if (toast)
        toast({ message: `Password reset sent to ${u.email}`, type: "email" });
    } else {
      setFpSuccess(
        `EmailJS is unconfigured or failed (${res.reason}). Your temporary password is: ${tp}`,
      );
      if (toast) toast({ message: `Demo temp password: ${tp}`, type: "info" });
    }
  };

  return (
    <div
      className="card"
      style={{ maxWidth: 440, margin: "30px auto", padding: 24 }}
    >
      <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
      <div className="tabs">
        {["Candidate", "Recruiter"].map((r) => (
          <button
            key={r}
            className={f.role === r ? "on" : ""}
            onClick={() => setF({ ...f, role: r })}
          >
            {r === "Candidate" ? "Job Seeker" : r}
          </button>
        ))}
      </div>

      {mode === "register" && (
        <>
          <input placeholder="Full Name" value={f.name} onChange={s("name")}
            style={errs.name ? { borderColor: "#dc2626" } : {}} />
          <FErr msg={errs.name} />
        </>
      )}
      <input type="email" placeholder="Email" value={f.email} onChange={s("email")}
        style={errs.email ? { borderColor: "#dc2626" } : {}} />
      <FErr msg={errs.email} />
      <input type="password" placeholder={mode === "register" ? "Password (min 6 characters)" : "Password"}
        value={f.password} onChange={s("password")}
        style={errs.password ? { borderColor: "#dc2626" } : {}} />
      <FErr msg={errs.password} />

      {mode === "register" && (
        <>
          <input type="password" placeholder="Confirm Password" value={f.confirm} onChange={s("confirm")}
            style={errs.confirm ? { borderColor: "#dc2626" } : {}} />
          <FErr msg={errs.confirm} />
        </>
      )}

      {mode === "login" && (
        <div style={{ textAlign: "right", margin: "4px 0 10px" }}>
          <button type="button" className="notif-btn-text" style={{ fontSize: 13 }}
            onClick={() => { setFpEmail(f.email || ""); setFpErr(""); setFpSuccess(""); setFpOpen(true); }}>
            Forgot Password?
          </button>
        </div>
      )}

      {e && (
        <p style={{ color: "#dc2626", margin: "6px 0 10px", fontSize: 13.5 }}>{e}</p>
      )}


      <button
        className="btn"
        style={{ width: "100%", marginTop: 6 }}
        disabled={busy}
        onClick={submit}
      >
        {busy && <span className="spinner" />}
        {busy ? "Processing..." : mode === "login" ? "Login" : "Create Account"}
      </button>

      <p className="m" style={{ marginTop: 16, textAlign: "center" }}>
        {mode === "login" ? (
          <>
            No account? <a href="#/register">Register Now</a>
          </>
        ) : (
          <>
            Have an account? <a href="#/login">Login Now</a>
          </>
        )}
      </p>

      {/* Sleek Forgot Password Modal */}
      <Modal
        isOpen={fpOpen}
        onClose={() => setFpOpen(false)}
        title="Reset Password"
        footer={
          <>
            <button
              className="btn o"
              onClick={() => setFpOpen(false)}
              disabled={fpLoading}
            >
              Close
            </button>
            {!fpSuccess && (
              <button
                className="btn"
                onClick={handleForgotPassword}
                disabled={fpLoading}
              >
                {fpLoading && <span className="spinner" />}
                {fpLoading ? "Sending..." : "Send Temp Password"}
              </button>
            )}
          </>
        }
      >
        <p className="m" style={{ marginTop: 0 }}>
          Enter your registered email address and we will dispatch a temporary
          password to your inbox.
        </p>
        <input
          type="email"
          placeholder="your.email@example.com"
          value={fpEmail}
          onChange={(e) => setFpEmail(e.target.value)}
          disabled={fpLoading}
          autoFocus
        />
        {fpErr && (
          <p style={{ color: "#dc2626", fontSize: 13, margin: "6px 0 0" }}>
            {fpErr}
          </p>
        )}
        {fpSuccess && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "12px 14px",
              borderRadius: 10,
              fontSize: 13.5,
              marginTop: 10,
              border: "1px solid #bbf7d0",
            }}
          >
            {fpSuccess}
          </div>
        )}
      </Modal>
    </div>
  );
}
