const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middleware/auth');
const { addCollection } = require('../controllers/collectionController');

router.route('/').put(isAuthenticatedUser, addCollection)






module.exports = router;