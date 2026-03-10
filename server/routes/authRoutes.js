const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, googleLogin, getUserById, verifyOtp, resendOtp, forgotPassword, resetPassword, updateProfile, deleteAccount, requestDeleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/profile/request-delete', protect, requestDeleteAccount);
router.delete('/profile', protect, deleteAccount);
router.get('/:id', protect, getUserById);

module.exports = router;
