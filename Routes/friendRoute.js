const express = require('express')
const router = express.Router()
const authController = require("../Controllers/authController");
const friendsController = require('../Controllers/friendsController');

router
    .route('/')
    .post(authController.validateToken, friendsController.create)
    .get(authController.validateToken, friendsController.read)

module.exports = router