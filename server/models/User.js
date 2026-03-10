const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String, // Simplified for now (e.g., "Downtown")
        required: true
    },
    avatar: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        trim: true
    },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    phone: {
        type: String,
        unique: true,
        trim: true,
        sparse: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailOtp: {
        type: String
    },
    resetPasswordOtp: {
        type: String
    },
    resetPasswordExpiry: {
        type: Date
    },
    otpExpiry: {
        type: Date
    },
    otpAttempts: {
        type: Number,
        default: 0
    },
    otpLastSent: {
        type: Date
    },
    googleId: {
        type: String,
        unique: false
    },
    skillsWanted: [{
        title: String,
        description: String,
        tags: [String]
    }],
    rating: {
        type: Number,
        default: 0
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
