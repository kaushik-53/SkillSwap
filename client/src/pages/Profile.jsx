import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Star, MessageSquare, CheckCircle, ThumbsUp, Edit, Repeat, Search, Mail, Phone, Trash2, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import EditProfileModal from '../components/EditProfileModal';
import RequestSwapModal from '../components/RequestSwapModal';
import AuthContext from '../context/AuthContext';
import { getAvatarUrl } from '../utils/imageHelpers';
import GlassCard from '../components/ui/GlassCard';
import ExchangeSeal from '../components/ui/ExchangeSeal';
import OtpInput from '../components/ui/OtpInput';
import { useToast } from '../components/ui/Toast';

const ProfileStat = ({ label, value, accent }) => (
    <div style={{ textAlign: 'center', padding: '16px 20px' }}>
        <p style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 900, fontSize: 28, color: accent || 'var(--text-hi)', lineHeight: 1, marginBottom: 4 }}>
            {value}
        </p>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text-low)', letterSpacing: '0.12em' }}>
            {label}
        </p>
    </div>
);

const Profile = () => {
    const { user: currentUser, updateUserState, deleteAccount, requestDeleteAccount } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [deleteOtp, setDeleteOtp] = useState('');
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [isDeleteWaiting, setIsDeleteWaiting] = useState(false);
    const { show, Toast } = useToast();

    const handleDeleteSkill = async (skillId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills/${skillId}`, { headers: { Authorization: `Bearer ${token}` } });
            setProfileUser(prev => ({ ...prev, skillsOffered: prev.skillsOffered.filter(s => s._id !== skillId) }));
            show('Skill removed.', 'success');
        } catch (error) {
            show('Failed to delete skill.', 'error');
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                let targetUser;
                if (id && id !== currentUser?._id) {
                    const userRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/${id}`, config);
                    targetUser = userRes.data;
                    setIsOwnProfile(false);
                } else {
                    targetUser = currentUser;
                    setIsOwnProfile(true);
                }
                if (!targetUser) return;

                const skillsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills`);
                const userSkills = skillsRes.data.filter(s => s.owner?._id === targetUser._id);

                let dynamicallyFetchedReviews = targetUser.reviews || [];
                let swapsCompleted = targetUser.swapsCompleted || 0;

                try {
                    const reviewRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/user/${targetUser._id}`);
                    dynamicallyFetchedReviews = reviewRes.data || [];
                    const requestRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`, config);
                    const allReqs = [...(requestRes.data.received || []), ...(requestRes.data.sent || [])];
                    swapsCompleted = allReqs.filter(r => r.status === 'Completed' && (r.sender?._id === targetUser._id || r.receiver?._id === targetUser._id)).length;
                } catch (e) { /* non-critical */ }

                setProfileUser({
                    ...targetUser,
                    memberSince: new Date(targetUser.createdAt).getFullYear() || new Date().getFullYear(),
                    swapsCompleted,
                    rating: targetUser.rating || 0,
                    reviewsCount: targetUser.reviewsCount || 0,
                    about: targetUser.bio || 'No bio provided yet.',
                    skillsOffered: userSkills.map(s => ({ _id: s._id, title: s.title, level: s.level || 'Beginner', category: s.category, description: s.description, tags: [s.category] })),
                    skillsWanted: targetUser.skillsWanted || [],
                    reviews: dynamicallyFetchedReviews,
                });
            } catch (error) { console.error(error); }
        };
        if (currentUser) fetchProfileData();
    }, [id, currentUser]);

    if (!profileUser) return (
        <div style={{ padding: '32px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
            {/* ── Hero skeleton ─────────────────────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                marginBottom: 24,
            }}>
                {/* Left — Avatar + name */}
                <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    {/* Avatar circle */}
                    <div className="skeleton" style={{ width: 96, height: 96, borderRadius: '50%' }} />
                    {/* Name */}
                    <div className="skeleton" style={{ width: '60%', height: 22, borderRadius: 8 }} />
                    {/* Location */}
                    <div className="skeleton" style={{ width: '40%', height: 14, borderRadius: 6 }} />
                    {/* Bio lines */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                        <div className="skeleton" style={{ width: '100%', height: 12, borderRadius: 6 }} />
                        <div className="skeleton" style={{ width: '80%', height: 12, borderRadius: 6 }} />
                        <div className="skeleton" style={{ width: '65%', height: 12, borderRadius: 6 }} />
                    </div>
                    {/* Button */}
                    <div className="skeleton" style={{ width: '100%', height: 44, borderRadius: 12, marginTop: 8 }} />
                </div>

                {/* Right — Stats + seal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Stats row */}
                    <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <div className="skeleton" style={{ width: 40, height: 28, borderRadius: 6 }} />
                                <div className="skeleton" style={{ width: 56, height: 10, borderRadius: 4 }} />
                            </div>
                        ))}
                    </div>
                    {/* Exchange seal card */}
                    <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: 28, display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
                        <div className="skeleton" style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div className="skeleton" style={{ width: '70%', height: 14, borderRadius: 6 }} />
                            <div className="skeleton" style={{ width: '50%', height: 12, borderRadius: 6 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Skills skeleton ────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                {[0, 1].map(col => (
                    <div key={col} className="glass" style={{ borderRadius: 'var(--r-xl)', padding: 28 }}>
                        {/* Section heading */}
                        <div className="skeleton" style={{ width: '45%', height: 16, borderRadius: 6, marginBottom: 20 }} />
                        {/* Skill chips */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="skeleton" style={{ width: '100%', height: 52, borderRadius: 12 }} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ padding: '32px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
            <Toast />

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28, alignItems: 'start', flexWrap: 'wrap' }}>

                {/* ── Left Column ────────────────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Profile card */}
                    <GlassCard style={{ borderRadius: 'var(--r-2xl)', overflow: 'hidden' }}>
                        {/* Cover */}
                        <div style={{
                            height: 120,
                            background: 'linear-gradient(135deg, rgba(255,138,91,0.3), rgba(94,234,212,0.25))',
                            position: 'relative',
                        }}>
                            {/* Blobs inside cover */}
                            <div style={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, background: 'radial-gradient(circle, var(--ember-dim), transparent)', borderRadius: '50%' }} />
                            <div style={{ position: 'absolute', bottom: -20, right: 10, width: 80, height: 80, background: 'radial-gradient(circle, var(--current-dim), transparent)', borderRadius: '50%' }} />
                        </div>

                        <div style={{ padding: '0 28px 32px', textAlign: 'center' }}>
                            {/* Avatar */}
                            <div style={{ position: 'relative', display: 'inline-block', marginTop: -40, marginBottom: 16 }}>
                                <img
                                    src={getAvatarUrl(profileUser.avatar, profileUser.name)}
                                    alt={profileUser.name}
                                    style={{
                                        width: 88, height: 88,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '4px solid var(--ink-2)',
                                        boxShadow: '0 0 24px var(--current-glow)',
                                    }}
                                />
                            </div>

                            <h1 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--text-hi)', textTransform: 'capitalize', marginBottom: 6 }}>
                                {profileUser.name}
                            </h1>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, color: 'var(--text-low)', fontSize: 12, marginBottom: 12 }}>
                                <MapPin size={11} />
                                <span style={{ fontFamily: 'Space Mono, monospace' }}>{profileUser.location || '—'}</span>
                            </div>

                            {isOwnProfile && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                                    {profileUser.email && (
                                        <div className="glass-sm" style={{ padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                                            <Mail size={10} style={{ color: 'var(--text-low)' }} />
                                            <span style={{ color: 'var(--text-mid)', fontFamily: 'Space Mono, monospace' }}>{profileUser.email}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Rating */}
                            <div className="glass-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, marginBottom: 24 }}>
                                {profileUser.reviewsCount > 0 ? (
                                    <>
                                        <div style={{ display: 'flex', gap: 2 }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} style={{ color: '#FBBF24', fill: i < Math.floor(profileUser.rating) ? '#FBBF24' : 'none' }} />
                                            ))}
                                        </div>
                                        <span style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 12, color: 'var(--text-hi)' }}>
                                            {profileUser.rating.toFixed(1)}
                                        </span>
                                        <span style={{ fontSize: 11, color: 'var(--text-low)' }}>({profileUser.reviewsCount})</span>
                                    </>
                                ) : (
                                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-low)', letterSpacing: '0.08em' }}>
                                        NEW MEMBER
                                    </span>
                                )}
                            </div>

                            {/* CTA buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {isOwnProfile ? (
                                    !isDeletingAccount ? (
                                        <>
                                            <button onClick={() => setIsEditModalOpen(true)} className="btn-ghost"
                                                style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                                <Edit size={16} /> Edit Profile
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!window.confirm('Delete your account permanently? This cannot be undone.')) return;
                                                    try {
                                                        await requestDeleteAccount();
                                                        setIsDeletingAccount(true);
                                                        show('OTP sent to your email.', 'info');
                                                    } catch (err) {
                                                        show('Failed to initiate deletion.', 'error');
                                                    }
                                                }}
                                                style={{ width: '100%', padding: '10px', background: 'rgba(127,40,40,0.15)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 12, color: '#F87171', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                                            >
                                                <Trash2 size={14} /> Delete Account
                                            </button>
                                        </>
                                    ) : (
                                        <div style={{ padding: '16px', background: 'rgba(127,40,40,0.12)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 14 }}>
                                            <p style={{ fontSize: 12, color: '#FCA5A5', fontWeight: 600, marginBottom: 14 }}>
                                                Enter the 6-digit OTP to confirm account deletion.
                                            </p>
                                            <OtpInput
                                                value={deleteOtp}
                                                onChange={setDeleteOtp}
                                                length={6}
                                            />
                                            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                                <button
                                                    onClick={async () => {
                                                        if (deleteOtp.length < 6) return show('Enter a valid 6-digit OTP.', 'error');
                                                        setIsDeleteWaiting(true);
                                                        try { await deleteAccount(deleteOtp); }
                                                        catch (e) { show(e?.response?.data?.message || 'Invalid OTP.', 'error'); setIsDeleteWaiting(false); }
                                                    }}
                                                    disabled={isDeleteWaiting}
                                                    style={{ flex: 1, padding: '10px', background: '#B91C1C', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                                                >
                                                    {isDeleteWaiting ? 'Deleting...' : 'Confirm'}
                                                </button>
                                                <button onClick={() => { setIsDeletingAccount(false); setDeleteOtp(''); }} disabled={isDeleteWaiting}
                                                    className="btn-ghost" style={{ flex: 1, padding: '10px', borderRadius: 10, fontSize: 13 }}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <>
                                        <button className="btn-ember" style={{ width: '100%', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            <Repeat size={16} /> Request Swap
                                        </button>
                                        <button className="btn-ghost" style={{ width: '100%', padding: '11px', borderRadius: 12, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            <MessageSquare size={16} /> Message
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    {/* Stats */}
                    <div className="glass" style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-low)', letterSpacing: '0.12em', padding: '20px 24px 0' }}>
                            ACTIVITY
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid var(--glass-border)', marginTop: 14 }}>
                            <div style={{ borderRight: '1px solid var(--glass-border)' }}>
                                <ProfileStat label="SWAPS DONE" value={profileUser.swapsCompleted} accent="var(--ember)" />
                            </div>
                            <ProfileStat label="MEMBER SINCE" value={profileUser.memberSince} accent="var(--current)" />
                        </div>
                    </div>
                </div>

                {/* ── Right Column ───────────────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>

                    {/* About */}
                    <GlassCard style={{ padding: 32, borderRadius: 'var(--r-xl)' }}>
                        <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-hi)', marginBottom: 14 }}>
                            About {profileUser.name?.split(' ')[0]}
                        </h2>
                        <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.75 }}>
                            {profileUser.about}
                        </p>
                    </GlassCard>

                    {/* Skills Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        {/* Skills Offered */}
                        <GlassCard style={{ padding: 28, borderRadius: 'var(--r-lg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                                <div style={{ width: 36, height: 36, background: 'var(--ember-dim)', border: '1px solid rgba(255,138,91,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ThumbsUp size={18} style={{ color: 'var(--ember)' }} />
                                </div>
                                <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--text-hi)' }}>
                                    Skills I Offer
                                </h2>
                            </div>

                            {profileUser.skillsOffered?.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {profileUser.skillsOffered.map((skill, idx) => (
                                        <div key={idx} style={{ paddingBottom: 20, borderBottom: '1px solid var(--glass-border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-hi)' }}>{skill.title}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    {skill.level && (
                                                        <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'var(--ember-dim)', color: 'var(--ember)', fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em' }}>
                                                            {skill.level.toUpperCase()}
                                                        </span>
                                                    )}
                                                    {isOwnProfile && (
                                                        <button onClick={() => handleDeleteSkill(skill._id)} style={{ background: 'none', border: 'none', color: 'var(--text-low)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.65, marginBottom: 10 }}>
                                                {skill.description || 'Can help with projects and guidance.'}
                                            </p>
                                            {!isOwnProfile && (
                                                <button
                                                    onClick={() => { setSelectedSkill({ ...skill, owner: profileUser }); setIsSwapModalOpen(true); }}
                                                    className="btn-ember"
                                                    style={{ width: '100%', padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}
                                                >
                                                    Select to Swap
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: 13, color: 'var(--text-low)', fontStyle: 'italic' }}>No skills listed yet.</p>
                            )}
                        </GlassCard>

                        {/* Skills Wanted */}
                        <GlassCard style={{ padding: 28, borderRadius: 'var(--r-lg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                                <div style={{ width: 36, height: 36, background: 'var(--current-dim)', border: '1px solid rgba(94,234,212,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Target size={18} style={{ color: 'var(--current)' }} />
                                </div>
                                <div>
                                    <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--text-hi)' }}>
                                        Skills I Want
                                    </h2>
                                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text-low)', letterSpacing: '0.1em' }}>
                                        GROWTH GOALS
                                    </p>
                                </div>
                            </div>

                            {profileUser.skillsWanted?.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {profileUser.skillsWanted.map((skill, idx) => (
                                        <div key={idx} style={{ padding: '14px 16px', background: 'var(--current-dim)', border: '1px solid rgba(94,234,212,0.15)', borderRadius: 12 }}>
                                            <h3 style={{ fontWeight: 700, fontSize: 14, color: 'var(--current)', marginBottom: 4 }}>
                                                {skill.title}
                                            </h3>
                                            {skill.description && (
                                                <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.55 }}>{skill.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '32px 16px', textAlign: 'center', border: '1px dashed var(--glass-border)', borderRadius: 12 }}>
                                    <Search size={28} style={{ color: 'var(--text-low)', marginBottom: 10, opacity: 0.4 }} />
                                    <p style={{ fontSize: 12, color: 'var(--text-low)', fontStyle: 'italic' }}>
                                        Not looking for anything specific right now.
                                    </p>
                                </div>
                            )}
                        </GlassCard>
                    </div>

                    {/* Reviews */}
                    <GlassCard style={{ padding: 32, borderRadius: 'var(--r-xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-hi)' }}>
                                Community Reviews
                            </h2>
                            {profileUser.reviews?.length > 3 && (
                                <button
                                    onClick={() => setShowAllReviews(v => !v)}
                                    style={{ fontSize: 12, color: 'var(--current)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Mono, monospace', letterSpacing: '0.06em' }}
                                >
                                    {showAllReviews ? 'LESS' : `ALL (${profileUser.reviews.length})`}
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {profileUser.reviews?.length > 0
                                ? (showAllReviews ? profileUser.reviews : profileUser.reviews.slice(0, 3)).map(review => (
                                    <div key={review._id} style={{ paddingBottom: 24, borderBottom: '1px solid var(--glass-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                                            <img src={getAvatarUrl(review.reviewer?.avatar, review.reviewer?.name)} alt={review.reviewer?.name}
                                                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-hi)' }}>{review.reviewer?.name}</h4>
                                                        {/* Verified exchange badge */}
                                                        <ExchangeSeal triggered={false} size={20} />
                                                    </div>
                                                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-low)' }}>
                                                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={13} style={{ color: i < review.rating ? '#FBBF24' : 'var(--text-low)', fill: i < review.rating ? '#FBBF24' : 'none' }} />
                                                    ))}
                                                </div>
                                                {review.comment && (
                                                    <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.65, fontStyle: 'italic' }}>"{review.comment}"</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : <p style={{ fontSize: 13, color: 'var(--text-low)', fontStyle: 'italic' }}>No reviews yet.</p>
                            }
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Modals */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={profileUser}
                onSave={async (updatedData) => {
                    try {
                        const token = localStorage.getItem('token');
                        const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, updatedData, { headers: { Authorization: `Bearer ${token}` } });
                        setProfileUser(prev => ({ ...prev, name: res.data.name, location: res.data.location, about: res.data.bio, avatar: res.data.avatar, skillsWanted: res.data.skillsWanted }));
                        if (updateUserState) updateUserState(res.data);
                        show('Profile updated!', 'success');
                    } catch (error) {
                        show('Failed to update profile.', 'error');
                    }
                }}
            />
            <RequestSwapModal
                isOpen={isSwapModalOpen}
                onClose={() => setIsSwapModalOpen(false)}
                skill={selectedSkill}
                onSuccess={() => show(`Swap request sent to ${profileUser.name}!`, 'success')}
            />
        </div>
    );
};

export default Profile;
