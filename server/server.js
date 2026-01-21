/*
|--------------------------------------------------------------------------
| server.js -- The core of your server
|--------------------------------------------------------------------------
|
| Responsibilities:
| - Load environment variables
| - Connect to MongoDB
| - Configure Express middleware (JSON parsing, sessions, auth)
| - Mount API routes
| - Serve built frontend (Vite build output) in production
| - Initialize Socket.IO on the same HTTP server
| - Start listening on Render-provided PORT
*/

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const http = require("http");

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

const validator = require("./validator");
const api = require("./api");
const auth = require("./auth");
const socketManager = require("./server-socket");

validator.checkSetup();

const app = express();

// Render (and similar hosts) sit behind a proxy. This avoids issues with secure cookies if you enable them later.
app.set("trust proxy", 1);

// Allow Base64 image payloads (adjust if needed).
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
	session({
		secret: process.env.SESSION_SECRET || "session-secret",
		resave: false,
		saveUninitialized: false,
	})
);

// --------------------
// Database connection
// --------------------
const mongoUri =
	process.env.MONGODB_URI ||
	process.env.MONGODB_URL ||
	process.env.mongodb_url ||
	process.env.mongodb_uri;

if (!mongoUri) {
	console.error("Missing MongoDB connection string.");
	console.error("Set MONGODB_URI in your environment (Render Environment page) or in a local .env file.");
	process.exit(1);
}

mongoose
	.connect(mongoUri)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.error("Mongo connection error:", err);
		process.exit(1);
	});

// --------------------
// Auth + API routes
// --------------------
app.use(auth.populateCurrentUser);
app.use("/api", api);

// --------------------
// Serve frontend build (production)
// --------------------
// We try common output locations depending on how Vite is configured in your skeleton.
const candidateDistDirs = [
	path.resolve(__dirname, "..", "dist"),
	path.resolve(__dirname, "..", "client", "dist"),
	path.resolve(__dirname, "dist"),
];

const distDir = candidateDistDirs.find((p) => fs.existsSync(p) && fs.existsSync(path.join(p, "index.html")));

if (distDir) {
	app.use(express.static(distDir));

	// SPA fallback: any non-API GET should serve index.html so React Router can handle it.
	app.get("*", (req, res, next) => {
		if (req.path.startsWith("/api")) {
			return next();
		}

		return res.sendFile(path.join(distDir, "index.html"));
	});
} else {
	console.log("No frontend build directory found. This is expected in local dev if you run Vite separately.");
}

// --------------------
// Error handling
// --------------------
app.use((err, req, res, next) => {
	console.error("Unhandled server error:", err);
	const status = err.status || 500;
	res.status(status).send({
		status,
		message: err.message || "server error",
	});
});

// --------------------
// Start server + Socket.IO
// --------------------
const port = process.env.PORT || 3000;
const server = http.Server(app);
socketManager.init(server);

server.listen(port, () => {
	console.log(`Server running on port: ${port}`);
});
