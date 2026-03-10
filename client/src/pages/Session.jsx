import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Mail, Phone, User as UserIcon, Star, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { getAvatarUrl } from '../utils/imageHelpers';

const Session = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Review state
    const [hasReviewed, setHasReviewed] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch Request details
                const { data: requestData } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests/${id}`, config);
                setRequest(requestData);

                // Check if already reviewed
                const { data: reviewData } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/check/${id}`, config);
                setHasReviewed(reviewData.hasReviewed);

            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to load session details.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchSessionData();
        }
    }, [id, user]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating.');
            return;
        }

        setSubmittingReview(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, {
                requestId: id,
                rating,
                comment
            }, config);

            setHasReviewed(true);
            alert('Review submitted successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 size={40} className="text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h2>
                    <p className="text-gray-500 mb-6">{error || 'This session might have been deleted or you do not have permission to view it.'}</p>
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const partner = request.sender._id === user._id ? request.receiver : request.sender;
    const isAcceptedOrCompleted = request.status === 'Accepted' || request.status === 'Completed';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 bg-white text-gray-400 hover:text-gray-900 rounded-full shadow-sm hover:shadow-md transition-all">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Swap Session</h1>
                            <p className="text-gray-500 font-medium mt-1">
                                Status: <span className={`font-bold ${request.status === 'Accepted' ? 'text-green-600' : request.status === 'Completed' ? 'text-blue-600' : 'text-orange-500'}`}>{request.status}</span>
                            </p>
                        </div>
                    </div>

                    {/* Complete Session - Both users must confirm */}
                    {request.status === 'Accepted' && (() => {
                        const hasCurrentUserMarked = request.completedBy?.some(id => id.toString() === user._id || id === user._id);
                        const confirmCount = request.completedBy?.length || 0;

                        return (
                            <div className="flex items-center gap-3">
                                {hasCurrentUserMarked ? (
                                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 font-bold text-sm px-5 py-2.5 rounded-xl">
                                        <CheckCircle size={16} className="text-yellow-500" />
                                        You confirmed ({confirmCount}/2) — Waiting for partner
                                    </div>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Mark your side as complete? The session will be fully closed once your partner also confirms.')) {
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    const { data } = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests/${request._id}`, { status: 'Completed' }, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    setRequest(data);
                                                } catch (e) {
                                                    alert(e.response?.data?.message || 'Failed to mark complete');
                                                }
                                            }
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white font-black text-sm px-6 py-3 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} />
                                        Mark My Side Complete ({confirmCount}/2)
                                    </button>
                                )}
                            </div>
                        );
                    })()}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Col: Partner & Details */}
                    <div className="space-y-8">
                        {/* Partner Contact Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Exchange Partner</h2>
                            <div className="flex items-start gap-4 mb-6">
                                <img src={getAvatarUrl(partner?.avatar, partner?.name)} alt={partner?.name} className="w-16 h-16 rounded-full object-cover shadow-sm bg-gray-100" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
                                    <div className="flex items-center gap-1 text-yellow-400 mt-1">
                                        <Star size={16} className="fill-current" />
                                        <span className="text-sm font-bold text-gray-700">{partner.rating ? partner.rating.toFixed(1) : 'New'}</span>
                                        <span className="text-sm text-gray-400 font-medium">({partner.reviewsCount || 0})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details (Only if Accepted/Completed or always? Let's say always if they are in session) */}
                            {(isAcceptedOrCompleted) ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <Mail size={18} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Email Address</p>
                                            <a href={`mailto:${partner.email}`} className="text-gray-900 font-medium hover:text-blue-600 truncate block">
                                                {partner.email}
                                            </a>
                                        </div>
                                    </div>

                                    {partner.phone && (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                                                <a href={`tel:${partner.phone}`} className="text-gray-900 font-medium hover:text-green-600">
                                                    {partner.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4 bg-orange-50 text-orange-700 rounded-2xl font-medium text-sm flex items-start gap-3">
                                    <UserIcon size={18} className="shrink-0 mt-0.5" />
                                    <p>Contact details will be revealed once the swap request is accepted.</p>
                                </div>
                            )}
                        </div>

                        {/* Skill Details */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Skill Details</h2>
                            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                <div className="flex gap-2">
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                        {request.skill?.category || 'Skill'}
                                    </span>
                                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                        {request.skill?.type || 'Exchange'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{request.skill?.title || 'Deleted Skill'}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {request.skill?.description || 'No description available.'}
                                </p>
                            </div>
                            <div className="mt-6">
                                <h4 className="text-sm font-bold text-gray-900 mb-2">Initial Message</h4>
                                <div className="p-4 bg-gray-50 rounded-2xl text-gray-600 text-sm italic">
                                    "{request.message}"
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Review System */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-8">

                            {/* Only the requester (sender) can leave a review */}
                            {request.sender._id !== user._id ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Star size={24} className="text-blue-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">Reviews are for Requesters</h3>
                                    <p className="text-gray-500 text-sm font-medium">The person who requested this swap will leave a review for your skill when the session is complete.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Leave a Review</h2>

                                    {request.status !== 'Completed' ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Star size={24} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium">You can leave a review once both parties mark the session as complete.</p>
                                        </div>
                                    ) : hasReviewed ? (
                                        <div className="text-center py-8 px-4 bg-green-50 rounded-2xl border border-green-100">
                                            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">Review Submitted</h3>
                                            <p className="text-sm text-gray-600 font-medium">Thank you for sharing your experience. Your review helps build trust in our community!</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3 text-center">How was your swap?</label>
                                                <div className="flex items-center justify-center gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            disabled={submittingReview}
                                                            onClick={() => setRating(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                            className="p-1 transition-transform hover:-translate-y-1 focus:outline-none"
                                                        >
                                                            <Star
                                                                size={36}
                                                                className={`transition-colors ${star <= (hoverRating || rating)
                                                                    ? 'text-yellow-400 fill-current'
                                                                    : 'text-gray-200'
                                                                    }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-2">
                                                    Share your experience (Optional)
                                                </label>
                                                <textarea
                                                    id="comment"
                                                    rows="4"
                                                    disabled={submittingReview}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none text-gray-900 placeholder:text-gray-400 font-medium text-sm"
                                                    placeholder="What did you learn? How was the communication?"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></textarea>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={submittingReview || rating === 0}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {submittingReview ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        <Send size={18} />
                                                        Submit Review
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Session;
