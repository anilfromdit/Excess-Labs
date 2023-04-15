const express = require('express');
const router = express.Router();
const { loginUser, registerUser, logoutUser } = require('../controllers/usersController')

router.route('/login').post(loginUser)

router.route('/register').post(registerUser)

router.route("/logout").get(logoutUser)




module.exports = router;