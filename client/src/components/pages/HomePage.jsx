import React, { useEffect, useMemo, useState } from "react";
import { get } from "../../utilities";
import RecipeList from "../modules/RecipeList";
import "./HomePage.css";

const HomePage = () => {
	const [columns, setColumns] = useState(2);

	const [recipes, setRecipes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let isMounted = true;

		const loadRecipes = async () => {
			try {
				setIsLoading(true);
				setError("");

				const data = await get("/api/recipe");
				if (!isMounted) return;

				setRecipes(Array.isArray(data) ? data : []);
			} catch (e) {
				if (!isMounted) return;

				setError("Failed to load recipes from server.");
				setRecipes([]);
			} finally {
				if (!isMounted) return;
				setIsLoading(false);
			}
		};

		loadRecipes();

		return () => {
			isMounted = false;
		};
	}, []);

	const topRated = useMemo(() => {
		return [...recipes].sort((a, b) => (Number(b?.avgRating) || 0) - (Number(a?.avgRating) || 0));
	}, [recipes]);

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

			{isLoading ? (
				<div>Loading recipes...</div>
			) : error ? (
				<div>{error}</div>
			) : (
				<RecipeList recipes={topRated} columns={columns} />
			)}
		</div>
	);
};

export default HomePage;
