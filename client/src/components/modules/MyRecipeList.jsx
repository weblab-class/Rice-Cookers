import React from "react";

import MyRecipeCard from "./MyRecipeCard";
import "./MyRecipeList.css";

const MyRecipeList = ({ recipes, onDelete }) => {
	return (
		<div className="MyRecipeList">
			{recipes.map((r) => (
				<MyRecipeCard key={r._id} recipe={r} onDelete={onDelete} />
			))}
		</div>
	);
};

export default MyRecipeList;
