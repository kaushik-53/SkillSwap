/**
 * StatusBadge — maps Request status enum to visual pill.
 * Status is always readable by label + icon, never color alone.
 * 
 * Props:
 *   status — 'pending' | 'accepted' | 'rejected' | 'completed' | 'finalized'
 *   (case-insensitive)
 */

const PulsingDot = ({ color }) => (
    <span
        style={{
            display: 'inline-block',
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: color,
            animation: 'pulse-dot 1.4s ease-in-out infinite',
            flexShrink: 0,
        }}
    />
);

// Tiny lock glyph for finalized
const LockGlyph = () => (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
        <rect x="1" y="5.5" width="10" height="6" rx="1.5" fill="currentColor" opacity="0.7" />
        <path d="M3.5 5.5V4a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
);

// Checkmark for completed / accepted
const CheckGlyph = () => (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
        <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// X for rejected
const XGlyph = () => (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
        <line x1="3" y1="3" x2="9" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="3" x2="3" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const CONFIG = {
    pending: {
        label: 'Pending',
        icon: <PulsingDot color="var(--status-pending)" />,
        style: {
            background: 'rgba(100,116,139,0.18)',
            color: '#94A3B8',
            border: '1px solid rgba(100,116,139,0.30)',
        },
    },
    accepted: {
        label: 'Accepted',
        icon: <CheckGlyph />,
        style: {
            background: 'rgba(94,234,212,0.12)',
            color: 'var(--current)',
            border: '1px solid rgba(94,234,212,0.30)',
        },
    },
    completed: {
        label: 'Completed',
        icon: <CheckGlyph />,
        style: {
            background: 'linear-gradient(90deg, rgba(255,138,91,0.18), rgba(94,234,212,0.18))',
            color: 'var(--text-hi)',
            border: '1px solid rgba(255,255,255,0.15)',
        },
    },
    finalized: {
        label: 'Finalized',
        icon: <LockGlyph />,
        style: {
            background: 'rgba(129,140,248,0.18)',
            color: '#A5B4FC',
            border: '1px solid rgba(129,140,248,0.35)',
        },
    },
    rejected: {
        label: 'Declined',
        icon: <XGlyph />,
        style: {
            background: 'rgba(127,79,79,0.18)',
            color: '#F87171',
            border: '1px solid rgba(127,79,79,0.35)',
        },
    },
};

const StatusBadge = ({ status = 'pending', className = '' }) => {
    const key = (status || 'pending').toLowerCase();
    const cfg = CONFIG[key] || CONFIG.pending;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest ${className}`}
            style={cfg.style}
        >
            {cfg.icon}
            {cfg.label}
        </span>
    );
};

export default StatusBadge;
