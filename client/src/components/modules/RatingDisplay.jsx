import React from "react";
import "./RatingDisplay.css";

const StarRatingDisplay = ({ value }) => {
  const v = Math.max(0, Math.min(5, Math.round(value ?? 0)));
  return (
    <div className="Stars" aria-label={`Rating ${v} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="Stars-star">
          {i < v ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default StarRatingDisplay;
