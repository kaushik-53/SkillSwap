const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pendingUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    emailOtp: { type: String, required: true },
    otpExpiry: { type: Date, required: true },
    otpAttempts: { type: Number, default: 0 },
    otpLastSent: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 } // documents auto-delete after 1 hour (3600s)
}, {
    timestamps: true
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
