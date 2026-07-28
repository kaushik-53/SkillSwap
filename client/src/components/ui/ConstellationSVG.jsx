import { useEffect, useRef, useState } from 'react';

/**
 * ConstellationSVG — animated SVG network of nodes & edges.
 * Nodes continuously float/drift using requestAnimationFrame.
 *
 * Props:
 *   size    — 'hero' | 'compact'  (default 'hero')
 *   animate — bool (default true) — false = static snapshot
 */

const HERO_NODES = [
    { id: 1, cx: 260, cy: 200, r: 7, delay: 0 },
    { id: 2, cx: 120, cy: 310, r: 5, delay: 0.2 },
    { id: 3, cx: 400, cy: 130, r: 5, delay: 0.15 },
    { id: 4, cx: 340, cy: 360, r: 6, delay: 0.3 },
    { id: 5, cx: 160, cy: 140, r: 4, delay: 0.4 },
    { id: 6, cx: 470, cy: 290, r: 4, delay: 0.25 },
    { id: 7, cx: 80,  cy: 440, r: 3, delay: 0.5 },
    { id: 8, cx: 430, cy: 440, r: 4, delay: 0.35 },
    { id: 9, cx: 230, cy: 460, r: 3, delay: 0.45 },
    { id: 10, cx: 510, cy: 170, r: 3, delay: 0.55 },
];

const HERO_EDGES = [
    [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
    [2, 5], [2, 7], [3, 6], [3, 10],
    [4, 8], [4, 9], [6, 8], [7, 9],
];

const COMPACT_NODES = [
    { id: 1, cx: 120, cy: 120, r: 6, delay: 0 },
    { id: 2, cx: 60,  cy: 190, r: 4, delay: 0.15 },
    { id: 3, cx: 200, cy: 75,  r: 4, delay: 0.1 },
    { id: 4, cx: 185, cy: 200, r: 5, delay: 0.25 },
    { id: 5, cx: 60,  cy: 60,  r: 3, delay: 0.3 },
    { id: 6, cx: 240, cy: 150, r: 3, delay: 0.2 },
];

const COMPACT_EDGES = [
    [1, 2], [1, 3], [1, 4], [1, 5], [3, 6], [4, 6], [2, 5],
];

// Generate a unique, deterministic float config per node
const makeFloatConfig = (id) => ({
    // Each node gets its own frequency and phase so they move independently
    freqX: 0.0003 + (id * 0.00007 % 0.0002),
    freqY: 0.00025 + (id * 0.00009 % 0.0002),
    ampX: 10 + (id * 3.7 % 12),   // drift amplitude in px
    ampY: 8 + (id * 2.9 % 10),
    phaseX: id * 1.3,
    phaseY: id * 0.9,
});

const ConstellationSVG = ({ size = 'hero', animate = true }) => {
    const isHero = size === 'hero';
    const baseNodes = isHero ? HERO_NODES : COMPACT_NODES;
    const edges = isHero ? HERO_EDGES : COMPACT_EDGES;
    const vb = isHero ? '0 0 560 500' : '0 0 280 250';

    // Float configs computed once per node
    const floatConfigs = baseNodes.map(n => makeFloatConfig(n.id));

    // Live node positions driven by rAF
    const [positions, setPositions] = useState(() =>
        baseNodes.map(n => ({ cx: n.cx, cy: n.cy }))
    );

    const rafRef = useRef(null);

    useEffect(() => {
        if (!animate) return;

        const tick = (time) => {
            setPositions(baseNodes.map((n, i) => {
                const cfg = floatConfigs[i];
                return {
                    cx: n.cx + Math.sin(time * cfg.freqX + cfg.phaseX) * cfg.ampX,
                    cy: n.cy + Math.cos(time * cfg.freqY + cfg.phaseY) * cfg.ampY,
                };
            }));
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [animate]); // eslint-disable-line

    const getPos = (id) => {
        const idx = baseNodes.findIndex(n => n.id === id);
        return positions[idx] || { cx: 0, cy: 0 };
    };

    // Unique id to avoid gradient/filter id collisions if used multiple times on same page
    const uid = useRef(Math.random().toString(36).slice(2, 7)).current;

    return (
        <svg
            viewBox={vb}
            width="100%"
            height="100%"
            style={{ overflow: 'visible' }}
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`ember-node-${uid}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--ember)" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--ember)" stopOpacity="0.3" />
                </radialGradient>
                <radialGradient id={`current-node-${uid}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--current)" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--current)" stopOpacity="0.3" />
                </radialGradient>
                <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Edges — recomputed every frame since node positions drift */}
            {edges.map(([a, b], i) => {
                const pa = getPos(a);
                const pb = getPos(b);
                return (
                    <line
                        key={`e-${i}`}
                        x1={pa.cx} y1={pa.cy}
                        x2={pb.cx} y2={pb.cy}
                        stroke={`url(#current-node-${uid})`}
                        strokeWidth="1"
                        opacity="0.25"
                        style={animate ? {
                            transition: 'none',
                        } : {}}
                    />
                );
            })}

            {/* Nodes */}
            {baseNodes.map((node, i) => {
                const isEmber = i % 3 === 0;
                const pos = positions[i];
                return (
                    <g key={node.id} filter={`url(#glow-${uid})`}>
                        {/* Outer ring */}
                        <circle
                            cx={pos.cx} cy={pos.cy}
                            r={node.r + 4}
                            fill="none"
                            stroke={isEmber ? 'var(--ember)' : 'var(--current)'}
                            strokeWidth="0.8"
                            opacity="0.2"
                            style={animate ? {
                                animation: `node-pulse 2.5s ease-in-out ${node.delay + 0.1}s infinite`,
                            } : { opacity: 0.2 }}
                        />
                        {/* Core node */}
                        <circle
                            cx={pos.cx} cy={pos.cy}
                            r={node.r}
                            fill={isEmber ? `url(#ember-node-${uid})` : `url(#current-node-${uid})`}
                            style={animate ? {
                                animation: `node-pulse 2.5s ease-in-out ${node.delay + 0.8}s infinite`,
                            } : { opacity: 1 }}
                        />
                    </g>
                );
            })}
        </svg>
    );
};

export default ConstellationSVG;
