import React from "react";
import RecipeCard from "./RecipeCard";
import "./RecipeList.css";

const RecipeList = ({ recipes, columns }) => {
	return (
		<div className="RecipeList" style={{ "--cols": columns }}>
			{recipes.map((r) => (
				<RecipeCard key={r._id} recipe={r} />
			))}
		</div>
	);
};

export default RecipeList;
