const express = require('express');
const router = express.Router();
const consoleController = require("../Controllers/consoleController");

router.route('/').post(consoleController.create)
.get(consoleController.getAll);

router.route('/:_id').put(consoleController.update)
.delete(consoleController.delete)
.get(consoleController.getOne);


module.exports = router;