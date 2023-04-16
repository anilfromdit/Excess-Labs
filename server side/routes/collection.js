const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middleware/auth');
const { addCollection, getAllCollectionOfAnApp } = require('../controllers/collectionController');

router.route('/:appName/:apiKey').get(isAuthenticatedUser, getAllCollectionOfAnApp)
router.route('/').put(isAuthenticatedUser, addCollection)






module.exports = router;