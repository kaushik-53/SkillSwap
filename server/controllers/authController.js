const jwt = require('jsonwebtoken');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const { generateOtp, sendEmailOtp, hashOtp } = require('../utils/otpHelpers');
const bcrypt = require('bcryptjs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password, location, phone } = req.body;

    if (!name || !email || !password || !location || !phone) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.' });
    }

    try {
        const userExists = await User.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (userExists) {
            return res.status(400).json({ message: 'User with this email or phone already exists' });
        }

        const emailOtp = generateOtp();
        const hashedEmailOtp = await hashOtp(emailOtp);

        // Check if there's already a pending user and overwrite it, or create a new one
        let pendingUser = await PendingUser.findOne({ email });
        if (pendingUser) {
            pendingUser.name = name;
            pendingUser.password = password; // Not hashed here - will be hashed when created in the real User model
            pendingUser.location = location;
            pendingUser.phone = phone;
            pendingUser.emailOtp = hashedEmailOtp;
            pendingUser.otpExpiry = Date.now() + 5 * 60 * 1000;
            pendingUser.otpAttempts = 0;
            pendingUser.otpLastSent = Date.now();
            await pendingUser.save();
        } else {
            pendingUser = await PendingUser.create({
                name,
                email,
                password, // Not hashed here
                location,
                phone,
                emailOtp: hashedEmailOtp,
                otpExpiry: Date.now() + 5 * 60 * 1000,
                otpLastSent: Date.now()
            });
        }

        if (pendingUser) {
            // Send OTP via Email
            await sendEmailOtp(email, emailOtp);

            res.status(201).json({
                message: 'OTP sent to your email. Please verify to complete registration.',
                email: pendingUser.email
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User with this email or phone already exists' });
        }
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ 
                    message: 'Please verify your account first.',
                    requiresVerification: true,
                    email: user.email,
                    maskedPhone: user.phone.replace(/.(?=.{4})/g, '*')
                });
            }

            const userData = user.toObject();
            delete userData.password;
            
            res.json({
                ...userData,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.status(200).json(user);
    } catch (error) {
       res.status(500).json({message: error.message});
    }
};

