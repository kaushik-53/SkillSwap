const Request = require('../models/Request');
const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Send a request
// @route   POST /api/requests
// @access  Private
const sendRequest = async (req, res) => {
    const { skillId, message, exchangeType, agreedAmount } = req.body;

    try {
        const skill = await Skill.findById(skillId).populate('owner', 'upiId');

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        if (skill.owner._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'Cannot request your own skill' });
        }

        const resolvedType = exchangeType || 'SkillSwap';
        const resolvedAmount = Number(agreedAmount) || 0;

        // Auto-set paymentStatus based on exchange type
        const paymentStatus = resolvedType === 'SkillSwap' ? 'NotRequired' : 'Pending';

        // Pre-fill mentor's UPI id if it's a paid session
        const paymentDetails = resolvedType === 'PaidUPI'
            ? { upiId: skill.owner.upiId || '', utrNumber: '', paidAt: null }
            : { upiId: '', utrNumber: '', paidAt: null };

        const request = await Request.create({
            sender: req.user.id,
            receiver: skill.owner._id,
            skill: skillId,
            message,
            exchangeType: resolvedType,
            agreedAmount: resolvedAmount,
            paymentStatus,
            paymentDetails
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my requests (both sent and received)
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
    try {
        const sentRequests = await Request.find({ sender: req.user.id })
            .populate('skill')
            .populate('receiver', 'name avatar')
            .populate('sender', 'name avatar');
        
        const receivedRequests = await Request.find({ receiver: req.user.id })
            .populate('skill')
            .populate('sender', 'name avatar')
            .populate('receiver', 'name avatar');

        res.status(200).json({ sent: sentRequests, received: receivedRequests });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update request status
// @route   PUT /api/requests/:id
// @access  Private
const updateRequestStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const isSender = request.sender.toString() === req.user.id;
        const isReceiver = request.receiver.toString() === req.user.id;

        if (!isSender && !isReceiver) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Only receiver can Accept/Reject
        if (status === 'Accepted' || status === 'Rejected') {
             if (!isReceiver) {
                 return res.status(401).json({ message: 'Only receiver can accept/reject' });
             }
            request.status = status;
        }

        // Completion requires BOTH users to mark complete
        if (status === 'Completed') {
            if (request.status !== 'Accepted') {
                return res.status(400).json({ message: 'Session must be Accepted before completing' });
            }

            // Prevent duplicate marking by the same user
            const alreadyMarked = request.completedBy.some(id => id.toString() === req.user.id);
            if (alreadyMarked) {
                return res.status(400).json({ message: 'You already marked this session as complete' });
            }

            request.completedBy.push(req.user.id);

            // Mark fully Completed only when BOTH sender and receiver have confirmed
            if (request.completedBy.length >= 2) {
                request.status = 'Completed';
            }
        }

        await request.save();
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get request by ID
// @route   GET /api/requests/:id
// @access  Private
const getRequestById = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate('skill')
            .populate('sender', 'name email phone avatar rating reviewsCount')
            .populate('receiver', 'name email phone avatar rating reviewsCount');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Verify that the logged in user is part of the request
        if (request.sender._id.toString() !== req.user.id && request.receiver._id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to view this request' });
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark a session as complete (requires both users)
// @route   POST /api/requests/:id/complete
// @access  Private
const markComplete = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const isSender = request.sender.toString() === req.user.id;
        const isReceiver = request.receiver.toString() === req.user.id;

        if (!isSender && !isReceiver) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (request.status !== 'Accepted') {
            return res.status(400).json({ message: 'Session must be Accepted before completing' });
        }

        // Server-side payment gate — block completion if payment not settled
        if (
            request.exchangeType !== 'SkillSwap' &&
            request.paymentStatus !== 'Settled' &&
            request.paymentStatus !== 'NotRequired'
        ) {
            return res.status(400).json({
                message: request.exchangeType === 'PaidUPI'
                    ? 'Payment must be confirmed by the mentor before marking this session complete.'
                    : 'SkillCredit transfer must be completed before marking this session done.'
            });
        }

        // Prevent duplicate marking
        const alreadyMarked = request.completedBy.some(id => id.toString() === req.user.id);
        if (alreadyMarked) {
            return res.status(400).json({ message: 'You already marked this session as complete' });
        }

        request.completedBy.push(req.user.id);

        // Mark fully Completed only when BOTH parties have confirmed
        if (request.completedBy.length >= 2) {
            request.status = 'Completed';
        }

        await request.save();
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendRequest,
    getRequests,
    updateRequestStatus,
    getRequestById,
    markComplete
};
