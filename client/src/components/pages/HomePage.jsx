import React, { useState } from "react";
import RecipeList from "../modules/RecipeList";
import "./HomePage.css";

const HomePage = () => {
	const [columns, setColumns] = useState(2);

	const recipes = [
		{
			_id: "water",
			title: "Water",
			authorName: "Anonymous",
			timeRating: 1,
			avgRating: 5,
			image: "/images/water.png",
		},
		{
			_id: "soda",
			title: "Soda",
			authorName: "Anonymous",
			timeRating: 1,
			avgRating: 3,
			image: "/images/soda.png",
		},
		{
			_id: "juice",
			title: "Juice",
			authorName: "Anonymous",
			timeRating: 2,
			avgRating: 4,
			image: "/images/juice.png",
		},
	];

	const topRated = [...recipes].sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));

	const decCols = () => setColumns((c) => Math.max(1, c - 1));
	const incCols = () => setColumns((c) => Math.min(4, c + 1));

	return (
		<div className="HomePage">
			<div className="HomePage-header">
				<h2 className="HomePage-title">Top Rated Recipes</h2>

				<div className="HomePage-controls">
					<button className="ColsButton" type="button" onClick={decCols}>
						−
					</button>
					<div className="ColsLabel">{columns} / row</div>
					<button className="ColsButton" type="button" onClick={incCols}>
						+
					</button>
				</div>
			</div>

			<RecipeList recipes={topRated} columns={columns} />
		</div>
	);
};

export default HomePage;
