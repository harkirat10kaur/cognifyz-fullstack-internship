const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.get('/', feedbackController.getIndex);
router.post('/submit', feedbackController.postFeedback);

module.exports = router;