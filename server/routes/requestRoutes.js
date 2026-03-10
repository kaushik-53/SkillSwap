const express = require('express');
const router = express.Router();
const { sendRequest, getRequests, updateRequestStatus, getRequestById } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendRequest);
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequestById);
router.put('/:id', protect, updateRequestStatus);

module.exports = router;
