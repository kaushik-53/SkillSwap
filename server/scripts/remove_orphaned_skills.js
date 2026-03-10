const mongoose = require('mongoose');
require('dotenv').config();
const Skill = require('../models/Skill');
const User = require('../models/User');

async function removeOrphanedSkills() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const skills = await Skill.find();
        let deletedCount = 0;
        
        for (let s of skills) {
            const ownerExists = await User.findById(s.owner);
            if (!ownerExists) {
                await Skill.deleteOne({ _id: s._id });
                deletedCount++;
                console.log(`Deleted orphaned skill: ${s.title}`);
            }
        }
        
        console.log(`Total orphaned skills deleted: ${deletedCount}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

removeOrphanedSkills();
