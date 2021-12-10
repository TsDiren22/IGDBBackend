const express = require('express');
const router = express.Router();
const gameController = require("../Controllers/gameController");

router.route('/').post(gameController.create)
.get(gameController.getAll);

router.route('/:_id').put(gameController.update)
.delete(gameController.delete)
.get(gameController.getOne);


module.exports = router;