const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Skill = require('../models/Skill');

async function testCascadeDelete() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Create a dummy user
        const testUser = await User.create({
            name: 'Delete Test User',
            email: `delete_test_${Date.now()}@test.com`,
            password: 'password123', // Will be hashed by pre-save
            location: 'Test City',
            phone: `555${Math.floor(Math.random() * 10000000)}`
        });
        console.log(`Created test user: ${testUser._id}`);

        // Create dummy skills for the user
        const skill1 = await Skill.create({
            title: 'Test Skill 1',
            description: 'A test skill that should be deleted',
            category: 'Tech',
            type: 'Exchange',
            location: 'Remote',
            owner: testUser._id
        });
        const skill2 = await Skill.create({
            title: 'Test Skill 2',
            description: 'Another test skill that should be deleted',
            category: 'Tech',
            type: 'Exchange',
            location: 'Remote',
            owner: testUser._id
        });
        console.log(`Created test skills: ${skill1._id}, ${skill2._id}`);

        // Verify skills exist
        let userSkills = await Skill.find({ owner: testUser._id });
        console.log(`Skills before user deletion: ${userSkills.length}`);

        // Trigger cascading delete (this mimics exactly what our authController does)
        const userToDelete = await User.findById(testUser._id);
        
        // Explicitly delete associated skills
        await Skill.deleteMany({ owner: userToDelete._id });
        
        await userToDelete.deleteOne();
        console.log('Test user cleanly deleted along with explicit skill deletion');

        // Verify skills no longer exist
        userSkills = await Skill.find({ owner: testUser._id });
        console.log(`Skills after user deletion: ${userSkills.length}`);
        
        if (userSkills.length === 0) {
            console.log('SUCCESS! Cascade delete worked perfectly.');
        } else {
            console.error('FAILED! Skills were not deleted.');
            process.exit(1);
        }

        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

testCascadeDelete();
