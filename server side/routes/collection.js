const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middleware/auth');
const { addCollection, getAllCollectionOfAnApp, insertDataInCollection, getDataFromCollection, deleteRecordFromCollection } = require('../controllers/collectionController');

router.route('/:appName/:apiKey').get(isAuthenticatedUser, getAllCollectionOfAnApp)
router.route('/').post(isAuthenticatedUser, addCollection)
router.route('/insert').post(insertDataInCollection)
router.route('/:apiKey/:appName/:collectionName').get(getDataFromCollection)
router.route('/:apiKey/:appName/:collectionName/:recordId').delete(deleteRecordFromCollection)





module.exports = router;