const User = require('../models/User');
const Skill = require('../models/Skill');

/**
 * Checks if User A offers a skill that User B wants.
 * Offers are matched based on:
 * 1. Category comparison (case-insensitive category match).
 * 2. Keyword/Title comparison (case-insensitive substring match).
 */
const doesOfferMatchWant = (offeredSkill, wantedSkill) => {
    // 1. Compare category/tags
    if (offeredSkill.category && wantedSkill.tags && wantedSkill.tags.length > 0) {
        const hasCategoryMatch = wantedSkill.tags.some(tag => 
            tag && offeredSkill.category && tag.toLowerCase() === offeredSkill.category.toLowerCase()
        );
        if (hasCategoryMatch) return true;
    }

    // 2. Compare title keyword overlap
    if (offeredSkill.title && wantedSkill.title) {
        const offTitle = offeredSkill.title.toLowerCase();
        const wanTitle = wantedSkill.title.toLowerCase();
        
        // Check if one contains the other
        if (offTitle.includes(wanTitle) || wanTitle.includes(offTitle)) {
            return true;
        }

        // Check if any word in wanted title is in offered title (ignoring short helper words)
        const wantedWords = wanTitle.split(/\s+/).filter(w => w.length > 2);
        if (wantedWords.some(word => offTitle.includes(word))) {
            return true;
        }
    }

    return false;
};

/**
 * Finds circular matching loops (direct 2-way and 3-way cycles)
 * involving the current user.
 */
const findCircularMatches = async (currentUserId) => {
    // 1. Fetch all users who have skills and want skills
    const users = await User.find({
        skills: { $exists: true, $not: { $size: 0 } },
        skillsWanted: { $exists: true, $not: { $size: 0 } }
    }).populate('skills');

    // Convert currentUserId to string for comparison
    const targetUserIdStr = currentUserId.toString();

    // Find current user object
    const currentUser = users.find(u => u._id.toString() === targetUserIdStr);
    if (!currentUser) return [];

    // 2. Construct directed graph edges (A can teach B)
    // Map of userId -> list of user objects who A can teach
    const adjacencyList = {};
    
    // For each user A, determine who they can teach (user B)
    users.forEach(userA => {
        const uAId = userA._id.toString();
        adjacencyList[uAId] = [];
        
        users.forEach(userB => {
            const uBId = userB._id.toString();
            if (uAId === uBId) return; // cannot swap with oneself

            // Check if user A offers any skill that user B wants
            const canTeach = userA.skills.some(skillOffered => 
                userB.skillsWanted.some(skillWanted => 
                    doesOfferMatchWant(skillOffered, skillWanted)
                )
            );

            if (canTeach) {
                // Find which specific skill matches
                const matchingSkill = userA.skills.find(skillOffered => 
                    userB.skillsWanted.some(skillWanted => 
                        doesOfferMatchWant(skillOffered, skillWanted)
                    )
                );
                
                // Store B as a neighbor along with the matching skill details
                adjacencyList[uAId].push({
                    user: userB,
                    skill: matchingSkill
                });
            }
        });
    });

    const cycles = [];

    // ── Path Finders ──

    // 1. Find 2-Way Cycles (Direct Swaps)
    // Target -> Neighbor1 -> Target
    const neighbors1 = adjacencyList[targetUserIdStr] || [];
    neighbors1.forEach(edge1 => {
        const u1Id = edge1.user._id.toString();
        const returnEdges = adjacencyList[u1Id] || [];
        
        const returnEdge = returnEdges.find(e => e.user._id.toString() === targetUserIdStr);
        if (returnEdge) {
            // Check if this cycle is already in array to avoid duplicates
            const exists = cycles.some(c => 
                c.type === '2-way' && 
                c.users.some(u => u._id.toString() === u1Id)
            );
            if (!exists) {
                cycles.push({
                    type: '2-way',
                    users: [
                        {
                            _id: currentUser._id,
                            name: currentUser.name,
                            avatar: currentUser.avatar,
                            teaches: edge1.skill.title
                        },
                        {
                            _id: edge1.user._id,
                            name: edge1.user.name,
                            avatar: edge1.user.avatar,
                            teaches: returnEdge.skill.title
                        }
                    ]
                });
            }
        }
    });

    // 2. Find 3-Way Cycles (Circular Swaps)
    // Target -> Neighbor1 -> Neighbor2 -> Target
    neighbors1.forEach(edge1 => {
        const u1Id = edge1.user._id.toString();
        const neighbors2 = adjacencyList[u1Id] || [];

        neighbors2.forEach(edge2 => {
            const u2Id = edge2.user._id.toString();
            // Node 2 must not be target or Node 1
            if (u2Id === targetUserIdStr || u2Id === u1Id) return;

            const returnEdges = adjacencyList[u2Id] || [];
            const returnEdge = returnEdges.find(e => e.user._id.toString() === targetUserIdStr);
            if (returnEdge) {
                // Check if this directed 3-way cycle is already represented
                const exists = cycles.some(c => 
                    c.type === '3-way' && 
                    c.users[1]._id.toString() === u1Id && 
                    c.users[2]._id.toString() === u2Id
                );
                if (!exists) {
                    cycles.push({
                        type: '3-way',
                        users: [
                            {
                                _id: currentUser._id,
                                name: currentUser.name,
                                avatar: currentUser.avatar,
                                teaches: edge1.skill.title
                            },
                            {
                                _id: edge1.user._id,
                                name: edge1.user.name,
                                avatar: edge1.user.avatar,
                                teaches: edge2.skill.title
                            },
                            {
                                _id: edge2.user._id,
                                name: edge2.user.name,
                                avatar: edge2.user.avatar,
                                teaches: returnEdge.skill.title
                            }
                        ]
                    });
                }
            }
        });
    });

    return cycles;
};

module.exports = {
    findCircularMatches
};
