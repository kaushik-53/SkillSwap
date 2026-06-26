import { useRef, useState, useEffect } from 'react';

/**
 * OtpInput — 6 boxed glass cells with auto-advance + auto-backtrack.
 * Props:
 *   value    — string (the 6-digit OTP)
 *   onChange — (otp: string) => void
 *   length   — defaults to 6
 *   onResend — callback for resend button
 *   resendTimer — countdown seconds (0 = resend enabled)
 */
const OtpInput = ({ value = '', onChange, length = 6, onResend, resendTimer = 0 }) => {
    const inputsRef = useRef([]);
    const [planeSent, setPlaneSent] = useState(false);

    const digits = Array.from({ length }, (_, i) => value[i] || '');

    const handleChange = (e, idx) => {
        const char = e.target.value.replace(/\D/g, '').slice(-1);
        const newVal = digits.map((d, i) => (i === idx ? char : d)).join('');
        onChange(newVal);
        if (char && idx < length - 1) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace') {
            if (!digits[idx] && idx > 0) {
                // Move back and clear
                const newVal = digits.map((d, i) => (i === idx - 1 ? '' : d)).join('');
                onChange(newVal);
                inputsRef.current[idx - 1]?.focus();
            } else {
                const newVal = digits.map((d, i) => (i === idx ? '' : d)).join('');
                onChange(newVal);
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        onChange(pasted.padEnd(length, '').slice(0, length));
        const focusIdx = Math.min(pasted.length, length - 1);
        inputsRef.current[focusIdx]?.focus();
    };

    const handleResend = () => {
        if (resendTimer > 0 || !onResend) return;
        setPlaneSent(true);
        onResend();
        setTimeout(() => setPlaneSent(false), 1000);
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                {digits.map((d, idx) => (
                    <input
                        key={idx}
                        ref={el => (inputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={e => handleChange(e, idx)}
                        onKeyDown={e => handleKeyDown(e, idx)}
                        onPaste={idx === 0 ? handlePaste : undefined}
                        aria-label={`OTP digit ${idx + 1}`}
                        style={{
                            width: 48,
                            height: 56,
                            textAlign: 'center',
                            fontSize: 22,
                            fontFamily: 'Space Mono, monospace',
                            fontWeight: 700,
                            letterSpacing: 0,
                            background: 'rgba(255,255,255,0.05)',
                            border: d
                                ? '1.5px solid var(--current)'
                                : '1.5px solid var(--glass-border)',
                            borderRadius: 12,
                            color: 'var(--text-hi)',
                            outline: 'none',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                            boxShadow: d ? '0 0 0 3px var(--current-dim)' : 'none',
                        }}
                        onFocus={e => {
                            e.target.style.borderColor = 'var(--current)';
                            e.target.style.boxShadow = '0 0 0 3px var(--current-dim)';
                        }}
                        onBlur={e => {
                            if (!e.target.value) {
                                e.target.style.borderColor = 'var(--glass-border)';
                                e.target.style.boxShadow = 'none';
                            }
                        }}
                    />
                ))}
            </div>

            {onResend && (
                <div style={{ textAlign: 'center' }}>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendTimer > 0}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: resendTimer > 0 ? 'default' : 'pointer',
                            color: resendTimer > 0 ? 'var(--text-low)' : 'var(--current)',
                            fontFamily: 'Space Mono, monospace',
                            fontSize: 12,
                            fontWeight: 700,
                            transition: 'color 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        {/* Paper-plane micro-icon */}
                        <svg
                            width="14" height="14" viewBox="0 0 24 24" fill="none"
                            style={{
                                animation: planeSent ? 'paper-plane 0.9s ease forwards' : 'none',
                            }}
                        >
                            <path d="M2 12l20-10-10 20v-9L2 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                        {resendTimer > 0
                            ? `Resend in ${resendTimer}s`
                            : 'Resend code'
                        }
                    </button>
                </div>
            )}
        </div>
    );
};

export default OtpInput;
