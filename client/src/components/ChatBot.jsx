import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronLeft, Bot, Sparkles } from 'lucide-react';

// ─── Knowledge Base ───────────────────────────────────────────────────────────

const KB = [
    {
        id: 'skillswap',
        emoji: '🔄',
        label: 'SkillSwap',
        questions: [
            {
                q: 'What is SkillSwap?',
                a: `SkillSwap is a peer-to-peer skill exchange platform where people teach each other — completely free of charge.\n\nInstead of paying money, you trade your knowledge:\n• You teach someone what you know.\n• They teach you what you want to learn.`,
            },
            {
                q: 'Who can use SkillSwap?',
                a: `Anyone! SkillSwap is open to:\n• Students wanting to learn new skills\n• Professionals looking to upskill\n• Freelancers expanding their abilities\n• Hobbyists sharing their passion\n\nAll you need is a verified account.`,
            },
            {
                q: 'Is SkillSwap free?',
                a: `Yes — 100% free.\n\nSkillSwap charges ₹0 in platform fees. Swaps are based entirely on mutual skill exchange. There are no hidden charges or premium tiers.`,
            },
            {
                q: 'Is my data safe?',
                a: `Absolutely. SkillSwap uses:\n• Encrypted JWT authentication\n• Email OTP verification\n• Secure HTTPS connections\n• No third-party data selling\n\nYour data belongs to you.`,
            },
        ],
    },
    {
        id: 'courses',
        emoji: '📚',
        label: 'Skill Categories',
        questions: [
            {
                q: 'What skills can I exchange?',
                a: `SkillSwap supports a wide range of skill categories:\n\n💻 Coding & Tech\n🎨 Graphic Design\n🎵 Music\n🍳 Cooking\n📐 Plumbing & Repair\n⚡ Electrician\n🌱 Gardening\n🏋️ Fitness\n📖 Teaching & Tutoring\n🧹 Cleaning\n\n...and more under the "Other" category.`,
            },
            {
                q: 'Can I offer multiple skills?',
                a: `Yes! You can add as many skills as you like to your profile.\n\nGo to your Profile → click "Add a Skill" → fill in the title, description, and category.`,
            },
            {
                q: 'Can I learn and teach at the same time?',
                a: `Yes! You can:\n• Offer skills you already know\n• Add skills you want to learn in your "Skills Wanted" section on your profile\n\nThis helps the Smart Match engine find the best loops for you.`,
            },
        ],
    },
    {
        id: 'mentor',
        emoji: '👨‍🏫',
        label: 'Become a Mentor',
        questions: [
            {
                q: 'How do I become a mentor?',
                a: `Becoming a mentor on SkillSwap is simple:\n\n1. Create and verify your account.\n2. Go to your Profile.\n3. Click "Add a Skill".\n4. Fill in the skill title, description, category, and type (Exchange).\n5. Submit — your skill is now visible to other users!`,
            },
            {
                q: 'Do I need qualifications?',
                a: `No formal qualifications are required.\n\nAs long as you have real-world knowledge or experience in a skill and can communicate it clearly, you can be a mentor on SkillSwap.`,
            },
            {
                q: 'How many students can I teach?',
                a: `There is no hard limit. However, for quality exchange, we recommend:\n• Active swaps: up to 3–5 at a time\n• Complete current sessions before accepting new ones\n\nYour profile rating reflects your teaching quality.`,
            },
        ],
    },
    {
        id: 'exchange',
        emoji: '💬',
        label: 'Skill Exchange',
        questions: [
            {
                q: 'What is Skill Exchange?',
                a: `Skill Exchange allows two users to swap knowledge without paying money.\n\nExample:\n• User A teaches Web Development to User B.\n• User B teaches Graphic Design to User A.\n\nBoth benefit without any money changing hands.`,
            },
            {
                q: 'How do I request a swap?',
                a: `To request a skill swap:\n\n1. Visit another user's profile.\n2. Click the "Request Swap" button.\n3. Select the skill you can teach them.\n4. Select the skill you want to learn from them.\n5. Add a short message (optional).\n6. Submit — the other user will receive a notification.`,
            },
            {
                q: 'How long does a swap last?',
                a: `There is no fixed duration. A swap lasts as long as both parties agree.\n\nTypically:\n• Short skills (quick tutorials): 1–3 sessions\n• Deep skills (programming, design): 4–8 sessions\n\nBoth users must mark the swap as "Complete" to close it.`,
            },
            {
                q: 'What is a 3-way swap?',
                a: `A 3-way swap (Circular Match) is when three users form a loop:\n\n• User A teaches B → Python\n• User B teaches C → French\n• User C teaches A → Cooking\n\nOur Smart Match Engine detects these loops automatically and suggests them on your Dashboard!`,
            },
            {
                q: 'Can I cancel a swap?',
                a: `Yes. If a swap request is still Pending, either party can cancel it.\n\nOnce Accepted, you should discuss cancellation directly with your swap partner in the Session Chat before marking it cancelled.`,
            },
        ],
    },
    {
        id: 'contact',
        emoji: '📞',
        label: 'Contact & Support',
        questions: [
            {
                q: 'How do I contact support?',
                a: `For help, you can:\n\n• Email us: support@skillswap.in\n• Visit the About page for more details\n• Use the feedback form (coming soon)\n\nWe typically respond within 24 hours.`,
            },
            {
                q: 'How do I report a user?',
                a: `If another user is behaving inappropriately:\n\n1. Visit their profile.\n2. Click the report icon (⚑).\n3. Describe the issue.\n\nOur team reviews all reports and takes action within 48 hours.`,
            },
            {
                q: 'Can I delete my account?',
                a: `Account deletion is available via Settings → Account → Delete Account.\n\nNote: All your skills, swap history, and reviews will be permanently deleted. This action cannot be undone.`,
            },
        ],
    },
    {
        id: 'faqs',
        emoji: '❓',
        label: 'FAQs',
        questions: [
            {
                q: 'How does the rating system work?',
                a: `After each completed swap, both users can leave a review and rating (1-5 stars).

Your average rating is shown on your profile and helps other users trust you as a reliable swap partner.`,
            },
            {
                q: 'What if my partner does not respond?',
                a: `If your swap partner becomes unresponsive:

1. Send a message in the Session Chat.
2. Wait 48 hours for a response.
3. If still no response, you may cancel the swap from My Swaps.
4. You can report the user if the behaviour is repeated.`,
            },
            {
                q: 'Can I swap skills online or only in person?',
                a: `Both! SkillSwap supports:

• Online sessions (via video call, chat, or shared resources)
• In-person meetups (coordinate through Session Chat)

The platform does not enforce a meeting format.`,
            },
            {
                q: 'How does the Smart Match work?',
                a: `The Smart Match Engine analyzes all users and builds a directed graph:

• If your offered skills match what another user wants, an edge is drawn.
• The engine then finds cycles (loops) of 2 or 3 users.
• Found loops are shown as swap suggestions on your Dashboard.

This solves the problem where no two users have a perfect direct match!`,
            },
            {
                q: 'How do I create an account?',
                a: `Creating an account is simple:

1. Click "Register" on the top navigation bar.
2. Enter your name, email, location, and password.
3. Verify your email using the 6-digit OTP sent to your inbox.
4. Complete your profile by adding skills.

You can also sign in with Google for instant access.`,
            },
            {
                q: 'I forgot my password. What do I do?',
                a: `To reset your password:

1. Go to the Login page.
2. Click "Forgot Password".
3. Enter your registered email.
4. Enter the OTP sent to your email.
5. Set a new password.

OTP codes expire in 10 minutes.`,
            },
            {
                q: 'Can I edit my profile after registration?',
                a: `Yes! You can update your profile anytime:

• Profile photo
• Bio and location
• Skills you offer
• Skills you want to learn

Go to Profile and click the edit icon next to any section.`,
            },
            {
                q: 'How do I add a skill to my profile?',
                a: `To add a skill:

1. Click "Add a Skill" on your profile or Dashboard.
2. Fill in the skill title and description.
3. Choose a category (e.g., Coding, Music, Cooking).
4. Set the type to "Exchange" for swapping.
5. Submit — it appears on your profile instantly.`,
            },
            {
                q: 'How do I delete a skill?',
                a: `To remove a skill:

1. Go to your Profile page.
2. Find the skill card you want to remove.
3. Click the delete icon on the skill card.
4. Confirm deletion.

Skills linked to active swaps cannot be deleted until the swap is completed.`,
            },
            {
                q: 'What happens after a swap request is sent?',
                a: `After sending a request:

1. The other user receives a notification.
2. They can Accept or Decline your request.
3. If Accepted, the swap moves to "Active" status.
4. You both get access to the Session Chat to coordinate.
5. Once done, both mark it as Complete.`,
            },
            {
                q: 'Can I have multiple active swaps at once?',
                a: `Yes! There is no hard limit on the number of active swaps.

However, we recommend keeping 3-5 active at a time so you can give each partner proper attention.

You can manage all swaps from My Swaps.`,
            },
            {
                q: 'What is the Session Chat?',
                a: `The Session Chat is a real-time messaging room available for every accepted swap.

• Messages are delivered instantly using Socket.io.
• You can coordinate timings, share resources, and ask questions.
• Chat history is saved so you can review past messages anytime.`,
            },
            {
                q: 'Is my email visible to other users?',
                a: `No. Your email address is private and never shown to other users.

Other users can see your:
• Name
• Profile photo
• Location (city level)
• Skills offered
• Rating and reviews

Your contact details remain protected.`,
            },
            {
                q: 'What if I receive a bad review?',
                a: `If you believe a review is unfair or abusive:

1. Go to your Profile, Reviews section.
2. Click the flag icon on the review.
3. Submit a report with your reason.

Our team investigates within 72 hours. False or abusive reviews are removed.`,
            },
            {
                q: 'How do I log out?',
                a: `To log out:

1. Click your profile avatar in the top-right navbar.
2. A dropdown menu will appear.
3. Click "Logout".

You will be securely signed out and redirected to the home page.`,
            },
            {
                q: 'Can I use SkillSwap on mobile?',
                a: `Yes! SkillSwap is fully responsive and works on all screen sizes:

• Mobile phones (iOS and Android)
• Tablets
• Desktop browsers

No app download is needed — just open your browser and visit SkillSwap.`,
            },
            {
                q: 'What if someone misuses the platform?',
                a: `SkillSwap takes misuse seriously. If you encounter:

• Spam or fake profiles → Report the user
• Inappropriate messages → Screenshot and report
• Payment requests (prohibited) → Report immediately

All swaps are skill-for-skill only. Any request for money is a violation.`,
            },
            {
                q: 'How do I know if a user is trustworthy?',
                a: `Check a user's trustworthiness by reviewing:

• Their average star rating
• Reviews left by past swap partners
• Email verification badge
• Number of completed swaps
• Detailed profile bio and skill descriptions`,
            },
        ],
    },
];

