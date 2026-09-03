const express = require('express');
const router = express.Router();
const { sendRequest, getRequests, updateRequestStatus, getRequestById, markComplete } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendRequest);
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequestById);
router.put('/:id', protect, updateRequestStatus);
router.post('/:id/complete', protect, markComplete);

module.exports = router;
