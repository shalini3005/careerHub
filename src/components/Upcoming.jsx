import React, { useState } from "react";

export const Upcoming = ({ db, list }) => {
  const L = list.filter((a) => a.iv && a.status === "Interview");
  return (
    <>
      <h3>Upcoming Interviews</h3>
      {L.length ? (
        L.map((a) => {
          const j = db.jobs.find((x) => String(x.id) === String(a.jid));
          return (
            <div className="card row" key={a.id}>
              <b>{a.name}</b>
              <span>
                {j?.title} · {j?.company}
              </span>
              <span>
                {a.iv.date} {a.iv.time}
              </span>
              <span>{a.iv.mode}</span>
            </div>
          );
        })
      ) : (
        <p className="m">None scheduled.</p>
      )}
    </>
  );
};
