import React, { useState } from "react";
import { Logo } from "../components/Logo";
import { sal, today } from "../utils/data";

export function Detail({ db, id, me, go, up, apiLoading }) {
  const j = db.jobs.find((x) => String(x.id) === String(id));
  if (!j) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 30 }}>
        {apiLoading ? (
          <p className="m">Loading job details from API...</p>
        ) : (
          <>
            <h3>Job Not Found</h3>
            <p className="m">The job posting you are looking for does not exist or may have been removed.</p>
            <a className="btn" href="#/jobs">Browse All Jobs</a>
          </>
        )}
      </div>
    );
  }
  const applied = me && db.apps.some((a) => a.uid === me.id && String(a.jid) === String(j.id));
  const sv = me && db.saved.some((s) => s.uid === me.id && String(s.jid) === String(j.id));
  return (
    <div className="grid two">
      <div className="card">
        <div className="row" style={{ flexWrap: "nowrap" }}>
          <Logo n={j.company} />
          <div>
            <h2 style={{ margin: 0 }}>{j.title}</h2>
            <div className="m">
              {j.company} · {j.location} · {j.mode} · {j.type}
            </div>
          </div>
        </div>
        <p>
          <b>{sal(j)}</b> · {j.exp} · Posted {j.posted}
        </p>
        <h4>Description</h4>
        <p>{j.desc}</p>
        <h4>Required Skills</h4>
        <p>{j.skills}</p>
        {j.resp && (
          <>
            <h4>Responsibilities</h4>
            <p>{j.resp}</p>
          </>
        )}
        {j.qual && (
          <>
            <h4>Qualifications</h4>
            <p>{j.qual}</p>
          </>
        )}
        {j.pref && (
          <>
            <h4>Preferred Skills</h4>
            <p>{j.pref}</p>
          </>
        )}
        {j.benefits && (
          <>
            <h4>Benefits</h4>
            <p>{j.benefits}</p>
          </>
        )}
        {me?.role === "Candidate" ? (
          applied ? (
            <span className="badge">Already applied</span>
          ) : (
            <button className="btn" onClick={() => go("/apply/" + j.id)}>
              Apply Now
            </button>
          )
        ) : (
          !me && (
            <a className="btn" href="#/login">
              Login to apply
            </a>
          )
        )}
        {(!me || me.role === "Candidate") && (
          <button
            className="btn o"
            style={{ marginLeft: 8 }}
            onClick={() =>
              !me
                ? go("/login")
                : up((d) => ({
                    ...d,
                    saved: sv
                      ? d.saved.filter(
                          (s) => !(s.uid === me.id && String(s.jid) === String(j.id)),
                        )
                      : [...d.saved, { uid: me.id, jid: j.id, date: today() }],
                  }))
            }
          >
            {sv ? "★ Saved" : "☆ Save Job"}
          </button>
        )}
      </div>
      <div className="card">
        <h4>Job Overview</h4>
        <p className="m">
          Type: {j.type}
          <br />
          Location: {j.location}
          <br />
          Mode: {j.mode}
          <br />
          Salary: {sal(j)}
          <br />
          Department: {j.dept}
          <br />
          Experience: {j.exp}
          <br />
          Posted: {j.posted}
          <br />
          Deadline: {j.deadline || "—"}
        </p>
        <h4>{j.company}</h4>
        <p className="m">
          A growing company hiring now. Size: 50–500 employees.
        </p>
        <a href={"#/company/" + encodeURIComponent(j.company)}>
          View Company Profile
        </a>
      </div>
    </div>
  );
}
