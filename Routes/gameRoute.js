const express = require("express");
const router = express.Router();
const gameController = require("../Controllers/gameController");
const authController = require("../Controllers/authController");

router
  .route("/")
  .post(authController.validateToken, gameController.create)
  .get(gameController.getAll);

router
  .route("/:_id")
  .put(authController.validateToken, gameController.update)
  .delete(authController.validateToken, gameController.delete)
  .get(gameController.getOne);

module.exports = router;
