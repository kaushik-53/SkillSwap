const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending'
    },
    // Tracks which users have clicked "Mark Complete" — only marked Completed when both have
    completedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // ── Exchange Economy ──────────────────────────────────
    // How both parties agreed to settle this swap
    exchangeType: {
        type: String,
        enum: ['SkillSwap', 'SkillCredits', 'PaidUPI'],
        default: 'SkillSwap'
    },
    // Amount agreed for this session:
    //   For SkillSwap: always 0
    //   For SkillCredits: number of credits (usually 1)
    //   For PaidUPI: amount in ₹
    agreedAmount: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['NotRequired', 'Pending', 'PaidByStudent', 'Settled'],
        default: 'NotRequired'
    },
    paymentDetails: {
        upiId: { type: String, default: '' },       // Mentor's UPI VPA
        utrNumber: { type: String, default: '' },   // Student's UTR reference
        paidAt: { type: Date },
        rejectionNote: { type: String, default: '' } // Reason if mentor rejected UTR
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);

