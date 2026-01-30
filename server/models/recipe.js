const mongoose = require("mongoose");
const { Schema } = mongoose;

const RecipeSchema = new Schema(
	{
		title: { type: String, required: true, trim: true, maxlength: 200 },

		author: { type: Schema.Types.ObjectId, ref: "user", required: true, index: true },
		authorName: { type: String, required: true, trim: true, maxlength: 120 },

		description: { type: String, trim: true, default: "", maxlength: 2000 },

		ingredients: {
			type: [String],
			required: true,
			validate: [(v) => Array.isArray(v) && v.length > 0, "At least one ingredient is required."],
		},
		instructions: {
			type: [String],
			required: true,
			validate: [(v) => Array.isArray(v) && v.length > 0, "At least one instruction step is required."],
		},

		prepTimeMinutes: { type: Number, min: 0, default: 0 },
		cookTimeMinutes: { type: Number, min: 0, default: 0 },
		servings: { type: Number, min: 0, default: 0 },
		tags: { type: [String], default: [] },

		image: { type: String, trim: true, default: "" },
		imageFileId: { type: Schema.Types.ObjectId, default: null },
		imageContentType: { type: String, default: "" },

		ratingSum: { type: Number, default: 0, min: 0 },
		ratingCount: { type: Number, default: 0, min: 0 },
		avgRating: { type: Number, default: 0, min: 0, max: 5 },

		timeRatingSum: { type: Number, default: 0, min: 0 },
		timeRatingCount: { type: Number, default: 0, min: 0 },
		timeRating: { type: Number, default: 0, min: 0, max: 3 },
	},
	{ timestamps: true }
);

RecipeSchema.pre("save", function (next) {
	this.avgRating = this.ratingCount > 0 ? this.ratingSum / this.ratingCount : 0;
	this.timeRating = this.timeRatingCount > 0 ? this.timeRatingSum / this.timeRatingCount : 0;
	next();
});

RecipeSchema.index({ avgRating: -1, ratingCount: -1, createdAt: -1 });

module.exports = mongoose.model("recipe", RecipeSchema);
