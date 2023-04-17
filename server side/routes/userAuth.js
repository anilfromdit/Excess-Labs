const express = require('express');
const { loginUser, registerUser } = require('../controllers/usersCollectionController');
const router = express.Router();

router.route('/:apiKey/:appName/login').post(loginUser)
router.route('/:apiKey/:appName/register').post(registerUser)


module.exports = router;