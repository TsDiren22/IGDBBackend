const mongoose = require("mongoose");

const express = require("express");
const port = process.env.PORT || 3000;

const gameRoutes = require("./Routes/gameRoute");
const studioRoutes = require("./Routes/studioRoute");
const consoleRoutes = require("./Routes/consoleRoute");
const authRoutes = require("./Routes/authRoute");

const app = express();

// Setting up default mongoose connection
var mongoDB =
  "mongodb+srv://TsDiren21:hevat100111@cluster0.pybc8.mongodb.net/IGDB?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const logger = require("tracer").console();
app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// logger
app.all("*", (req, res, next) => {
  logger.log("Endpoint called: " + req.method + " " + req.url);
  next();
});

app.use("/api/games", gameRoutes);
app.use("/api/studios", studioRoutes);
app.use("/api/consoles", consoleRoutes);
app.use("/api", authRoutes);

// Catch all endpoint
app.all("*", (req, res, next) => {
  logger.log("catch-all endpoint called");
  next({ message: "Endpoint does not exist", errorCode: 401 });
});

// Error handler
app.use("*", (error, req, res, next) => {
  logger.log("Errorhandler called!", error);

  res.status(error.errorCode).json({
    error: "Some error occured",
    message: error.message,
  });
});

app.listen(port, () => {
  logger.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
