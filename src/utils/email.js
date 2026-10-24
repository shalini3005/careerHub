import emailjs from "@emailjs/browser";

const S = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const T = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const K = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
export const emailReady = !!(S && T && K);

// every attempt is also kept in localStorage ("careerhub_emails") so you can see what was sent
function log(entry) {
  try {
    const l = JSON.parse(localStorage.getItem("careerhub_emails") || "[]");
    l.push({ ...entry, at: new Date().toISOString() });
    localStorage.setItem("careerhub_emails", JSON.stringify(l.slice(-50)));
  } catch (e) {}
}

// params: to_email, to_name, subject, message (+ optional from_name, reply_to)
export async function sendEmail(params) {
  if (!emailReady) {
    log({
      to: params.to_email,
      subject: params.subject,
      ok: false,
      reason: "EmailJS not configured",
    });
    return { ok: false, reason: "EmailJS is not configured (see README)" };
  }
  try {
    await emailjs.send(S, T, params, { publicKey: K });
    log({ to: params.to_email, subject: params.subject, ok: true });
    return { ok: true };
  } catch (err) {
    const reason = (err && (err.text || err.message)) || "send failed";
    log({ to: params.to_email, subject: params.subject, ok: false, reason });
    return { ok: false, reason };
  }
}
