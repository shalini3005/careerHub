import React, { useState } from "react";

export const StatusBadge = ({ s }) => (
  <span className={"badge s-" + s.split(" ")[0]}>{s}</span>
);
