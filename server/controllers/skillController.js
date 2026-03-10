const Skill = require('../models/Skill');

// @desc    Get all skills with optional filtering
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
    try {
        const { category, location, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (location) query.location = new RegExp(location, 'i');
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ];
        }

        const skills = await Skill.find(query).populate('owner', 'name avatar rating verificationStatus');
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my skills
// @route   GET /api/skills/my
// @access  Private
const getMySkills = async (req, res) => {
    try {
        const skills = await Skill.find({ owner: req.user.id });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
    const { title, description, category, type, location } = req.body;

    if (!title || !description || !category || !type) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const skill = await Skill.create({
            title,
            description,
            category,
            type,
            location: location || req.user.location, // Use provided or user's default
            owner: req.user.id
        });

        res.status(201).json(skill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private // Authorization check needed
const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Check for user
        if (!req.user) {
             return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the goal user
        if (skill.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await skill.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSkills,
    getMySkills,
    createSkill,
    deleteSkill
};
