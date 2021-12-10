const express = require('express');
const router = express.Router();
const studioController = require("../Controllers/studioController");

router.route('/').post(studioController.create)
.get(studioController.getAll);

router.route('/:_id').put(studioController.update)
.delete(studioController.delete)
.get(studioController.getOne);


module.exports = router;