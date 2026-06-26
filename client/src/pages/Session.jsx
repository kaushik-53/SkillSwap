import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Check, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { getAvatarUrl } from '../utils/imageHelpers';
import ExchangeSeal from '../components/ui/ExchangeSeal';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';
import { useToast } from '../components/ui/Toast';

/* Ledger entry — mono timestamp + event label */
const LedgerEntry = ({ timestamp, label, accent }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent || 'var(--text-low)', flexShrink: 0 }} />
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-low)', flexShrink: 0 }}>
            {timestamp ? new Date(timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-mid)' }}>{label}</span>
    </div>
);

const Session = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { show, Toast } = useToast();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMarkingComplete, setIsMarkingComplete] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [sealTriggered, setSealTriggered] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const fetchRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests/${id}`, config);
            setRequest(res.data);
            // Trigger seal if already completed
            if (res.data.status === 'Completed') setSealTriggered(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequest(); }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <ExchangeSeal size={80} triggered={false} />
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'var(--text-low)', marginTop: 20, letterSpacing: '0.1em' }}>
                        LOADING SESSION...
                    </p>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div>
                    <AlertCircle size={40} style={{ color: '#F87171', marginBottom: 16 }} />
                    <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--text-hi)', marginBottom: 8 }}>
                        Session not found
                    </h2>
                    <p style={{ color: 'var(--text-mid)', marginBottom: 24 }}>This swap session may have been removed.</p>
                    <button onClick={() => navigate('/my-swaps')} className="btn-ghost" style={{ padding: '10px 24px', borderRadius: 10 }}>
                        Back to My Swaps
                    </button>
                </div>
            </div>
        );
    }

    const isRequester = request.sender?._id === user?._id;
    const partner = isRequester ? request.receiver : request.sender;

    const hasCurrentUserConfirmed = request.completedBy?.some(id => id === user?._id || id?._id === user?._id);
    const confirmCount = request.completedBy?.length || 0;
    const isCompleted = request.status === 'Completed';
    const canReview = isCompleted && !reviewSubmitted;
    const canMarkComplete = request.status === 'Accepted' && !hasCurrentUserConfirmed;

    const handleMarkComplete = async () => {
        setIsMarkingComplete(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests/${id}/complete`, {}, config);
            await fetchRequest();
            show('Marked as complete!', 'success');
            setConfirmOpen(false);
        } catch (e) {
            show(e.response?.data?.message || 'Failed to mark complete.', 'error');
        } finally {
            setIsMarkingComplete(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!rating) { show('Please select a star rating.', 'info'); return; }
        setIsSubmittingReview(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, {
                rating,
                comment,
                reviewedUser: partner._id,
                requestId: id,
            }, config);
            show('Review submitted — the loop is closed!', 'success');
            setReviewSubmitted(true);
        } catch (e) {
            show(e.response?.data?.message || 'Failed to submit review.', 'error');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '32px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
            <Toast />

            {/* Status bar */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}
            >
                <div>
                    <h1 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--text-hi)', marginBottom: 8 }}>
                        Swap Session
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <StatusBadge status={request.status?.toLowerCase()} />
                        {isCompleted && (
                            <ExchangeSeal triggered={sealTriggered} size={36} onComplete={() => { }} />
                        )}
                    </div>
                </div>

                <div
                    className="glass-sm"
                    style={{ padding: '10px 18px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-low)', letterSpacing: '0.1em' }}>
                        {request.skill?.title}
                    </span>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
                {/* Partner Card */}
                <GlassCard style={{ padding: 32, borderRadius: 'var(--r-xl)' }}>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-low)', letterSpacing: '0.12em', marginBottom: 20 }}>
                        YOUR PARTNER
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                        <img
                            src={getAvatarUrl(partner?.avatar, partner?.name)}
                            alt={partner?.name}
                            style={{
                                width: 64, height: 64,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '3px solid var(--current)',
                                boxShadow: '0 0 20px var(--current-glow)',
                            }}
                        />
                        <div>
                            <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-hi)', marginBottom: 4 }}>
                                {partner?.name}
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-low)' }}>
                                <MapPin size={12} />
                                <span style={{ fontFamily: 'Space Mono, monospace' }}>
                                    {partner?.location || 'Unknown location'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Swap message */}
                    {request.message && (
                        <div style={{
                            padding: '14px 16px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 12,
                            marginBottom: 24,
                        }}>
                            <p style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'Space Mono, monospace', letterSpacing: '0.05em', marginBottom: 6 }}>
                                SWAP MESSAGE
                            </p>
                            <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.65, fontStyle: 'italic' }}>
                                "{request.message}"
                            </p>
                        </div>
                    )}

                    {/* Ledger */}
                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 20 }}>
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-low)', letterSpacing: '0.12em', marginBottom: 12 }}>
                            EXCHANGE LOG
                        </p>
                        <LedgerEntry timestamp={request.createdAt} label="Request initiated" accent="var(--text-low)" />
                        {request.status !== 'Pending' && (
                            <LedgerEntry timestamp={request.updatedAt} label="Request accepted" accent="var(--current)" />
                        )}
                        {isCompleted && (
                            <LedgerEntry timestamp={request.updatedAt} label="Exchange confirmed by both parties" accent="var(--ember)" />
                        )}
                    </div>
                </GlassCard>

                {/* Action Panel */}
                <GlassCard style={{ padding: 32, borderRadius: 'var(--r-xl)', display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Exchange Seal — the centrepiece */}
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <ExchangeSeal
                            triggered={sealTriggered}
                            size={100}
                            onComplete={() => { }}
                        />

                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--text-low)', letterSpacing: '0.1em', marginTop: 16 }}>
                            {isCompleted
                                ? 'EXCHANGE SEALED · BOTH CONFIRMED'
                                : confirmCount > 0
                                    ? `${confirmCount}/2 · WAITING FOR PARTNER`
                                    : 'PENDING DUAL-CONFIRMATION'
                            }
                        </p>

                        {/* Progress pips */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                            {[0, 1].map(i => (
                                <div key={i} style={{
                                    width: 32, height: 4,
                                    borderRadius: 100,
                                    background: i < confirmCount
                                        ? (i === 0 ? 'var(--ember)' : 'var(--current)')
                                        : 'var(--glass-border)',
                                    transition: 'background 0.4s ease',
                                }} />
                            ))}
                        </div>
                    </div>

                    {/* Mark Complete */}
                    {canMarkComplete && (
                        <>
                            <Button
                                variant="ember"
                                size="lg"
                                loading={isMarkingComplete}
                                onClick={() => setConfirmOpen(true)}
                                style={{ width: '100%', borderRadius: 14 }}
                            >
                                <Check size={16} />
                                Mark complete ({confirmCount + 1}/2)
                            </Button>

                            {/* Inline glass confirmation */}
                            <AnimatePresence>
                                {confirmOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{
                                            overflow: 'hidden',
                                            background: 'rgba(255,138,91,0.08)',
                                            border: '1px solid rgba(255,138,91,0.25)',
                                            borderRadius: 12,
                                            padding: 20,
                                        }}
                                    >
                                        <p style={{ fontSize: 13, color: 'var(--text-hi)', fontWeight: 600, marginBottom: 16 }}>
                                            Confirm this session is complete? Your partner will also need to confirm.
                                        </p>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <button onClick={handleMarkComplete} disabled={isMarkingComplete} className="btn-ember" style={{ flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
                                                Yes, confirm
                                            </button>
                                            <button onClick={() => setConfirmOpen(false)} className="btn-ghost" style={{ flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}

                    {/* Waiting for partner */}
                    {!canMarkComplete && !isCompleted && hasCurrentUserConfirmed && (
                        <div style={{
                            padding: '16px',
                            background: 'rgba(94,234,212,0.08)',
                            border: '1px solid rgba(94,234,212,0.2)',
                            borderRadius: 12,
                            textAlign: 'center',
                        }}>
                            <p style={{ fontSize: 13, color: 'var(--current)', fontWeight: 600, marginBottom: 4 }}>
                                ✓ You confirmed — waiting for your partner
                            </p>
                            <p style={{ fontSize: 12, color: 'var(--text-low)' }}>
                                The loop closes when both sides confirm.
                            </p>
                        </div>
                    )}

                    {/* Already completed indicator */}
                    {isCompleted && (
                        <div style={{
                            padding: '16px',
                            background: 'linear-gradient(135deg, rgba(255,138,91,0.1), rgba(94,234,212,0.1))',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 12,
                            textAlign: 'center',
                        }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-hi)', marginBottom: 4 }}>
                                Exchange complete!
                            </p>
                            <p style={{ fontSize: 12, color: 'var(--text-mid)' }}>
                                Both parties confirmed. Leave a review below.
                            </p>
                        </div>
                    )}
                </GlassCard>
            </div>

            {/* Review Form — unlocks after dual-confirm */}
            <AnimatePresence>
                {canReview && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <GlassCard style={{ padding: 36, borderRadius: 'var(--r-xl)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                                <ExchangeSeal triggered={false} size={40} />
                                <div>
                                    <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-hi)' }}>
                                        Review your partner
                                    </h3>
                                    <p style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'Space Mono, monospace' }}>
                                        VERIFIED EXCHANGE · SEAL ACTIVE
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitReview}>
                                {/* Stars */}
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', display: 'block', marginBottom: 12, letterSpacing: '0.05em' }}>
                                        RATING
                                    </label>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setRating(n)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: 4,
                                                    transition: 'transform 0.15s ease',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <Star
                                                    size={28}
                                                    style={{
                                                        color: n <= rating ? '#FBBF24' : 'var(--text-low)',
                                                        fill: n <= rating ? '#FBBF24' : 'none',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comment */}
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', display: 'block', marginBottom: 8, letterSpacing: '0.05em' }}>
                                        YOUR THOUGHTS <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                                    </label>
                                    <textarea
                                        placeholder="Describe your experience — what did you learn or teach?"
                                        className="glass-input"
                                        rows={4}
                                        style={{ resize: 'none', lineHeight: 1.65, padding: '14px 16px' }}
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                    />
                                </div>

                                <Button
                                    variant="current"
                                    loading={isSubmittingReview}
                                    size="lg"
                                    type="submit"
                                    style={{ width: '100%', borderRadius: 14 }}
                                >
                                    Submit review
                                </Button>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Review already submitted */}
            {reviewSubmitted && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass"
                    style={{ padding: '28px 36px', borderRadius: 'var(--r-xl)', textAlign: 'center' }}
                >
                    <ExchangeSeal triggered={true} size={56} />
                    <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-hi)', marginTop: 16, marginBottom: 8 }}>
                        Loop closed!
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--text-mid)', maxWidth: 360, margin: '0 auto' }}>
                        Your review is now part of the community ledger. Both parties have confirmed this exchange.
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default Session;
