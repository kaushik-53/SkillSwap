const express = require('express');
const router = express.Router();
const { createReview, checkReviewStatus, getUserReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/check/:requestId', protect, checkReviewStatus);
router.get('/user/:userId', getUserReviews);

module.exports = router;
