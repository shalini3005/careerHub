import React, { useState } from "react";

export const Logo = ({ n }) => (
  <div
    className="logo"
    style={{
      background: [
        "#2f6fdb",
        "#f97316",
        "#16a34a",
        "#7c3aed",
        "#0f1b3d",
        "#db2777",
      ][n.charCodeAt(0) % 6],
    }}
  >
    {n[0]}
  </div>
);
