import React from "react";

import RecipeCard from "./RecipeCard";
import "./MyRecipeCard.css";

const MyRecipeCard = ({ recipe, onDelete }) => {
	return (
		<div className="MyRecipeCardWrap">
			<RecipeCard recipe={recipe} />
			<button
				className="MyRecipeCard-delete"
				type="button"
				title="Delete recipe"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onDelete?.(recipe?._id);
				}}
			>
				🗑
			</button>
		</div>
	);
};

export default MyRecipeCard;
