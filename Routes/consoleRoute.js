const express = require('express');
const router = express.Router();
const consoleController = require("../Controllers/consoleController");
const authController = require("../Controllers/authController");

router.route('/').post(authController.validateToken, consoleController.create)
.get(consoleController.getAll);

router.route('/:_id').put(authController.validateToken, consoleController.update)
.delete(authController.validateToken, consoleController.delete)
.get(consoleController.getOne);


module.exports = router;