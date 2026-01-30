import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../App";
import { post } from "../../utilities";
import "./SubmitPage.css";

// image conversion to b64 strings
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
      // save image
      let imageBase64 = "";
      if (imageFile) {
        // prevent large file sizes so mongoose stays happy
        if (imageFile.size > 5 * 1024 * 1024) {
             throw new Error("Image too large (max 5MB)");
        }
        imageBase64 = await fileToBase64(imageFile);
      }

      const body = {
        title,
        description,
        ingredients,
        instructions,
        prepTimeMinutes: prepTimeMinutes || 0,
        cookTimeMinutes: cookTimeMinutes || 0,
        servings: servings || 0,
        tags,
        image: imageBase64,
      };

      //post recipe
      await post("/api/recipe", body);

      //home redirect
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
          {/* title */}
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

          {/* desc */}
          <label className="SubmitRecipePage-label">
            Short Description
            <input
              className="SubmitRecipePage-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A sweet and savory delight..."
            />
          </label>

          {/* image upload */}
          <label className="SubmitRecipePage-label">
            Image
            <input
              type="file"
              accept="image/*"
              className="SubmitRecipePage-input"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            />
          </label>

          {/* misc. data */}
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

          {/* ingredients */}
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

          {/* instructions */}
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

          {/* tags */}
          <label className="SubmitRecipePage-label">
            Tags (comma separated)
            <input
              className="SubmitRecipePage-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="dessert, fruit, vegan"
            />
          </label>

          {/* submit */}
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


export default SubmitPage;
