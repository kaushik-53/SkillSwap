const User = require('../models/User');
const Request = require('../models/Request');
const Transaction = require('../models/Transaction');

/**
 * GET /api/wallet/balance
 * Returns current user's SkillCredits balance and their recent transaction history.
 */
const getWalletBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('skillCredits name upiId hourlyRate');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Last 20 transactions involving this user
        const transactions = await Transaction.find({
            $or: [{ fromUser: req.user.id }, { toUser: req.user.id }]
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('fromUser', 'name avatar')
            .populate('toUser', 'name avatar')
            .populate('request', 'skill exchangeType');

        res.json({
            balance: user.skillCredits,
            upiId: user.upiId,
            hourlyRate: user.hourlyRate,
            transactions
        });
    } catch (error) {
        console.error('getWalletBalance error:', error);
        res.status(500).json({ message: 'Server error fetching wallet data' });
    }
};

/**
 * POST /api/payments/submit-utr
 * Student confirms they have paid via UPI and provides their UTR reference.
 * Body: { requestId, utrNumber }
 */
const submitUTR = async (req, res) => {
    try {
        const { requestId, utrNumber } = req.body;

        if (!requestId || !utrNumber || utrNumber.trim().length < 6) {
            return res.status(400).json({ message: 'Valid requestId and UTR number are required.' });
        }

        const request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        if (request.exchangeType !== 'PaidUPI') {
            return res.status(400).json({ message: 'This request is not a paid UPI session.' });
        }

        // Only the sender (student/learner) can submit UTR
        if (request.sender.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only the learner can submit the UTR reference.' });
        }

        if (request.paymentStatus !== 'Pending') {
            return res.status(400).json({ message: 'UTR already submitted or payment already settled.' });
        }

        // Update request payment state
        request.paymentStatus = 'PaidByStudent';
        request.paymentDetails.utrNumber = utrNumber.trim();
        request.paymentDetails.paidAt = new Date();
        await request.save();

        // Create a pending Transaction record
        const receiver = request.receiver; // mentor
        await Transaction.create({
            fromUser: request.sender,
            toUser: receiver,
            request: requestId,
            type: 'UPI_Payment',
            amount: request.agreedAmount,
            status: 'Pending',
            upiId: request.paymentDetails.upiId,
            utrNumber: utrNumber.trim(),
            paidAt: new Date(),
            note: `UPI payment for session — UTR: ${utrNumber.trim()}`
        });

        res.json({ message: 'UTR submitted. Waiting for mentor to confirm receipt.', paymentStatus: 'PaidByStudent' });
    } catch (error) {
        console.error('submitUTR error:', error);
        res.status(500).json({ message: 'Server error submitting UTR' });
    }
};

/**
 * POST /api/payments/confirm-receipt
 * Mentor confirms they received the UPI payment.
 * Body: { requestId }
 */
const confirmReceipt = async (req, res) => {
    try {
        const { requestId } = req.body;

        const request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Only the receiver (mentor) can confirm
        if (request.receiver.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only the mentor can confirm receipt.' });
        }

        if (request.paymentStatus !== 'PaidByStudent') {
            return res.status(400).json({ message: 'No pending UTR to confirm yet.' });
        }

        // Mark request as settled
        request.paymentStatus = 'Settled';
        await request.save();

        // Mark the transaction as Verified
        await Transaction.findOneAndUpdate(
            { request: requestId, type: 'UPI_Payment', status: 'Pending' },
            { status: 'Verified', verifiedAt: new Date() }
        );

        res.json({ message: 'Payment confirmed. Transaction settled.', paymentStatus: 'Settled' });
    } catch (error) {
        console.error('confirmReceipt error:', error);
        res.status(500).json({ message: 'Server error confirming receipt' });
    }
};

/**
 * POST /api/payments/settle-credits
 * Atomically transfers 1 SkillCredit from learner to mentor on dual session completion.
 * Called internally after both users mark complete AND exchangeType is 'SkillCredits'.
 * Body: { requestId }
 */
const settleSkillCredits = async (req, res) => {
    try {
        const { requestId } = req.body;

        const request = await Request.findById(requestId)
            .populate('sender', 'skillCredits name')
            .populate('receiver', 'skillCredits name');

        if (!request) return res.status(404).json({ message: 'Request not found' });

        if (request.exchangeType !== 'SkillCredits') {
            return res.status(400).json({ message: 'This request does not use SkillCredits.' });
        }

        if (request.paymentStatus === 'Settled') {
            return res.status(400).json({ message: 'Credits already settled for this session.' });
        }

        const creditsToTransfer = request.agreedAmount || 1;
        const learner = request.sender;
        const mentor = request.receiver;

        if (learner.skillCredits < creditsToTransfer) {
            return res.status(400).json({ message: `Insufficient SkillCredits. Learner has ${learner.skillCredits}, needs ${creditsToTransfer}.` });
        }

        // Atomic debit/credit using $inc to avoid race conditions
        await User.findByIdAndUpdate(learner._id, { $inc: { skillCredits: -creditsToTransfer } });
        await User.findByIdAndUpdate(mentor._id, { $inc: { skillCredits: creditsToTransfer } });

        // Update request payment status
        request.paymentStatus = 'Settled';
        await request.save();

        // Log the transaction
        await Transaction.create({
            fromUser: learner._id,
            toUser: mentor._id,
            request: requestId,
            type: 'SkillCredit',
            amount: creditsToTransfer,
            status: 'Completed',
            verifiedAt: new Date(),
            note: `${creditsToTransfer} SkillCredit(s) transferred for session completion`
        });

        res.json({
            message: `${creditsToTransfer} SkillCredit(s) transferred successfully.`,
            paymentStatus: 'Settled'
        });
    } catch (error) {
        console.error('settleSkillCredits error:', error);
        res.status(500).json({ message: 'Server error settling SkillCredits' });
    }
};

module.exports = {
    getWalletBalance,
    submitUTR,
    confirmReceipt,
    settleSkillCredits
};