// @desc    Google login/register
// @route   POST /api/auth/google
const googleLogin = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    console.log('Google Login Attempt with token starting with:', token.substring(0, 10));

    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const { email } = response.data;

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: 'Please register first with email and phone.' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ 
                message: 'Complete OTP verification first.',
                requiresVerification: true,
                email: user.email,
                maskedPhone: user.phone.replace(/.(?=.{4})/g, '*')
            });
        }

        const userData = user.toObject();
        delete userData.password;

        res.json({
            ...userData,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ message: error.message || 'Google authentication failed' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { email, emailOtp } = req.body;

    try {
        const pendingUser = await PendingUser.findOne({ email });

        if (!pendingUser) {
            return res.status(404).json({ message: 'No pending registration found for this email. Please register again.' });
        }

        if (pendingUser.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'OTPs have expired' });
        }

        if (pendingUser.otpAttempts >= 3) {
            return res.status(400).json({ message: 'Too many failed attempts. Please resend OTPs.' });
        }

        const isEmailMatch = await bcrypt.compare(emailOtp, pendingUser.emailOtp);

        if (!isEmailMatch) {
            pendingUser.otpAttempts += 1;
            await pendingUser.save();
            
            return res.status(400).json({ message: 'Invalid Email OTP' });
        }

        // OTP verified successfully. Now create the actual User.
        const user = await User.create({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password, // Pre-save hook in User model will hash this
            location: pendingUser.location,
            phone: pendingUser.phone,
            isVerified: true,
            isEmailVerified: true
        });

        // Delete the pending user record
        await pendingUser.deleteOne();

        const userData = user.toObject();
        delete userData.password;

        res.json({
            ...userData,
            token: generateToken(user._id),
            message: 'Account verified successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const pendingUser = await PendingUser.findOne({ email });

        if (!pendingUser) {
            return res.status(404).json({ message: 'No pending registration found for this email.' });
        }

        const timeSinceLastSent = Date.now() - new Date(pendingUser.otpLastSent).getTime();
        if (timeSinceLastSent < 60 * 1000) {
            return res.status(400).json({ message: `Please wait ${Math.ceil((60 * 1000 - timeSinceLastSent) / 1000)} seconds before resending.` });
        }

        const emailOtp = generateOtp();
        const hashedEmailOtp = await hashOtp(emailOtp);

        pendingUser.emailOtp = hashedEmailOtp;
        pendingUser.otpExpiry = Date.now() + 5 * 60 * 1000;
        pendingUser.otpAttempts = 0;
        pendingUser.otpLastSent = Date.now();
        await pendingUser.save();

        await sendEmailOtp(pendingUser.email, emailOtp);

        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/auth/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        const otp = generateOtp();
        const hashedOtp = await hashOtp(otp);

        user.resetPasswordOtp = hashedOtp;
        user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await sendEmailOtp(user.email, otp);

        res.json({ message: 'Password reset OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.resetPasswordOtp || user.resetPasswordExpiry < Date.now()) {
            return res.status(400).json({ message: 'Reset OTP has expired' });
        }

        const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Reset OTP' });
        }

        // Salt and hash the new password (handled by pre-save hook, but let's be explicit if needed)
        // Actually the pre-save hook in User.js handles hashing when 'password' is modified.
        user.password = newPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user) {
            user.name = req.body.name || user.name;
            user.location = req.body.location || user.location;
            if (req.body.about !== undefined) user.bio = req.body.about;
            if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
            if (req.body.skillsWanted !== undefined) user.skillsWanted = req.body.skillsWanted;
            
            const updatedUser = await user.save();
            
            const userData = updatedUser.toObject();
            delete userData.password;

            res.json(userData);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Request OTP for account deletion
// @route   POST /api/auth/profile/request-delete
// @access  Private
const requestDeleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const emailOtp = generateOtp();
        const hashedEmailOtp = await hashOtp(emailOtp);

        user.emailOtp = hashedEmailOtp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes validity
        user.otpLastSent = Date.now();
        await user.save();

        await sendEmailOtp(user.email, emailOtp);

        res.json({ message: 'OTP sent to your email to confirm account deletion' });
    } catch (error) {
        console.error('Request Delete Account Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Delete user account and associated data
// @route   DELETE /api/auth/profile
// @access  Private
const deleteAccount = async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).json({ message: 'OTP is required to confirm account deletion' });
    }

    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.emailOtp || !user.otpExpiry) {
            return res.status(400).json({ message: 'Please request a deletion OTP first' });
        }

        if (Date.now() > user.otpExpiry) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one' });
        }

        const isMatch = await bcrypt.compare(otp.toString(), user.emailOtp);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const fs = require('fs');
        const path = require('path');
        const Skill = require('../models/Skill');
        const Request = require('../models/Request');
        const Review = require('../models/Review');

        // 1. Delete all skills owned by this user
        await Skill.deleteMany({ owner: user._id });

        // 2. Delete all swap requests where this user is sender or receiver
        await Request.deleteMany({ $or: [{ sender: user._id }, { receiver: user._id }] });

        // 3. Delete all reviews written by or about this user
        await Review.deleteMany({ $or: [{ reviewer: user._id }, { reviewee: user._id }] });

        // 4. Delete uploaded avatar file from disk (if it's a local upload)
        if (user.avatar && user.avatar.startsWith('/uploads/')) {
            const avatarPath = path.join(__dirname, '..', user.avatar);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        }

        // 5. Delete the user record itself
        await user.deleteOne();

        res.json({ message: 'Account and all associated data have been permanently deleted.' });
    } catch (error) {
        console.error('Delete Account Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getMe,
    googleLogin,
    getUserById,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    updateProfile,
    deleteAccount,
    requestDeleteAccount
};

