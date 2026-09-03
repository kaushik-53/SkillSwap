import { useState } from 'react';
import { QrCode, CheckCircle, Clock, IndianRupee, Coins, AlertCircle, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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

    const isCompleted = request?.status === 'Completed';
    const exchangeType = request?.exchangeType;
    const paymentStatus = request?.paymentStatus;
    const agreedAmount = request?.agreedAmount || 0;
    const isRequester = request?.sender?._id === currentUser?._id || request?.sender === currentUser?._id;
    const isMentor = !isRequester; // receiver = mentor

    const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // ── SkillCredits Settlement ──────────────────────────────────────────────
    const handleSettleCredits = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API}/api/payments/settle-credits`, { requestId: request._id }, config);
            onUpdate?.(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to settle SkillCredits.');
        } finally {
            setLoading(false);
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
            const res = await axios.post(`${API}/api/payments/submit-utr`, {
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
            const res = await axios.post(`${API}/api/payments/confirm-receipt`, { requestId: request._id }, config);
            onUpdate?.(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to confirm receipt.');
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
            {exchangeType === 'SkillCredits' && paymentStatus !== 'Settled' && isCompleted && (
                <div>
                    {isRequester ? (
                        <div>
                            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 12 }}>
                                Click below to transfer <strong>1 SkillCredit</strong> from your wallet to the mentor as payment for this session.
                            </p>
                            <button
                                onClick={handleSettleCredits}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: 12,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 14,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1,
                                }}
                            >
                                {loading ? 'Processing...' : '🪙 Transfer 1 SkillCredit to Mentor'}
                            </button>
                        </div>
                    ) : (
                        <p style={{ fontSize: 13, color: 'var(--text-low)', textAlign: 'center' }}>
                            Waiting for the learner to transfer SkillCredit(s) to you...
                        </p>
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

                    {/* Student waiting state */}
                    {isRequester && paymentStatus === 'PaidByStudent' && (
                        <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-low)' }}>
                            <Clock size={28} style={{ margin: '0 auto 8px', color: '#f59e0b' }} />
                            <p style={{ fontSize: 13 }}>UTR submitted. Waiting for mentor to confirm receipt.</p>
                            <p style={{ fontSize: 11, marginTop: 4 }}>UTR: <strong style={{ color: 'var(--text-hi)' }}>{request.paymentDetails?.utrNumber}</strong></p>
                        </div>
                    )}

                    {/* Step 2 — Mentor confirms */}
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
                            <p style={{ fontSize: 12, color: 'var(--text-low)', marginBottom: 10 }}>
                                Please check your bank / UPI app to verify you've received ₹{agreedAmount} and then confirm below.
                            </p>
                            <button
                                onClick={handleConfirmReceipt}
                                disabled={loading}
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
                                    opacity: loading ? 0.6 : 1,
                                }}
                            >
                                {loading ? 'Confirming...' : '✅ Confirm Payment Received'}
                            </button>
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
