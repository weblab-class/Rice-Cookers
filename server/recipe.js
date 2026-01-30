const express = require("express");
const mongoose = require("mongoose");

const auth = require("./auth");
const Recipe = require("./models/recipe");

const router = express.Router();

const BUCKET_NAME = "recipeImages";

// 4MB raw image cap (base64 will be larger in transit)
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

let bucket = null;

const getBucket = () => {
  if (bucket) return bucket;

  if (!mongoose.connection || !mongoose.connection.db) {
    return null;
  }

  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME });
  return bucket;
};

const parseLinesToArray = (s) => {
  if (typeof s !== "string") return [];
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
};

const parseTags = (s) => {
  if (typeof s !== "string") return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
};

const toNonnegInt = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n);
};

// GET /api/recipe
router.get("/", async (req, res) => {
  try {
    const recipe = await Recipe.find({}).sort({ createdAt: -1 }).limit(200);
    return res.send(recipe);
  } catch (err) {
    console.log("List recipes error:", err);
    return res.status(500).send({ msg: "Server error fetching recipes" });
  }
});

router.get("/mine", auth.ensureLoggedIn, async (req, res) => {
	try {
		const recipes = await Recipe.find({ author: req.user._id })
			.sort({ createdAt: -1 });

		res.send(recipes);
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: "server error" });
	}
});

// POST /api/recipe (Create new recipe)
router.post("/", auth.ensureLoggedIn, async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      tags,
      image, // base64 string
    } = req.body;

    const newRecipe = new Recipe({
      title,
      author: req.user._id,
      authorName: req.user.name,
      description,
      ingredients: parseLinesToArray(ingredients),
      instructions: parseLinesToArray(instructions),
      prepTimeMinutes: toNonnegInt(prepTimeMinutes),
      cookTimeMinutes: toNonnegInt(cookTimeMinutes),
      servings: toNonnegInt(servings),
      tags: parseTags(tags),
    });

    // Handle Image Upload to GridFS if provided
    if (image && typeof image === "string") {
      // Basic base64 regex check
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const contentType = matches[1];
        const b64Data = matches[2];
        const buffer = Buffer.from(b64Data, "base64");

        if (buffer.length > MAX_IMAGE_BYTES) {
            return res.status(413).send({ msg: "Image too large" });
        }

        const bucket = getBucket();
        const uploadStream = bucket.openUploadStream(title + "-" + Date.now(), {
          metadata: { contentType },
        });

        // Write buffer to GridFS
        await new Promise((resolve, reject) => {
          uploadStream.end(buffer, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        // Save file reference to the recipe document
        newRecipe.imageFileId = uploadStream.id;
        newRecipe.imageContentType = contentType;
        // This is the URL the frontend will use to fetch the image
        newRecipe.image = `/api/recipe/image/${uploadStream.id}`;
      }
    }

    const savedRecipe = await newRecipe.save();
    res.send(savedRecipe);
  } catch (err) {
    console.log("Create recipe error:", err);
    res.status(500).send({ msg: "Failed to create recipe" });
  }
});

router.post("/delete", auth.ensureLoggedIn, async (req, res) => {
	try {
		const { recipeId } = req.body;

		if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
			return res.status(400).send({ err: "invalid recipeId" });
		}

		const deleted = await Recipe.findOneAndDelete({
			_id: recipeId,
			author: req.user._id,
		});

		if (!deleted) {
			// Either doesn't exist or user doesn't own it
			return res.status(404).send({ err: "recipe not found" });
		}

		res.send({ ok: true });
	} catch (e) {
		console.error(e);
		res.status(500).send({ err: "server error" });
	}
});

// GET /api/recipe/:id
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).send({ msg: "Recipe not found" });
    return res.send(recipe);
  } catch (err) {
    console.log("Get recipe error:", err);
    return res.status(500).send({ msg: "Server error fetching recipe" });
  }
});

// GET /api/recipe/image/:fileId  (streams from GridFS)
router.get("/image/:fileId", async (req, res) => {
  try {
    const b = getBucket();
    if (!b) return res.status(500).send({ msg: "Image store not initialized" });

    const fileId = new mongoose.Types.ObjectId(String(req.params.fileId));

    const files = await b.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) return res.status(404).send({ msg: "Image not found" });

    const file = files[0];
    if (file.metadata && file.metadata.contentType) {
      res.set("Content-Type", file.metadata.contentType);
    }

    const downloadStream = b.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (err) {
    console.log("Stream image error:", err);
    res.status(500).send({ msg: "Server error streaming image" });
  }
});

module.exports = router;
