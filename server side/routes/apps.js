const express = require('express');
const router = express.Router();
const { myApps, createApp } = require('../controllers/appsController');
const { isAuthenticatedUser } = require('../middleware/auth');

router.route('/').get(isAuthenticatedUser, myApps)

router.route('/').post(isAuthenticatedUser, createApp)





module.exports = router;