// ─── ChatBot Component ────────────────────────────────────────────────────────

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState('home');     // 'home' | 'category' | 'answer'
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedQ, setSelectedQ] = useState(null);
    const [messages, setMessages] = useState([]);
    const [hasNewMsg, setHasNewMsg] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (open) {
            setHasNewMsg(false);
        }
    }, [open]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const pushBotMsg = (text) => {
        setMessages(prev => [...prev, { from: 'bot', text, time: new Date() }]);
    };

    const pushUserMsg = (text) => {
        setMessages(prev => [...prev, { from: 'user', text, time: new Date() }]);
    };

    const handleOpen = () => {
        setOpen(true);
        if (messages.length === 0) {
            setTimeout(() => pushBotMsg('👋 Hi! I\'m SkillBot. How can I help you today?\n\nPick a category below to get started!'), 300);
        }
    };

    const handleCategoryClick = (cat) => {
        pushUserMsg(`${cat.emoji} ${cat.label}`);
        setSelectedCat(cat);
        setView('category');
        setTimeout(() => pushBotMsg(`Here are some common questions about **${cat.label}**:`), 350);
    };

    const handleQuestionClick = (q) => {
        pushUserMsg(q.q);
        setSelectedQ(q);
        setView('answer');
        setTimeout(() => pushBotMsg(q.a), 350);
    };

    const handleBack = () => {
        if (view === 'answer') {
            setView('category');
        } else {
            setView('home');
            setSelectedCat(null);
        }
    };

    const handleReset = () => {
        setView('home');
        setSelectedCat(null);
        setSelectedQ(null);
        setMessages([]);
        setTimeout(() => pushBotMsg('👋 Hi again! Pick a category below to get started.'), 300);
    };

    const formatText = (text) =>
        text.split('\n').map((line, i) => (
            <span key={i}>
                {line.startsWith('• ') ? (
                    <span style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--ember)', flexShrink: 0 }}>•</span>
                        <span>{line.slice(2)}</span>
                    </span>
                ) : line.match(/^\d+\./) ? (
                    <span style={{ display: 'block', marginBottom: 2 }}>{line}</span>
                ) : (
                    <span>{line || <>&nbsp;</>}</span>
                )}
                {i < text.split('\n').length - 1 && !line.startsWith('• ') && <br />}
            </span>
        ));

    return (
        <>
            {/* ── Floating bubble ── */}
            <motion.button
                id="chatbot-bubble"
                onClick={handleOpen}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'fixed',
                    bottom: 28,
                    right: 28,
                    zIndex: 1000,
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--ember), #ff6b35)',
                    boxShadow: '0 8px 32px rgba(255,138,91,0.45)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                }}
                aria-label="Open SkillBot chat"
            >
                <MessageCircle size={24} />
                {hasNewMsg && (
                    <span style={{
                        position: 'absolute',
                        top: 4, right: 4,
                        width: 10, height: 10,
                        borderRadius: '50%',
                        background: '#34d399',
                        border: '2px solid var(--ink)',
                    }} />
                )}
            </motion.button>

            {/* ── Chat panel ── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        id="chatbot-panel"
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        style={{
                            position: 'fixed',
                            bottom: 96,
                            right: 28,
                            zIndex: 1000,
                            width: 360,
                            height: 'min(560px, 80vh)',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 20,
                            overflow: 'hidden',
                            background: 'var(--glass)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            border: '1px solid var(--glass-border)',
                            boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            borderBottom: '1px solid var(--glass-border)',
                            background: 'linear-gradient(135deg, rgba(255,138,91,0.1), rgba(56,189,248,0.05))',
                            flexShrink: 0,
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--ember), #ff6b35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <Bot size={18} color="#fff" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-hi)', fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                                    SkillBot
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-low)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                                    Online · Always here to help
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    onClick={handleReset}
                                    title="Restart"
                                    style={{ background: 'none', border: 'none', color: 'var(--text-low)', cursor: 'pointer', padding: 6, borderRadius: 8 }}
                                >
                                    <Sparkles size={15} />
                                </button>
                                <button
                                    onClick={() => setOpen(false)}
                                    title="Close"
                                    style={{ background: 'none', border: 'none', color: 'var(--text-low)', cursor: 'pointer', padding: 6, borderRadius: 8 }}
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px 16px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            scrollbarWidth: 'thin',
                        }}>
                            <AnimatePresence initial={false}>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25 }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                                            gap: 8,
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        {msg.from === 'bot' && (
                                            <div style={{
                                                width: 26, height: 26, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--ember), #ff6b35)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0, marginBottom: 2,
                                            }}>
                                                <Bot size={12} color="#fff" />
                                            </div>
                                        )}
                                        <div style={{
                                            maxWidth: '80%',
                                            padding: '10px 14px',
                                            borderRadius: msg.from === 'user'
                                                ? '16px 16px 4px 16px'
                                                : '16px 16px 16px 4px',
                                            background: msg.from === 'user'
                                                ? 'linear-gradient(135deg, var(--ember), #ff6b35)'
                                                : 'rgba(255,255,255,0.05)',
                                            border: msg.from === 'user'
                                                ? 'none'
                                                : '1px solid var(--glass-border)',
                                            fontSize: 13,
                                            lineHeight: 1.65,
                                            color: msg.from === 'user' ? '#fff' : 'var(--text-hi)',
                                            whiteSpace: 'pre-wrap',
                                        }}>
                                            {formatText(msg.text)}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Interactive buttons area */}
                        <div style={{
                            padding: '12px 16px 16px',
                            borderTop: '1px solid var(--glass-border)',
                            flexShrink: 0,
                            maxHeight: '220px',
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                        }}>
                            {/* Back button */}
                            {view !== 'home' && (
                                <button
                                    onClick={handleBack}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-low)',
                                        fontSize: 12,
                                        cursor: 'pointer',
                                        marginBottom: 10,
                                        padding: '4px 0',
                                        fontFamily: 'Space Mono, monospace',
                                    }}
                                >
                                    <ChevronLeft size={13} /> Back
                                </button>
                            )}

                            {/* Category grid */}
                            {view === 'home' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {KB.map(cat => (
                                        <motion.button
                                            key={cat.id}
                                            onClick={() => handleCategoryClick(cat)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            style={{
                                                padding: '10px 12px',
                                                borderRadius: 12,
                                                border: '1px solid var(--glass-border)',
                                                background: 'rgba(255,255,255,0.04)',
                                                color: 'var(--text-hi)',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                transition: 'background 0.2s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,138,91,0.1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                        >
                                            <span style={{ fontSize: 16 }}>{cat.emoji}</span>
                                            <span>{cat.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            )}

                            {/* Questions list */}
                            {view === 'category' && selectedCat && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {selectedCat.questions.map((q, i) => (
                                        <motion.button
                                            key={i}
                                            onClick={() => handleQuestionClick(q)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                padding: '10px 14px',
                                                borderRadius: 12,
                                                border: '1px solid var(--glass-border)',
                                                background: 'rgba(255,255,255,0.04)',
                                                color: 'var(--text-hi)',
                                                fontSize: 13,
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.2s',
                                                lineHeight: 1.5,
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = 'rgba(255,138,91,0.1)';
                                                e.currentTarget.style.borderColor = 'rgba(255,138,91,0.35)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                                e.currentTarget.style.borderColor = 'var(--glass-border)';
                                            }}
                                        >
                                            <span style={{ color: 'var(--ember)', marginRight: 6 }}>›</span>
                                            {q.q}
                                        </motion.button>
                                    ))}
                                </div>
                            )}

                            {/* After answer — quick actions */}
                            {view === 'answer' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <p style={{ fontSize: 12, color: 'var(--text-low)', marginBottom: 4, fontFamily: 'Space Mono, monospace' }}>
                                        Was that helpful?
                                    </p>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={handleBack}
                                            style={{
                                                flex: 1, padding: '9px', borderRadius: 10,
                                                border: '1px solid var(--glass-border)',
                                                background: 'rgba(255,255,255,0.04)',
                                                color: 'var(--text-hi)', fontSize: 12,
                                                cursor: 'pointer', fontWeight: 600,
                                            }}
                                        >
                                            More questions
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            style={{
                                                flex: 1, padding: '9px', borderRadius: 10,
                                                border: '1px solid rgba(255,138,91,0.3)',
                                                background: 'rgba(255,138,91,0.1)',
                                                color: 'var(--ember)', fontSize: 12,
                                                cursor: 'pointer', fontWeight: 600,
                                            }}
                                        >
                                            Start over
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;

