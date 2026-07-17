const Message = require('../models/Message');
const Request = require('../models/Request');

// @desc    Get messages for a swap request session
// @route   GET /api/requests/:requestId/messages
// @access  Private
const getMessages = async (req, res) => {
    const { requestId } = req.params;

    try {
        const swapRequest = await Request.findById(requestId);

        if (!swapRequest) {
            return res.status(404).json({ message: 'Swap session not found' });
        }

        // Verify the user is part of this swap session (either sender or receiver)
        const isParticipant =
            swapRequest.sender.toString() === req.user.id ||
            swapRequest.receiver.toString() === req.user.id;

        if (!isParticipant) {
            return res.status(403).json({ message: 'Not authorized to view messages in this session' });
        }

        const messages = await Message.find({ request: requestId })
            .sort({ createdAt: 1 })
            .populate('sender', 'name avatar');

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
};

// Helper for saving a message (used inside Socket.io handler or as REST API)
const saveMessage = async (requestId, senderId, text) => {
    const swapRequest = await Request.findById(requestId);
    if (!swapRequest) {
        throw new Error('Swap request not found');
    }

    const message = await Message.create({
        request: requestId,
        sender: senderId,
        text
    });

    return await message.populate('sender', 'name avatar');
};

module.exports = {
    getMessages,
    saveMessage
};
