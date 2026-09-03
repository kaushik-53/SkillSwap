const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getWalletBalance,
    submitUTR,
    confirmReceipt,
    settleSkillCredits
} = require('../controllers/paymentController');

// Wallet
router.get('/balance', protect, getWalletBalance);

// UPI payment flow
router.post('/submit-utr', protect, submitUTR);
router.post('/confirm-receipt', protect, confirmReceipt);

// SkillCredits settlement
router.post('/settle-credits', protect, settleSkillCredits);

module.exports = router;
