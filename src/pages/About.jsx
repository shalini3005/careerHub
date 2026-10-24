import React from "react";

export function About() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", paddingBottom: 20 }}>
      {/* Hero Header */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
          color: "#fff",
          padding: "36px 28px",
          borderRadius: 20,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <span
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            padding: "4px 14px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            display: "inline-block",
            marginBottom: 12,
          }}
        >
          🚀 About CareerHub
        </span>
        <h1 style={{ fontSize: 32, margin: "0 0 12px", color: "#fff", letterSpacing: -0.5 }}>
          Connecting Ambition With Opportunity
        </h1>
        <p style={{ maxWidth: 680, margin: "0 auto", fontSize: 16, lineHeight: 1.6, opacity: 0.95 }}>
          CareerHub is a next-generation Career Portal and Applicant Tracking System (ATS) designed
          to bridge the gap between talented professionals and forward-thinking companies.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid two" style={{ gap: 18, marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
          <h3 style={{ margin: "0 0 8px" }}>Our Mission</h3>
          <p className="m" style={{ lineHeight: 1.6 }}>
            To simplify and humanize the recruitment process. We provide job seekers with transparent
            tracking tools and give recruiters an agile, real-time pipeline to discover and hire top talent.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: 28, marginBottom: 8 }}>🌍</div>
          <h3 style={{ margin: "0 0 8px" }}>Our Vision</h3>
          <p className="m" style={{ lineHeight: 1.6 }}>
            To become India's most trusted recruitment ecosystem where skill meets opportunity without
            unnecessary friction, outdated resumes, or communication black holes.
          </p>
        </div>
      </div>

      {/* What We Offer */}
      <h3 style={{ marginBottom: 14 }}>Why Choose CareerHub?</h3>
      <div className="grid" style={{ gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontSize: 24, marginBottom: 6 }}>💼</div>
          <b>Diverse Opportunities</b>
          <p className="m" style={{ fontSize: 13, marginTop: 6 }}>
            Explore verified openings across Frontend, Backend, UI/UX, Data, Mobile, DevOps, and Product.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: 24, marginBottom: 6 }}>📊</div>
          <b>Live Application Tracking</b>
          <p className="m" style={{ fontSize: 13, marginTop: 6 }}>
            Real-time stage transparency from Applied to Shortlisted, Interview, and Final Selection.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: 24, marginBottom: 6 }}>🛡️</div>
          <b>Privacy & Data Control</b>
          <p className="m" style={{ fontSize: 13, marginTop: 6 }}>
            Your sensitive information, resumes, and contact credentials remain secure and controllable.
          </p>
        </div>
      </div>
    </div>
  );
}
