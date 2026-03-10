const Review = require('../models/Review');
const Request = require('../models/Request');
const User = require('../models/User');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    const { requestId, rating, comment } = req.body;

    try {
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request/Session not found' });
        }

        // Only the original requester (sender) can leave a review for the skill owner (receiver)
        if (request.sender.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Only the requester can leave a review' });
        }

        if (request.status !== 'Completed') {
            return res.status(400).json({ message: 'Can only review after the session is marked Completed by both parties' });
        }

        // The reviewee is always the receiver (skill owner)
        const revieweeId = request.receiver;

        // Check if review already exists
        const existingReview = await Review.findOne({
            reviewer: req.user.id,
            request: requestId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this session' });
        }

        const review = await Review.create({
            reviewer: req.user.id,
            reviewee: revieweeId,
            request: requestId,
            rating: Number(rating),
            comment
        });

        // Update the skill owner's global rating
        const reviewee = await User.findById(revieweeId);
        if (reviewee) {
            const numReviews = reviewee.reviewsCount + 1;
            const newRating = ((reviewee.rating * reviewee.reviewsCount) + Number(rating)) / numReviews;

            reviewee.rating = parseFloat(newRating.toFixed(2));
            reviewee.reviewsCount = numReviews;
            await reviewee.save();
        }

        // Populate the reviewer for the frontend to use immediately
        const populatedReview = await review.populate('reviewer', 'name avatar');

        res.status(201).json(populatedReview);
    } catch (error) {
        if (error.code === 11000) {
           return res.status(400).json({ message: 'You have already reviewed this session' });
        }
        res.status(500).json({ message: error.message });
    }
};


// @desc    Check if current user has reviewed a specific request
// @route   GET /api/reviews/check/:requestId
// @access  Private
const checkReviewStatus = async (req, res) => {
    try {
        const review = await Review.findOne({
            reviewer: req.user.id,
            request: req.params.requestId
        });

        res.status(200).json({ hasReviewed: !!review, review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name avatar')
            .sort('-createdAt');
            
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    checkReviewStatus,
    getUserReviews
};
