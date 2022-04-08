const express = require('express');
const router = express.Router();
const studioController = require("../Controllers/studioController");
const authController = require("../Controllers/authController");

router.route('/').post(authController.validateToken, studioController.create)
.get(studioController.getAll);

router.route('/:_id').put(authController.validateToken, studioController.update)
.delete(authController.validateToken, studioController.delete)
.get(studioController.getOne);


module.exports = router;