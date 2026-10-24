/**
 * CareerHub — Shared Form Validation Utility
 * Each validator returns an error string if invalid, or "" if valid.
 */

// ── Field Validators ──────────────────────────────────────────────────────────

export const v = {
  /** Required non-empty string */
  required: (val, label = "This field") =>
    !val || !String(val).trim() ? `${label} is required.` : "",

  /** Full name: letters/spaces/dots/hyphens, 2–60 chars */
  name: (val) => {
    if (!val || !val.trim()) return "Full name is required.";
    if (val.trim().length < 2) return "Name must be at least 2 characters.";
    if (val.trim().length > 60) return "Name must be under 60 characters.";
    if (!/^[a-zA-Z\s.\-']+$/.test(val.trim()))
      return "Name can only contain letters, spaces, dots or hyphens.";
    return "";
  },

  /** Email: standard format */
  email: (val) => {
    if (!val || !val.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()))
      return "Enter a valid email address (e.g. you@example.com).";
    return "";
  },

  /** Phone: 7–15 digits, optional + prefix and separators */
  phone: (val) => {
    if (!val || !val.trim()) return "Phone number is required.";
    const digits = val.replace(/[\s\-().+]/g, "");
    if (!/^\d+$/.test(digits)) return "Phone number can only contain digits.";
    if (digits.length < 7) return "Phone number is too short (min 7 digits).";
    if (digits.length > 15) return "Phone number is too long (max 15 digits).";
    return "";
  },

  /** Password: min 6 chars */
  password: (val) => {
    if (!val) return "Password is required.";
    if (val.length < 6) return "Password must be at least 6 characters.";
    if (val.length > 64) return "Password must be under 64 characters.";
    return "";
  },

  /** Confirm password match */
  confirmPassword: (val, original) => {
    if (!val) return "Please confirm your password.";
    if (val !== original) return "Passwords do not match.";
    return "";
  },

  /** Salary: optional free text, sensible chars only */
  salary: (val) => {
    if (!val || !val.trim()) return "";
    if (val.trim().length > 30) return "Salary field is too long.";
    if (!/^[₹\d\s.\-–,LPAlakha-zA-Z]+$/.test(val.trim()))
      return "Salary must be a number or range (e.g. 8 LPA, 8–12 LPA).";
    return "";
  },

  /** Numeric salary (LPA fields on Post Job) */
  salaryNum: (val, label = "Salary", min = 0, max = 500) => {
    if (val === "" || val === undefined || val === null) return "";
    const n = Number(val);
    if (isNaN(n) || n < 0) return `${label} must be a non-negative number.`;
    if (n > max) return `${label} must be at most ${max} LPA.`;
    return "";
  },

  /** Max salary > min salary cross-check */
  salaryMax: (max, min) => {
    const n = Number(max), m = Number(min);
    if (!max || isNaN(n)) return "";
    if (!isNaN(m) && m > 0 && n > 0 && n < m)
      return "Max salary must be greater than min salary.";
    return "";
  },

  /** Experience: optional, max 50 chars */
  exp: (val) => {
    if (!val || !val.trim()) return "";
    if (val.trim().length > 50) return "Experience field is too long (max 50 chars).";
    return "";
  },

  /** URL: optional, must start with http/https if filled */
  url: (val, label = "URL") => {
    if (!val || !val.trim()) return "";
    if (!/^https?:\/\/.+\..+/.test(val.trim()))
      return `${label} must start with https:// (e.g. https://linkedin.com/in/you).`;
    return "";
  },

  /** Skills: optional, max 200 chars */
  skills: (val) => {
    if (!val || !val.trim()) return "";
    if (val.trim().length > 200) return "Skills list is too long (max 200 characters).";
    return "";
  },

  /** Education: optional, max 200 chars */
  edu: (val) => {
    if (!val || !val.trim()) return "";
    if (val.trim().length > 200) return "Education is too long (max 200 characters).";
    return "";
  },

  /** Job title: required, 2–100 chars */
  jobTitle: (val) => {
    if (!val || !val.trim()) return "Job title is required.";
    if (val.trim().length < 2) return "Job title must be at least 2 characters.";
    if (val.trim().length > 100) return "Job title must be under 100 characters.";
    return "";
  },

  /** Company name: required, 2–100 chars */
  company: (val) => {
    if (!val || !val.trim()) return "Company name is required.";
    if (val.trim().length < 2) return "Company name must be at least 2 characters.";
    if (val.trim().length > 100) return "Company name must be under 100 characters.";
    return "";
  },

  /** Location: required, 2–100 chars */
  location: (val) => {
    if (!val || !val.trim()) return "Location is required.";
    if (val.trim().length < 2) return "Location must be at least 2 characters.";
    if (val.trim().length > 100) return "Location must be under 100 characters.";
    return "";
  },

  /** Contact message: min 10 chars */
  message: (val) => {
    if (!val || !val.trim()) return "Message is required.";
    if (val.trim().length < 10) return "Message must be at least 10 characters.";
    if (val.trim().length > 2000) return "Message must be under 2000 characters.";
    return "";
  },

  /** Subject: optional, max 120 chars */
  subject: (val) => {
    if (!val || !val.trim()) return "";
    if (val.trim().length > 120) return "Subject must be under 120 characters.";
    return "";
  },
};

/**
 * Given an object of { key: errorString }, return the first non-empty error.
 */
export function firstError(errors) {
  return Object.values(errors).find((e) => e) || "";
}

/**
 * True if all errors in the map are empty strings.
 */
export function isValid(errors) {
  return Object.values(errors).every((e) => !e);
}
