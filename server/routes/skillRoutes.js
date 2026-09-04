const express = require('express');
const router = express.Router();
const { getSkills, getMySkills, createSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

const { findCircularMatches } = require('../utils/matchingEngine');

router.get('/', getSkills);
router.get('/matches', protect, async (req, res) => {
    try {
        const matches = await findCircularMatches(req.user.id);
        res.json(matches);
    } catch (error) {
        console.error('Error in circular matching route:', error);
        res.status(500).json({ message: 'Server error retrieving match suggestions' });
    }
});
router.get('/my', protect, getMySkills);
router.post('/', protect, createSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
