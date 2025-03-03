const express = require('express');
const router = express.Router();
const {
    saveMeasurements,
    getLatestResults,
    getHistoryOfResults,
    deleteMeasurement,
} = require('../controllers/measurementController');

// Define the routes and their handlers
router.post('/', saveMeasurements);
router.get('/latest', getLatestResults);
router.get('/history', getHistoryOfResults);
router.delete('/:id', deleteMeasurement);

module.exports = router;