/*
|--------------------------------------------------------------------------
| server.js -- The core of your server
|--------------------------------------------------------------------------
|
| This file defines how your server starts up. Think of it as the main() of your server.
| At a high level, this file does the following things:
| - Connect to the database
| - Sets up server middleware (i.e. addons that enable things like json parsing, user login)
| - Hooks up all the backend routes specified in api.js
| - Forwards frontend routes that should be handled by the React router
| - Sets up error handling in case something goes wrong when handling a request
| - Actually starts the webserver
*/

const validator = require("./validator");
validator.checkSetup();

require("dotenv").config();

const http = require("http");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");

const api = require("./api");
const auth = require("./auth");

// socket stuff
const socketManager = require("./server-socket");

// Server configuration below
const mongoConnectionURL = "mongodb+srv://ajw1434:Shr1mpFri3dR1c3@cluster0.hj38djq.mongodb.net/?appName=Cluster0";
const databaseName = "Cluster0";

mongoose.set("strictQuery", false);

mongoose
	.connect(mongoConnectionURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: databaseName,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

const app = express();
app.use(validator.checkRoutes);

// JSON body (needed for base64 image uploads if you use that approach)
app.use(express.json({ limit: "10mb" }));

app.use(
	session({
		secret: "session-secret",
		resave: false,
		saveUninitialized: false,
	})
);

app.use(auth.populateCurrentUser);

// API routes
app.use("/api", api);

// Serve the Vite build output from client/dist
const reactPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(reactPath));


// SPA fallback: any non-API route should serve index.html so React Router can handle it
app.get("*", (req, res) => {
	res.sendFile(path.join(reactPath, "index.html"), (err) => {
		if (err) {
			console.log("Error sending client/dist/index.html:", err.status || 500);
			res
				.status(err.status || 500)
				.send("Error sending client/dist/index.html - have you run `npm run build` in /client?");
		}
	});
});

// Error handler
app.use((err, req, res, next) => {
	const status = err.status || 500;
	if (status === 500) {
		console.log("The server errored when processing a request!");
		console.log(err);
	}

	res.status(status).send({
		status,
		message: err.message,
	});
});

// Start server
const port = 3000;
const server = http.Server(app);
socketManager.init(server);

server.listen(port, () => {
	console.log(`Server running on port: ${port}`);
});
