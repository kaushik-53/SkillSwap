const mongoose = require('mongoose');
const Skill = require('../models/Skill');
const User = require('../models/User'); 
require('dotenv').config();

async function testBackendEnums() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find a test user or the first user
        const user = await User.findOne();
        if (!user) {
            console.error('No user found to assign as owner. Please create a user first.');
            process.exit(1);
        }

        console.log(`Using user: ${user.name} (${user._id})`);

        const testSkills = [
            {
                title: 'Test Tech Skill',
                description: 'Testing Tech category',
                category: 'Tech',
                type: 'Paid',
                location: 'Test City',
                owner: user._id
            },
            {
                title: 'Test Fitness Skill',
                description: 'Testing Fitness category',
                category: 'Fitness',
                type: 'Exchange',
                location: 'Test City',
                owner: user._id
            }
        ];

        for (const skillData of testSkills) {
            const skill = new Skill(skillData);
            await skill.save();
            console.log(`Successfully created skill: ${skill.title} in category: ${skill.category}`);
            // Cleanup: remove the test skill
            await Skill.findByIdAndDelete(skill._id);
            console.log(`Cleaned up test skill: ${skill._id}`);
        }

        console.log('Backend enum verification successful!');
    } catch (error) {
        console.error('Validation test failed:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

testBackendEnums();
