import React from "react";
import { useNavigate } from "react-router-dom";
import StarRatingDisplay from "./RatingDisplay"
import TimeRatingDisplay from "./TimeDisplay";
import "./RecipeCard.css";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const onClick = () => {
    // later: navigate(`/recipes/${recipe._id}`)
    // for now we just no-op or route if you have it
    console.log("clicked recipe:", recipe._id);
  };

  return (
    <div className="RecipeCard" onClick={onClick} role="button" tabIndex={0}>
      <div className="RecipeCard-topRow">
        <div className="RecipeCard-author">{recipe.authorName}</div>
        <TimeRatingDisplay value={recipe.timeRating} />
      </div>

      <div className="RecipeCard-imageWrap">
        {recipe.image ? (
          <img className="RecipeCard-image" src={recipe.image} alt={recipe.title} />
        ) : (
          <div className="RecipeCard-imagePlaceholder">No image</div>
        )}
      </div>

      <div className="RecipeCard-bottomRow">
        <StarRatingDisplay value={recipe.avgRating} />
        <div className="RecipeCard-title">{recipe.title}</div>
      </div>
    </div>
  );
};

export default RecipeCard;
