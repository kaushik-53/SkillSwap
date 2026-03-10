const express = require('express');
const router = express.Router();
const { getSkills, getMySkills, createSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getSkills);
router.get('/my', protect, getMySkills);
router.post('/', protect, createSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
