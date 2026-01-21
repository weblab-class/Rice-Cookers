import React from "react";
import "./TimeDisplay.css";

const TimeRatingDisplay = ({ value }) => {
  const v = Math.max(0, Math.min(3, Math.round(value ?? 0)));
  return (
    <div className="Clocks" aria-label={`Time rating ${v} out of 3`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className="Clocks-clock">
          {i < v ? "🕒" : "○"}
        </span>
      ))}
    </div>
  );
};

export default TimeRatingDisplay;
