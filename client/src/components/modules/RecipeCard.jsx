import React, { useMemo, useState } from "react";
import StarRatingDisplay from "./RatingDisplay";
import TimeRatingDisplay from "./TimeDisplay";
import "./RecipeCard.css";

const normalizeLines = (v) => {
	if (Array.isArray(v)) {
		return v.map((s) => String(s).trim()).filter(Boolean);
	}

	if (typeof v === "string") {
		return v
			.split("\n")
			.map((s) => s.trim())
			.filter(Boolean);
	}

	return [];
};

const RecipeCard = ({ recipe }) => {
	const [showsInstr, setShowsInstr] = useState(false);
	const [showsIng, setShowsIng] = useState(false);

	const instructions = useMemo(() => normalizeLines(recipe?.instructions), [recipe?.instructions]);
	const ingredients = useMemo(() => normalizeLines(recipe?.ingredients), [recipe?.ingredients]);

	const toggleInstr = () => {
		setShowsInstr((prev) => !prev);
	};

	const toggleIng = () => {
		setShowsIng((prev) => !prev);
	};

	const onKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			toggleInstr();
		}
	};

	const onIngredientsKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			e.stopPropagation();
			toggleIng();
		}
	};

	return (
		<div
			className={`RecipeCard ${showsInstr ? "RecipeCard--open" : ""}`}
			onClick={toggleInstr}
			onKeyDown={onKeyDown}
			role="button"
			tabIndex={0}
			aria-expanded={showsInstr}
		>
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

			<div className="RecipeCard-ingredientsSection">
				<div
					className="RecipeCard-ingredientsHeader"
					onClick={(e) => {
						e.stopPropagation();
						toggleIng();
					}}
					onKeyDown={onIngredientsKeyDown}
					role="button"
					tabIndex={0}
					aria-expanded={showsIng}
				>
					<div className="RecipeCard-ingredientsLabel">
						{showsIng ? "Ingredients" : "Click to view ingredients"}
					</div>
					<div className="RecipeCard-ingredientsChevron">{showsIng ? "▲" : "▼"}</div>
				</div>

				{showsIng ? (
					<div
						className="RecipeCard-ingredientsBody"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="region"
						aria-label="Recipe ingredients"
					>
						{ingredients.length ? (
							<ul className="RecipeCard-ingredientsList">
								{ingredients.map((item, i) => (
									<li key={i}>{item}</li>
								))}
							</ul>
						) : (
							<div className="RecipeCard-ingredientsEmpty">No ingredients provided.</div>
						)}
					</div>
				) : null}
			</div>

			<div className="RecipeCard-instructionsSection">
				<div className="RecipeCard-instructionsHeader">
					<div className="RecipeCard-instructionsLabel">
						{showsInstr ? "Instructions" : "Click to view instructions"}
					</div>
					<div className="RecipeCard-instructionsChevron">{showsInstr ? "▲" : "▼"}</div>
				</div>

				{showsInstr ? (
					<div
						className="RecipeCard-instructionsBody"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="region"
						aria-label="Recipe instructions"
					>
						{instructions.length ? (
							<ol className="RecipeCard-instructionsList">
								{instructions.map((step, i) => (
									<li key={i}>{step}</li>
								))}
							</ol>
						) : (
							<div className="RecipeCard-instructionsEmpty">No instructions provided.</div>
						)}
					</div>
				) : null}
			</div>
		</div>
	);
};

export default RecipeCard;
