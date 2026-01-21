import React, { useMemo } from "react";
import RecipeList from "../modules/RecipeList";
import "./HomePage.css";

const HomePage = () => {
  // Hardcoded recipes for now (later replace with API fetch)
    const recipes = useMemo(() => [
    {
        _id: "water",
        title: "Water",
        authorName: "Anonymous",
        timeRating: 1,     // 1–3 clocks
        avgRating: 5,      // 0–5 stars
        image: "/images/water.png", // put in /public/images
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
    ], []);

    // “Top rated” sort (desc). For ties you can keep original order.
    const topRated = [...recipes].sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
    return (
        <div className="HomePage">
        <h2 className="HomePage-title">Top Rated Recipes</h2>
        <RecipeList recipes={topRated} />
        </div>
    );
};

export default HomePage;
