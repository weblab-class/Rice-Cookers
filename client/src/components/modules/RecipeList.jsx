import React from "react";
import RecipeCard from "./RecipeCard";
import "./RecipeList.css";

const RecipeList = ({ recipes }) => {
  return (
    <div className="RecipeList">
      {recipes.map((r) => (
        <RecipeCard key={r._id} recipe={r} />
      ))}
    </div>
  );
};

export default RecipeList;
