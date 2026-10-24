import React, { useState } from "react";

export const SummaryCard = ({ items }) => (
  <div className="grid">
    {items.map(([l, v], i) => (
      <div className="card stat" key={l}>
        <div className="ic">{["📄", "⭐", "🎤", "🏆"][i]}</div>
        <div>
          <div className="m">{l}</div>
          <h2>{v}</h2>
        </div>
      </div>
    ))}
  </div>
);
