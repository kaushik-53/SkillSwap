import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ExchangeSeal — the product's most distinctive interaction.
 * Two interlocking arcs draw toward each other and lock with a glow pulse.
 * 
 * Props:
 *   triggered  — bool: when true, plays the full draw animation
 *   size       — number (viewBox units, default 80)
 *   onComplete — callback fired after animation completes
 * 
 * When triggered=false: static two-arc icon (use in buttons/badges).
 * Respects prefers-reduced-motion: resolves instantly with static icon.
 */

const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ExchangeSeal = ({ triggered = false, size = 80, onComplete }) => {
    const [phase, setPhase] = useState('idle'); // idle | drawing | locked

    useEffect(() => {
        if (!triggered) {
            setPhase('idle');
            return;
        }
        if (prefersReduced()) {
            setPhase('locked');
            onComplete?.();
            return;
        }
        setPhase('drawing');
        const t = setTimeout(() => {
            setPhase('locked');
            onComplete?.();
        }, 800);
        return () => clearTimeout(t);
    }, [triggered]);

    const center = size / 2;
    const r = size * 0.34;
    const circumference = 2 * Math.PI * r;

    return (
        <motion.div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: size,
                height: size,
                position: 'relative',
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{
                    filter: phase === 'locked'
                        ? 'drop-shadow(0 0 8px var(--ember)) drop-shadow(0 0 8px var(--current))'
                        : 'none',
                    transition: 'filter 0.4s ease',
                    animation: phase === 'locked' ? 'seal-glow-pulse 1.6s ease 1' : 'none',
                }}
            >
                {/* Ember arc (top-left, clockwise) */}
                <circle
                    cx={center} cy={center}
                    r={r}
                    fill="none"
                    stroke="var(--ember)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                        phase === 'idle'
                            ? circumference * 0.6  // partial static
                            : phase === 'drawing'
                                ? circumference * 0.1  // nearly full, animated
                                : 0  // full
                    }
                    transform={`rotate(-90 ${center} ${center})`}
                    style={{
                        transition: phase === 'drawing'
                            ? 'stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                            : phase === 'locked'
                                ? 'stroke-dashoffset 0.15s ease'
                                : 'none',
                    }}
                    opacity={phase === 'idle' ? 0.55 : 1}
                />

                {/* Current arc (bottom-right, counter-clockwise) */}
                <circle
                    cx={center} cy={center}
                    r={r}
                    fill="none"
                    stroke="var(--current)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                        phase === 'idle'
                            ? circumference * 0.6
                            : phase === 'drawing'
                                ? circumference * 0.1
                                : 0
                    }
                    transform={`rotate(90 ${center} ${center})`}
                    style={{
                        transition: phase === 'drawing'
                            ? 'stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.05s'
                            : phase === 'locked'
                                ? 'stroke-dashoffset 0.15s ease'
                                : 'none',
                    }}
                    opacity={phase === 'idle' ? 0.55 : 1}
                />

                {/* Lock center glyph (appears on locked) */}
                {phase === 'locked' && (
                    <>
                        <rect x={center - 7} y={center - 4} width={14} height={10} rx="2.5"
                            fill="var(--text-hi)" opacity="0.9" />
                        <path
                            d={`M${center - 4},${center - 4} V${center - 7} a4,4 0 0,1 8,0 V${center - 4}`}
                            fill="none"
                            stroke="var(--text-hi)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            opacity="0.9"
                        />
                    </>
                )}

                {/* Idle interlocking marker */}
                {phase === 'idle' && (
                    <>
                        <circle cx={center - 6} cy={center} r={2.5}
                            fill="var(--ember)" opacity="0.8" />
                        <circle cx={center + 6} cy={center} r={2.5}
                            fill="var(--current)" opacity="0.8" />
                    </>
                )}
            </svg>
        </motion.div>
    );
};

export default ExchangeSeal;
