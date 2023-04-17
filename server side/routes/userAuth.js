const express = require('express');
const { loginUser, registerUser, updateUser, getUserProfile } = require('../controllers/usersCollectionController');
const router = express.Router();

router.route('/:apiKey/:appName/login').post(loginUser)
router.route('/:apiKey/:appName/register').post(registerUser)
router.route('/:apiKey/:appName/update').put(updateUser)
router.route('/:apiKey/:appName/profile').get(getUserProfile)


module.exports = router;