import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    MapPin, Star, MessageSquare, Calendar, Clock, CheckCircle,
    ThumbsUp, Edit, Share2, Repeat, Search, Mail, Phone, Trash2, Target, Pencil
} from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';
import RequestSwapModal from '../components/RequestSwapModal';
import AuthContext from '../context/AuthContext';
import { getAvatarUrl } from '../utils/imageHelpers';

const Profile = () => {
    const { user: currentUser, updateUserState, deleteAccount, requestDeleteAccount } = useContext(AuthContext);
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [deleteOtp, setDeleteOtp] = useState('');
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [isDeleteWaiting, setIsDeleteWaiting] = useState(false);

    const handleDeleteSkill = async (skillId) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills/${skillId}`, config);

            // Update local state
            setProfileUser(prev => ({
                ...prev,
                skillsOffered: prev.skillsOffered.filter(s => s._id !== skillId)
            }));

            setToastMessage('Skill deleted successfully!');
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } catch (error) {
            console.error('Failed to delete skill:', error);
            alert('Failed to delete skill');
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

                // Fetch skills for this user
                const skillsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills`);
                const userSkills = skillsRes.data.filter(s => s.owner?._id === targetUser._id);

                // Fetch reviews for this user
                let dynamicallyFetchedReviews = targetUser.reviews || [];
                let swapsCompleted = targetUser.swapsCompleted || 0;

                try {
                    const reviewRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/user/${targetUser._id}`);
                    dynamicallyFetchedReviews = reviewRes.data || [];

                    // Fetch requests to calculate swapsCompleted accurately
                    const requestRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`, config);
                    const allReqs = [...(requestRes.data.received || []), ...(requestRes.data.sent || [])];
                    const completedReqs = allReqs.filter(r =>
                        r.status === 'Completed' &&
                        (r.sender?._id === targetUser._id || r.receiver?._id === targetUser._id)
                    ).length;

                    swapsCompleted = completedReqs;
                } catch (e) { console.error("Could not fetch stats dynamically", e); }

                setProfileUser({
                    ...targetUser,
                    memberSince: new Date(targetUser.createdAt).getFullYear() || new Date().getFullYear(),
                    responseTime: targetUser.responseTime || 'N/A',
                    swapsCompleted: swapsCompleted, // Ideally this comes from a backend aggregation later
                    rating: targetUser.rating || 0,
                    reviewsCount: targetUser.reviewsCount || 0,
                    about: targetUser.bio || "No bio provided yet.",
                    skillsOffered: userSkills.map(s => ({
                        _id: s._id,
                        title: s.title,
                        level: s.level || 'Beginner',
                        category: s.category,
                        description: s.description,
                        tags: [s.category]
                    })),
                    skillsWanted: targetUser.skillsWanted || [],
                    reviews: dynamicallyFetchedReviews
                });
            } catch (error) {
                console.error("Profile fetch error:", error);
            }
        };

        if (currentUser) fetchProfileData();
    }, [id, currentUser]);

    if (!profileUser) return <div className="min-h-screen pt-20 flex justify-center items-center">Loading...</div>;

    return (
        <div className="pb-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        {/* Cover / Header color */}
                        <div className="h-32 bg-blue-50"></div>

                        <div className="px-6 pb-8 text-center relative">
                            {/* Avatar */}
                            <div className="relative -mt-16 mb-6 inline-block">
                                <img
                                    src={getAvatarUrl(profileUser.avatar, profileUser.name)}
                                    alt={profileUser.name}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover ring-1 ring-gray-100"
                                />
                            </div>

                            <div className="mb-8">
                                <h1 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-2 tracking-tight capitalize">
                                    {profileUser.name}
                                </h1>
                                <div className="flex items-center justify-center gap-1.5 text-gray-400 mt-2 font-bold uppercase tracking-tighter text-[10px]">
                                    <MapPin size={12} className="text-blue-600" />
                                    <span>{profileUser.location || 'Brooklyn, NY'}</span>
                                </div>

                                {/* Login / Register Details */}
                                {isOwnProfile && (
                                    <div className="mt-3 flex justify-center gap-2 flex-wrap">
                                        {profileUser.email && (
                                            <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                <Mail size={12} className="text-gray-400" />
                                                <span>{profileUser.email}</span>
                                            </div>
                                        )}
                                        {profileUser.phone && (
                                            <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                <Phone size={12} className="text-gray-400" />
                                                <span>{profileUser.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4 inline-flex items-center gap-2 bg-gray-50/50 px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                                    {profileUser.reviewsCount > 0 ? (
                                        <>
                                            <div className="flex text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} fill={i < Math.floor(profileUser.rating) ? "currentColor" : "none"} className={i < Math.floor(profileUser.rating) ? "" : "text-gray-200"} />
                                                ))}
                                            </div>
                                            <span className="font-black text-gray-900 text-xs ml-1">{profileUser.rating.toFixed(1)}</span>
                                            <span className="text-gray-400 font-bold text-[10px]">({profileUser.reviewsCount} reviews)</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-400 font-bold text-[10px]">New Member - No ratings yet</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 px-2">
                                {isOwnProfile ? (
                                    <>
                                        {!isDeletingAccount ? (
                                            <>
                                                <button
                                                    onClick={() => setIsEditModalOpen(true)}
                                                    className="w-full py-3.5 bg-white border border-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
                                                >
                                                    <Edit size={18} /> Edit Profile
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm("Are you absolutely sure you want to delete your account? This will permanently erase your profile and all your posted skills. This action cannot be undone.")) {
                                                            try {
                                                                await requestDeleteAccount();
                                                                setIsDeletingAccount(true);
                                                                setToastMessage('OTP sent to your email.');
                                                                setShowSuccessToast(true);
                                                                setTimeout(() => setShowSuccessToast(false), 3000);
                                                            } catch (error) {
                                                                alert("Failed to request account deletion. Please try again.");
                                                            }
                                                        }
                                                    }}
                                                    className="w-full py-3.5 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 mt-3"
                                                >
                                                    <Trash2 size={18} /> Delete Account
                                                </button>
                                            </>
                                        ) : (
                                            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                                                <p className="text-red-700 font-bold text-sm mb-3">Enter the 6-digit OTP sent to your email to permanently delete your account.</p>
                                                <input
                                                    type="text"
                                                    disabled={isDeleteWaiting}
                                                    placeholder="Enter OTP"
                                                    value={deleteOtp}
                                                    onChange={(e) => setDeleteOtp(e.target.value)}
                                                    className="w-full px-4 py-2 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={async () => {
                                                            if (!deleteOtp || deleteOtp.length < 6) return alert('Enter a valid 6 digit OTP');
                                                            setIsDeleteWaiting(true);
                                                            try {
                                                                await deleteAccount(deleteOtp);
                                                            } catch (error) {
                                                                alert(error?.response?.data?.message || "Invalid OTP or request failed");
                                                                setIsDeleteWaiting(false);
                                                            }
                                                        }}
                                                        disabled={isDeleteWaiting}
                                                        className="flex-1 py-2.5 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
                                                    >
                                                        {isDeleteWaiting ? 'Deleting...' : 'Confirm'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsDeletingAccount(false);
                                                            setDeleteOtp('');
                                                        }}
                                                        disabled={isDeleteWaiting}
                                                        className="flex-1 py-2.5 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2">
                                        <Repeat size={18} /> Request Swap
                                    </button>
                                )}

                                {!isOwnProfile && (
                                    <button className="w-full py-3.5 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                                        <MessageSquare size={18} />
                                        Message
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Activity Stats */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 p-8">
                        <h3 className="font-black text-gray-900 mb-8 uppercase tracking-widest text-xs">Activity Stats</h3>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                        <CheckCircle size={22} />
                                    </div>
                                    <span className="text-gray-500 font-bold">Swaps Completed</span>
                                </div>
                                <span className="font-black text-gray-900 text-lg">{profileUser.swapsCompleted}</span>
                            </div>


                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                        <Calendar size={22} />
                                    </div>
                                    <span className="text-gray-500 font-bold">Member Since</span>
                                </div>
                                <span className="font-black text-gray-900 text-lg">{profileUser.memberSince}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* About Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About {profileUser.name?.split(' ')[0]}</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {profileUser.about}
                        </p>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Skills Offered */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <ThumbsUp size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Skills I Offer</h2>
                            </div>

                            {profileUser.skillsOffered && profileUser.skillsOffered.length > 0 ? (
                                <div className="space-y-6">
                                    {profileUser.skillsOffered.map((skill, idx) => (
                                        <div key={idx} className="space-y-2 group/skill">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-900 text-lg group-hover/skill:text-blue-600 transition-colors">{skill.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    {skill.level && <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">{skill.level}</span>}
                                                    {isOwnProfile && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteSkill(skill._id);
                                                            }}
                                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                            title="Delete Skill"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-sm leading-relaxed mb-4">{skill.description || "Can help with projects and providing guidance."}</p>
                                            <div className="flex flex-wrap gap-2 pt-1 mb-4">
                                                {skill.tags && skill.tags.map((tag, tIdx) => (
                                                    <span key={tIdx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">{tag}</span>
                                                ))}
                                            </div>
                                            {!isOwnProfile && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedSkill({ ...skill, owner: profileUser });
                                                        setIsSwapModalOpen(true);
                                                    }}
                                                    className="w-full py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100 uppercase tracking-widest"
                                                >
                                                    Select to Swap
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No skills listed yet.</p>
                            )}
                        </div>

                        {/* Skills Wanted */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Skills I Want</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Goals</p>
                                </div>
                            </div>

                            {profileUser.skillsWanted && profileUser.skillsWanted.length > 0 ? (
                                <div className="space-y-4 flex-1">
                                    {profileUser.skillsWanted.map((skill, idx) => (
                                        <div key={idx} className="p-5 rounded-2xl bg-orange-50/30 border border-orange-100/50 hover:border-orange-200 transition-all group">
                                            <h3 className="font-black text-orange-900 text-base mb-1 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{skill.title}</h3>
                                            {skill.description && (
                                                <p className="text-orange-800/60 text-sm leading-relaxed font-medium line-clamp-2">{skill.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center px-4 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    <Search size={32} className="text-gray-200 mb-3" />
                                    <p className="text-gray-400 text-sm font-bold italic">Not looking for anything specific right now.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Reviews from Neighbors</h2>
                            {profileUser.reviews && profileUser.reviews.length > 3 && (
                                <button
                                    onClick={() => setShowAllReviews(prev => !prev)}
                                    className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
                                >
                                    {showAllReviews ? `Show Less` : `View All (${profileUser.reviews.length})`}
                                </button>
                            )}
                        </div>

                        <div className="space-y-8 divide-y divide-gray-100">
                            {profileUser.reviews && profileUser.reviews.length > 0 ? (showAllReviews ? profileUser.reviews : profileUser.reviews.slice(0, 3)).map((review) => (
                                <div key={review._id} className="pt-8 first:pt-0">
                                    <div className="flex items-start gap-4">
                                        <img src={getAvatarUrl(review.reviewer?.avatar, review.reviewer?.name)} alt={review.reviewer?.name} className="w-12 h-12 rounded-full bg-gray-200 object-cover" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-gray-900">{review.reviewer?.name}</h4>
                                                <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex text-yellow-400 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                                                ))}
                                            </div>
                                            {review.comment && <p className="text-gray-600 italic">"{review.comment}"</p>}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500">No reviews yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={profileUser}
                onSave={async (updatedData) => {
                    try {
                        const token = localStorage.getItem('token');
                        const config = { headers: { Authorization: `Bearer ${token}` } };
                        const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, updatedData, config);

                        setProfileUser(prev => ({
                            ...prev,
                            name: res.data.name,
                            location: res.data.location,
                            about: res.data.bio,
                            avatar: res.data.avatar,
                            skillsWanted: res.data.skillsWanted
                        }));

                        // Update global auth context with EVERYTHING to ensure consistency
                        if (updateUserState) {
                            updateUserState(res.data);
                        }

                        setToastMessage('Profile updated successfully!');
                        setShowSuccessToast(true);
                        setTimeout(() => setShowSuccessToast(false), 3000);
                    } catch (error) {
                        console.error('Failed to update profile:', error);
                        alert('Failed to update profile. Please try again.');
                    }
                }}
            />

            <RequestSwapModal
                isOpen={isSwapModalOpen}
                onClose={() => setIsSwapModalOpen(false)}
                skill={selectedSkill}
                onSuccess={() => {
                    setToastMessage(`Swap request sent to ${profileUser.name}!`);
                    setShowSuccessToast(true);
                    setTimeout(() => setShowSuccessToast(false), 3000);
                }}
            />

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-green-500 p-1 rounded-full">
                        <CheckCircle size={16} />
                    </div>
                    <span className="font-bold text-sm">{toastMessage}</span>
                </div>
            )}
        </div>
    );
};

export default Profile;
