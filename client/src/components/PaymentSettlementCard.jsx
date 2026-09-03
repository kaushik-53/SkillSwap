import { useState, useRef } from 'react';
import { QrCode, CheckCircle, Clock, IndianRupee, Coins, AlertCircle, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE from '../utils/api';

/**
 * Generates a standard NPCI UPI deep-link/intent URI.
 * Works with GPay, PhonePe, Paytm, BHIM, etc.
 */
const buildUpiIntent = ({ upiId, name, amount, note }) => {
    const params = new URLSearchParams({
        pa: upiId,
        pn: name || 'Mentor',
        am: String(amount),
        cu: 'INR',
        tn: note || 'SkillSwap Session Payment',
    });
    return `upi://pay?${params.toString()}`;
};

/**
 * Generates a QR code image URL using the free goqr.me API (no API key needed).
 */
const buildQrUrl = (upiIntent) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiIntent)}`;

const PaymentSettlementCard = ({ request, currentUser, onUpdate }) => {
    const [utrInput, setUtrInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const settlingRef = useRef(false); // prevents double-click race on credit transfer

    const isCompleted = request?.status === 'Completed';
    const exchangeType = request?.exchangeType;
    const paymentStatus = request?.paymentStatus;
    const agreedAmount = request?.agreedAmount || 0;
    const isRequester = request?.sender?._id === currentUser?._id || request?.sender === currentUser?._id;
    const isMentor = !isRequester; // receiver = mentor

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // ── SkillCredits Settlement ──────────────────────────────────────────────
    const handleSettleCredits = async () => {
        if (settlingRef.current) return; // hard lock — ignore any concurrent call
        settlingRef.current = true;
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_BASE}/api/payments/settle-credits`, { requestId: request._id }, config);
            onUpdate?.(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to settle SkillCredits.');
        } finally {
            setLoading(false);
            settlingRef.current = false;
        }
    };

    // ── UPI: Student submits UTR ──────────────────────────────────────────────
    const handleSubmitUtr = async () => {
        if (!utrInput.trim() || utrInput.trim().length < 6) {
            setError('Enter a valid UTR / transaction reference number.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_BASE}/api/payments/submit-utr`, {
                requestId: request._id,
                utrNumber: utrInput.trim()
            }, config);
            onUpdate?.(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit UTR.');
        } finally {
            setLoading(false);
        }
    };

    // ── UPI: Mentor confirms receipt ──────────────────────────────────────────
    const handleConfirmReceipt = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_BASE}/api/payments/confirm-receipt`, { requestId: request._id }, config);
            onUpdate?.(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to confirm receipt.');
        } finally {
            setLoading(false);
        }
    };

    // ── UPI: Mentor rejects wrong UTR ─────────────────────────────────────────
    const handleRejectUtr = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_BASE}/api/payments/reject-utr`, {
                requestId: request._id,
                reason: rejectReason.trim() || 'UTR not matched. Please make the payment and resubmit.'
            }, config);
            setShowRejectForm(false);
            setRejectReason('');
            onUpdate?.(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reject UTR.');
        } finally {
            setLoading(false);
        }
    };

    // ── Not a payment-enabled session ──────────────────────────────────────────
    if (!exchangeType || exchangeType === 'SkillSwap') return null;

    const upiId = request?.paymentDetails?.upiId;
    const mentorName = isMentor ? currentUser?.name : request?.receiver?.name || 'Mentor';
    const upiIntent = exchangeType === 'PaidUPI' && upiId
        ? buildUpiIntent({ upiId, name: mentorName, amount: agreedAmount, note: `SkillSwap: ${request?.skill?.title || 'Session'}` })
        : null;
    const qrUrl = upiIntent ? buildQrUrl(upiIntent) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: 16,
                padding: '20px 24px',
                marginTop: 16,
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                {exchangeType === 'SkillCredits' ? (
                    <span style={{ fontSize: 22 }}>🪙</span>
                ) : (
                    <span style={{ fontSize: 22 }}>💳</span>
                )}
                <div>
                    <p style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-hi)' }}>
                        {exchangeType === 'SkillCredits' ? 'SkillCredits Settlement' : 'UPI Payment'}
                    </p>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--text-low)' }}>
                        {exchangeType === 'SkillCredits'
                            ? `Transfer ${agreedAmount || 1} SkillCredit(s) to mentor`
                            : `Agreed amount: ₹${agreedAmount}`}
                    </p>
                </div>
                {paymentStatus === 'Settled' && (
                    <div style={{ marginLeft: 'auto', color: '#34d399', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle size={18} />
                        <span style={{ fontFamily: 'Space Mono', fontSize: 11, fontWeight: 700 }}>SETTLED</span>
                    </div>
                )}
            </div>

            {/* ── SkillCredits flow ── */}
            {exchangeType === 'SkillCredits' && (
                <div>
                    {paymentStatus === 'Settled' ? (
                        /* Already settled — show in header badge, nothing more to do here */
                        <p style={{ fontSize: 13, color: '#22c55e', textAlign: 'center', fontWeight: 600 }}>
                            🪙 SkillCredit transferred! You can now mark the session complete.
                        </p>
                    ) : isRequester ? (
                        /* Learner — show transfer button */
                        <div>
                            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 12 }}>
                                Transfer <strong>{agreedAmount || 1} SkillCredit</strong> to the mentor to unlock session completion.
                            </p>
                            <button
                                onClick={handleSettleCredits}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '13px',
                                    borderRadius: 12,
                                    border: 'none',
                                    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    color: '#fff',
                                    fontWeight: 800,
                                    fontSize: 14,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: loading ? 'none' : '0 4px 16px rgba(245,158,11,0.35)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {loading ? 'Processing...' : `🪙 Transfer ${agreedAmount || 1} SkillCredit to Mentor`}
                            </button>
                            <p style={{ fontSize: 11, color: 'var(--text-low)', textAlign: 'center', marginTop: 8 }}>
                                This unlocks the "Mark Complete" button for both of you.
                            </p>
                        </div>
                    ) : (
                        /* Mentor — waiting */
                        <div style={{ textAlign: 'center', padding: '8px 0' }}>
                            <Clock size={28} style={{ margin: '0 auto 8px', color: '#f59e0b' }} />
                            <p style={{ fontSize: 13, color: 'var(--text-low)' }}>
                                Waiting for the learner to transfer <strong>{agreedAmount || 1} SkillCredit</strong> to you.
                            </p>
                            <p style={{ fontSize: 11, color: 'var(--text-low)', marginTop: 4 }}>
                                Once transferred, both of you can mark the session complete.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ── UPI Payment flow ── */}
            {exchangeType === 'PaidUPI' && (
                <div>
                    {/* Step 1 — Student pays */}
                    {isRequester && paymentStatus === 'Pending' && (
                        <div>
                            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 16 }}>
                                Scan the QR below or use the button to pay <strong>₹{agreedAmount}</strong> to <strong>{upiId}</strong>
                            </p>
                            {qrUrl && (
                                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                    <img
                                        src={qrUrl}
                                        alt="UPI QR Code"
                                        style={{ width: 180, height: 180, borderRadius: 12, border: '2px solid var(--glass-border)', display: 'inline-block' }}
                                    />
                                </div>
                            )}
                            {upiIntent && (
                                <a
                                    href={upiIntent}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        padding: '12px',
                                        borderRadius: 12,
                                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: 14,
                                        textDecoration: 'none',
                                        marginBottom: 16,
                                    }}
                                >
                                    <ExternalLink size={16} />
                                    Open UPI App (GPay / PhonePe / Paytm)
                                </a>
                            )}
                            <p style={{ fontSize: 12, color: 'var(--text-low)', marginBottom: 8 }}>
                                After paying, enter your 12-digit UTR / Transaction Reference:
                            </p>
                            <input
                                type="text"
                                value={utrInput}
                                onChange={(e) => setUtrInput(e.target.value)}
                                placeholder="e.g. 421835619872"
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: 10,
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--text-hi)',
                                    fontSize: 14,
                                    marginBottom: 12,
                                    boxSizing: 'border-box',
                                }}
                            />
                            <button
                                onClick={handleSubmitUtr}
                                disabled={loading || !utrInput.trim()}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: 12,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 14,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading || !utrInput.trim() ? 0.6 : 1,
                                }}
                            >
                                {loading ? 'Submitting...' : "✅ Confirm I've Paid — Submit UTR"}
                            </button>
                        </div>
                    )}

                    {/* Student waiting state — or rejection notice */}
                    {isRequester && paymentStatus === 'Pending' && request.paymentDetails?.rejectionNote && (
                        <div>
                            {/* Rejection alert */}
                            <div style={{
                                background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                borderRadius: 12, padding: '12px 14px', marginBottom: 16,
                            }}>
                                <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 700, marginBottom: 4 }}>
                                    ⚠️ Your previous UTR was rejected
                                </p>
                                <p style={{ fontSize: 12, color: '#64748b' }}>
                                    Mentor said: <em>"{request.paymentDetails.rejectionNote}"</em>
                                </p>
                                <p style={{ fontSize: 12, color: '#dc2626', marginTop: 6, fontWeight: 600 }}>
                                    Please make the payment again and submit the correct UTR.
                                </p>
                            </div>
                            {/* Re-show QR and UTR input */}
                            {qrUrl && (
                                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                    <img src={qrUrl} alt="UPI QR Code" style={{ width: 160, height: 160, borderRadius: 12, border: '2px solid var(--glass-border)', display: 'inline-block' }} />
                                </div>
                            )}
                            {upiIntent && (
                                <a href={upiIntent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 10, background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', marginBottom: 12 }}>
                                    Open UPI App to Pay Again
                                </a>
                            )}
                            <input
                                type="text"
                                value={utrInput}
                                onChange={(e) => setUtrInput(e.target.value)}
                                placeholder="New UTR / Transaction Reference"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-hi)', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }}
                            />
                            <button
                                onClick={handleSubmitUtr}
                                disabled={loading || !utrInput.trim()}
                                style={{ width: '100%', padding: '11px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading || !utrInput.trim() ? 0.6 : 1 }}
                            >
                                {loading ? 'Submitting...' : '✅ Resubmit Correct UTR'}
                            </button>
                        </div>
                    )}

                    {/* Step 2 — Mentor confirms or rejects */}
                    {isMentor && paymentStatus === 'PaidByStudent' && (
                        <div>
                            <div style={{ background: 'rgba(34,197,94,0.08)', borderRadius: 12, padding: '12px 14px', marginBottom: 14, border: '1px solid rgba(34,197,94,0.2)' }}>
                                <p style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>
                                    Payment reported by learner!
                                </p>
                                <p style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 4 }}>
                                    Amount: <strong>₹{agreedAmount}</strong> · UTR: <strong>{request.paymentDetails?.utrNumber}</strong>
                                </p>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-low)', marginBottom: 12 }}>
                                Check your bank / UPI app to verify you received ₹{agreedAmount}, then confirm or reject.
                            </p>
                            <div style={{ display: 'flex', gap: 8, marginBottom: showRejectForm ? 12 : 0 }}>
                                <button
                                    onClick={handleConfirmReceipt}
                                    disabled={loading}
                                    style={{
                                        flex: 2, padding: '11px',
                                        borderRadius: 10, border: 'none',
                                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                        color: '#fff', fontWeight: 700, fontSize: 13,
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.6 : 1,
                                    }}
                                >
                                    ✅ Confirm — Money Received
                                </button>
                                <button
                                    onClick={() => setShowRejectForm(prev => !prev)}
                                    disabled={loading}
                                    style={{
                                        flex: 1, padding: '11px',
                                        borderRadius: 10,
                                        border: '1px solid rgba(239,68,68,0.35)',
                                        background: 'rgba(239,68,68,0.07)',
                                        color: '#ef4444', fontWeight: 700, fontSize: 13,
                                        cursor: 'pointer',
                                    }}
                                >
                                    ❌ Wrong UTR
                                </button>
                            </div>

                            {/* Expandable reject form */}
                            <AnimatePresence>
                                {showRejectForm && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            background: 'rgba(239,68,68,0.06)',
                                            border: '1px dashed rgba(239,68,68,0.3)',
                                            borderRadius: 10, padding: '12px 14px',
                                        }}>
                                            <p style={{ fontSize: 12, color: '#dc2626', fontWeight: 600, marginBottom: 8 }}>
                                                Rejection reason (shown to learner)
                                            </p>
                                            <input
                                                type="text"
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="e.g. UTR not found in my account, amount incorrect..."
                                                style={{
                                                    width: '100%', padding: '9px 12px',
                                                    borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)',
                                                    background: '#fff', fontSize: 13,
                                                    color: '#0f172a', marginBottom: 10,
                                                    boxSizing: 'border-box',
                                                }}
                                            />
                                            <button
                                                onClick={handleRejectUtr}
                                                disabled={loading}
                                                style={{
                                                    width: '100%', padding: '10px',
                                                    borderRadius: 8, border: 'none',
                                                    background: '#ef4444', color: '#fff',
                                                    fontWeight: 700, fontSize: 13,
                                                    cursor: loading ? 'not-allowed' : 'pointer',
                                                    opacity: loading ? 0.6 : 1,
                                                }}
                                            >
                                                {loading ? 'Rejecting...' : '❌ Reject & Ask Learner to Resubmit'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Mentor waiting for student */}
                    {isMentor && paymentStatus === 'Pending' && (
                        <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-low)' }}>
                            <Clock size={28} style={{ margin: '0 auto 8px', color: '#f59e0b' }} />
                            <p style={{ fontSize: 13 }}>Waiting for learner to scan QR and submit their UTR reference.</p>
                        </div>
                    )}

                    {/* Settled */}
                    {paymentStatus === 'Settled' && (
                        <div style={{ textAlign: 'center', color: '#34d399', padding: '8px 0' }}>
                            <CheckCircle size={32} style={{ margin: '0 auto 8px' }} />
                            <p style={{ fontWeight: 700, fontSize: 14 }}>Payment of ₹{agreedAmount} fully settled!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Error display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            marginTop: 12,
                            padding: '10px 14px',
                            borderRadius: 10,
                            background: 'rgba(248,113,113,0.1)',
                            border: '1px solid rgba(248,113,113,0.3)',
                            color: '#F87171',
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        <AlertCircle size={16} />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PaymentSettlementCard;
