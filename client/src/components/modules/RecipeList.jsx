import React from "react";
import RecipeCard from "./RecipeCard";
import "./RecipeList.css";

const RecipeList = ({ recipes, cols }) => {
	return (
		<div className="RecipeList" style={{ "--cols": cols }}>
			{recipes.map((r) => (
				<RecipeCard key={r._id} recipe={r} />
			))}
		</div>
	);
};

export default RecipeList;
