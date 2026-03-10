const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Plumbing', 'Electrician', 'Teaching', 'Gardening', 'Cleaning', 'Repair', 'Coding', 'Music', 'Cooking', 'Tech', 'Fitness', 'Other']
    },
    type: {
        type: String, // 'Paid' or 'Exchange'
        required: true,
        enum: ['Paid', 'Exchange']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Skill', skillSchema);
