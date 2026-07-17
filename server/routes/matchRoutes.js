const express = require('express');
const router = express.Router();
const { findCircularMatches } = require('../utils/matchingEngine');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get circular and direct swap match recommendations for current user
// @route   GET /api/skills/matches
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const matches = await findCircularMatches(req.user.id);
        res.json(matches);
    } catch (error) {
        console.error('Error in circular matching route:', error);
        res.status(500).json({ message: 'Server error retrieving match suggestions' });
    }
});

module.exports = router;
