const express = require('express');
const router = express.Router();
const { loginUser, registerUser, logoutUser, getUserProfile } = require('../controllers/usersController');
const { isAuthenticatedUser } = require('../middleware/auth');

router.route('/login').post(loginUser)

router.route('/register').post(registerUser)

router.route("/logout").get(logoutUser)

router.route("/profile").get(isAuthenticatedUser, getUserProfile);


module.exports = router;