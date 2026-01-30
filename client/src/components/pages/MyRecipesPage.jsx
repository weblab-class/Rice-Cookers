import React, { useContext, useEffect, useMemo, useState } from "react";

import { UserContext } from "../App";
import { get, post } from "../../utilities";

import MyRecipeList from "../modules/MyRecipeList";

import "./MyRecipesPage.css";

const MyRecipesPage = () => {
	const { userId } = useContext(UserContext);

	const [recipes, setRecipes] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		let isMounted = true;

		const load = async () => {
			if (!userId) {
				setRecipes([]);
				setIsLoading(false);
				setError("");
				return;
			}

			try {
				setIsLoading(true);
				setError("");

				const data = await get("/api/recipe/mine");
				if (!isMounted) return;

				setRecipes(Array.isArray(data) ? data : []);
			} catch (e) {
				if (!isMounted) return;
				setError("Failed to load your recipes.");
				setRecipes([]);
			} finally {
				if (!isMounted) return;
				setIsLoading(false);
			}
		};

		load();
		return () => {
			isMounted = false;
		};
	}, [userId]);

	const myRecipes = useMemo(() => {
		return [...recipes].sort((a, b) => {
			const ta = new Date(a?.createdAt || 0).getTime();
			const tb = new Date(b?.createdAt || 0).getTime();
			return tb - ta;
		});
	}, [recipes]);

	const onDelete = async (recipeId) => {
		if (!recipeId) return;
		if (!window.confirm("Delete this recipe? This cannot be undone.")) return;

		try {
			await post("/api/recipe/delete", { recipeId });
			setRecipes((prev) => prev.filter((r) => r?._id !== recipeId));
		} catch (e) {
			console.error(e);
			setError("Failed to delete recipe.");
		}
	};

	if (!userId) {
		return (
			<div className="MyRecipesPage">
				<h2 className="MyRecipesPage-title">My Recipes</h2>
				<div className="MyRecipesPage-muted">Log in to view and manage your submitted recipes.</div>
			</div>
		);
	}

	return (
		<div className="MyRecipesPage">
			<div className="MyRecipesPage-header">
				<h2 className="MyRecipesPage-title">My Recipes</h2>
				<div className="MyRecipesPage-count">{myRecipes.length} total</div>
			</div>

			{isLoading ? (
				<div>Loading...</div>
			) : error ? (
				<div className="MyRecipesPage-error">{error}</div>
			) : myRecipes.length ? (
				<MyRecipeList recipes={myRecipes} onDelete={onDelete} />
			) : (
				<div className="MyRecipesPage-muted">You have not submitted any recipes yet.</div>
			)}
		</div>
	);
};

export default MyRecipesPage;
