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
	const [isOpen, setIsOpen] = useState(false);

	const instructions = useMemo(() => normalizeLines(recipe?.instructions), [recipe?.instructions]);

	const toggleOpen = () => {
		setIsOpen((prev) => !prev);
	};

	const onKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			toggleOpen();
		}
	};

	return (
		<div
			className={`RecipeCard ${isOpen ? "RecipeCard--open" : ""}`}
			onClick={toggleOpen}
			onKeyDown={onKeyDown}
			role="button"
			tabIndex={0}
			aria-expanded={isOpen}
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

			<div className="RecipeCard-instructionsSection">
				<div className="RecipeCard-instructionsHeader">
					<div className="RecipeCard-instructionsLabel">
						{isOpen ? "Instructions" : "Click to view instructions"}
					</div>
					<div className="RecipeCard-instructionsChevron">{isOpen ? "▲" : "▼"}</div>
				</div>

				{isOpen ? (
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
