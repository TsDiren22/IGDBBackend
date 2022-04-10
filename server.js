require("dotenv").config();
const connect = require("./connect");

const express = require("express");
const port = process.env.PORT || 3000;

const gameRoutes = require("./Routes/gameRoute");
const studioRoutes = require("./Routes/studioRoute");
const consoleRoutes = require("./Routes/consoleRoute");
const authRoutes = require("./Routes/authRoute");
const friendRoute = require("./Routes/friendRoute");

const app = express();

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
app.use("/api/friends", friendRoute);
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

connect.mongo(process.env.MONGO_PROD_DB);
connect.neo(process.env.NEO4J_PROD_DB);

module.exports = app;
