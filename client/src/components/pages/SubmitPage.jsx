import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../App";
import { post } from "../../utilities"; // <--- CRITICAL IMPORT
import "./SubmitPage.css";

// Helper to convert image files to Base64 strings
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
};

const SubmitPage = () => {
  const navigate = useNavigate();
  const { userId } = useContext(UserContext);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("");
  const [cookTimeMinutes, setCookTimeMinutes] = useState("");
  const [servings, setServings] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // UI State
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("You must be logged in to submit a recipe.");
      return;
    }

    if (!title || !ingredients || !instructions) {
      setError("Please fill out all required fields (Title, Ingredients, Instructions).");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Process Image
      let imageBase64 = "";
      if (imageFile) {
        // Simple check to prevent sending massive files that crash the request
        if (imageFile.size > 5 * 1024 * 1024) {
             throw new Error("Image too large (max 5MB)");
        }
        imageBase64 = await fileToBase64(imageFile);
      }

      // 2. Prepare Payload
      const body = {
        title,
        description,
        ingredients, // The backend handles splitting this string into an array
        instructions, // The backend handles splitting this string into an array
        prepTimeMinutes: prepTimeMinutes || 0,
        cookTimeMinutes: cookTimeMinutes || 0,
        servings: servings || 0,
        tags,
        image: imageBase64,
      };

      // 3. Send to Backend
      // NOTE: Ensure your backend "post" route is defined in server/recipe.js
      await post("/api/recipe", body);

      // 4. Success! Redirect home.
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit recipe. Server error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="SubmitRecipePage">
      <div className="SubmitRecipePage-card">
        <h1 className="SubmitRecipePage-title">Submit a New Recipe</h1>

        {error && <div className="SubmitRecipePage-error">{error}</div>}

        <form className="SubmitRecipePage-form" onSubmit={onSubmit}>
          {/* Title */}
          <label className="SubmitRecipePage-label">
            Title (required)
            <input
              className="SubmitRecipePage-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grandma's Apple Pie"
              required
            />
          </label>

          {/* Description */}
          <label className="SubmitRecipePage-label">
            Short Description
            <input
              className="SubmitRecipePage-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A sweet and savory delight..."
            />
          </label>

          {/* Image Upload */}
          <label className="SubmitRecipePage-label">
            Image
            <input
              type="file"
              accept="image/*"
              className="SubmitRecipePage-input"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            />
          </label>

          {/* Metadata Row */}
          <div className="SubmitRecipePage-row">
            <label className="SubmitRecipePage-label">
              Prep Time (min)
              <input
                type="number"
                className="SubmitRecipePage-input"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(e.target.value)}
                placeholder="0"
              />
            </label>
            <label className="SubmitRecipePage-label">
              Cook Time (min)
              <input
                type="number"
                className="SubmitRecipePage-input"
                value={cookTimeMinutes}
                onChange={(e) => setCookTimeMinutes(e.target.value)}
                placeholder="0"
              />
            </label>
            <label className="SubmitRecipePage-label">
              Servings
              <input
                type="number"
                className="SubmitRecipePage-input"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="0"
              />
            </label>
          </div>

          {/* Ingredients */}
          <label className="SubmitRecipePage-label">
            Ingredients (one per line)
            <textarea
              className="SubmitRecipePage-textarea"
              rows={5}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder={"2 cups flour\n1 cup sugar\n..."}
              required
            />
          </label>

          {/* Instructions */}
          <label className="SubmitRecipePage-label">
            Instructions (one per line)
            <textarea
              className="SubmitRecipePage-textarea"
              rows={5}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={"Mix dry ingredients\nAdd wet ingredients\nBake at 350F"}
              required
            />
          </label>

          {/* Tags */}
          <label className="SubmitRecipePage-label">
            Tags (comma separated)
            <input
              className="SubmitRecipePage-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="dessert, fruit, vegan"
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="SubmitRecipePage-button"
            disabled={submitting}
            style={{
              marginTop: "10px",
              padding: "12px",
              background: "#d28b4b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {submitting ? "Submitting..." : "Submit Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
};

// <--- THIS EXPORT IS MANDATORY
export default SubmitPage;
