const mongoose = require('mongoose');

/**
 * Transaction — double-entry ledger for both SkillCredits and UPI payments.
 * Every value transfer (virtual or real) creates a permanent record here.
 */
const transactionSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    type: {
        type: String,
        enum: ['SkillCredit', 'UPI_Payment'],
        required: true
    },
    // For SkillCredits: count of credits transferred
    // For UPI_Payment: amount in ₹
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Verified', 'Disputed'],
        default: 'Pending'
    },
    // UPI-specific fields
    upiId: {
        type: String,  // Mentor's UPI VPA used for this transaction
        default: ''
    },
    utrNumber: {
        type: String,  // 12-digit NPCI UTR reference number provided by student
        default: ''
    },
    paidAt: {
        type: Date    // When student submitted the UTR
    },
    verifiedAt: {
        type: Date    // When mentor confirmed receipt
    },
    note: {
        type: String, // e.g. "Session payment for React tutoring"
        default: ''
    }
}, { timestamps: true });

// Index for fast per-user ledger lookups
transactionSchema.index({ fromUser: 1, createdAt: -1 });
transactionSchema.index({ toUser: 1, createdAt: -1 });
transactionSchema.index({ request: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
