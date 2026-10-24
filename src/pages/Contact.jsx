import React, { useState } from "react";
import { sendEmail } from "../utils/email";
import { v } from "../utils/validate";

const FErr = ({ msg }) =>
  msg ? <p style={{ color: "#dc2626", fontSize: 12, margin: "-4px 0 8px 2px" }}>⚠ {msg}</p> : null;

export function Contact({ up, toast }) {
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const [errs, setErrs] = useState({});
  const [st, setSt] = useState("");
  const [busy, setBusy] = useState(false);

  const s = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    setErrs((prev) => ({ ...prev, [k]: "" }));
  };

  const submit = async () => {
    const e = {
      name: v.name(f.name),
      email: v.email(f.email),
      subject: v.subject(f.subject),
      message: v.message(f.message),
    };
    setErrs(e);
    if (Object.values(e).some(Boolean)) return;
    setBusy(true);
    up((d) => ({
      ...d,
      contacts: [
        ...(d.contacts || []),
        { ...f, date: new Date().toISOString() },
      ],
    }));

    const r = await sendEmail({
      to_email: import.meta.env.VITE_CONTACT_EMAIL || "",
      to_name: "CareerHub Team",
      from_name: f.name,
      reply_to: f.email,
      subject: "[Contact] " + (f.subject || "New message"),
      message: "From: " + f.name + " (" + f.email + ")\n\n" + f.message,
    });

    setBusy(false);
    if (r.ok) {
      setSt("✅ Thanks! Your message was sent.");
      setF({ name: "", email: "", subject: "", message: "" });
      if (toast)
        toast({
          message: "Your message has been sent to our team!",
          type: "email",
        });
    } else {
      setSt("Your message was saved locally, but email failed: " + r.reason);
      if (toast)
        toast({
          message: "Message saved locally (Email notice: " + r.reason + ")",
          type: "info",
        });
    }
  };

  return (
    <div className="grid two">
      <div className="card">
        <h2>Contact Us</h2>
        <input placeholder="Your name" value={f.name} onChange={s("name")}
          style={errs.name ? { borderColor: "#dc2626" } : {}} />
        <FErr msg={errs.name} />
        <input type="email" placeholder="Your email" value={f.email} onChange={s("email")}
          style={errs.email ? { borderColor: "#dc2626" } : {}} />
        <FErr msg={errs.email} />
        <input placeholder="Subject (optional)" value={f.subject} onChange={s("subject")}
          style={errs.subject ? { borderColor: "#dc2626" } : {}} />
        <FErr msg={errs.subject} />
        <textarea rows="5" placeholder="How can we help? (min 10 characters)" value={f.message} onChange={s("message")}
          style={errs.message ? { borderColor: "#dc2626" } : {}} />
        <FErr msg={errs.message} />
        {st && (
          <p className="m" style={{ margin: "8px 0" }}>
            {st}
          </p>
        )}
        <button
          className="btn"
          disabled={busy}
          onClick={submit}
          style={{ marginTop: 6 }}
        >
          {busy && <span className="spinner" />}
          {busy ? "Sending message..." : "Send Message"}
        </button>
      </div>

      <div className="card" style={{ height: "fit-content" }}>
        <h4>Get in touch</h4>
        <p className="m">
          Questions about a job, an application, or recruiter partnership? Send
          us a message and our support team will get back to you shortly.
        </p>
        <div style={{ marginTop: 14, fontSize: 13 }} className="m">
          <div>📍 Coimbatore / Remote</div>
          <div>🕒 Monday – Friday, 9:00 AM – 6:00 PM IST</div>
        </div>
      </div>
    </div>
  );
}
