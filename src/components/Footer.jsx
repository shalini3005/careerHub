import React, { useState } from "react";

export const Footer = () => (
  <div className="foot">
    <div className="in">
      <div className="top">
        <div style={{ maxWidth: 340 }}>
          <b style={{ fontSize: 20, color: "#fff" }}>💼 CareerHub</b>
          <p style={{ color: "#9fb0cf" }}>
            Search thousands of opportunities from top companies and take the
            next step in your career.
          </p>
        </div>
        <div>
          <b style={{ color: "#fff" }}>Quick Links</b>
          <p>
            <a href="#/jobs">Job Seekers</a>
          </p>
          <p>
            <a href="#/register">Employers</a>
          </p>
          <p>
            <a href="#/contact">Contact Us</a>
          </p>
        </div>
        <div className="soc">
          <span>f</span>
          <span>X</span>
          <span>▶</span>
          <span>in</span>
        </div>
      </div>
      <div className="bot">
        <span>Privacy Policy · Terms of Service</span>
        <span>© 2026 CareerHub</span>
      </div>
    </div>
  </div>
);
