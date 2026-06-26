import { useEffect, useRef } from 'react';

/**
 * ConstellationSVG — animated SVG network of nodes & edges.
 * Represents "finding a match" — the Discovery Constellation.
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

const ConstellationSVG = ({ size = 'hero', animate = true }) => {
    const isHero = size === 'hero';
    const nodes = isHero ? HERO_NODES : COMPACT_NODES;
    const edges = isHero ? HERO_EDGES : COMPACT_EDGES;
    const vb = isHero ? '0 0 560 500' : '0 0 280 250';
    const w = isHero ? '100%' : '100%';
    const h = isHero ? '100%' : '100%';

    const getNode = (id) => nodes.find(n => n.id === id);

    // Unique animation id to avoid conflicts on same page
    const uid = Math.random().toString(36).slice(2, 7);

    return (
        <svg
            viewBox={vb}
            width={w}
            height={h}
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

            {/* Edges */}
            {edges.map(([a, b], i) => {
                const na = getNode(a);
                const nb = getNode(b);
                if (!na || !nb) return null;
                const len = Math.hypot(nb.cx - na.cx, nb.cy - na.cy);
                const edgeStroke = `url(#current-node-${uid})`;
                return (
                    <line
                        key={`e-${i}`}
                        x1={na.cx} y1={na.cy}
                        x2={nb.cx} y2={nb.cy}
                        stroke={edgeStroke}
                        strokeWidth="1"
                        opacity="0.25"
                        style={animate ? {
                            strokeDasharray: len,
                            strokeDashoffset: len,
                            animation: `constellation-draw 1s ease forwards`,
                            animationDelay: `${na.delay + 0.3}s`,
                        } : { strokeDashoffset: 0 }}
                    />
                );
            })}

            {/* Nodes */}
            {nodes.map((node, i) => {
                const isEmber = i % 3 === 0;
                return (
                    <g key={node.id} filter={`url(#glow-${uid})`}>
                        {/* Outer ring */}
                        <circle
                            cx={node.cx} cy={node.cy}
                            r={node.r + 4}
                            fill="none"
                            stroke={isEmber ? 'var(--ember)' : 'var(--current)'}
                            strokeWidth="0.8"
                            opacity="0.2"
                            style={animate ? {
                                opacity: 0,
                                animation: `constellation-draw 0.5s ease forwards`,
                                animationDelay: `${node.delay + 0.1}s`,
                            } : { opacity: 0.2 }}
                        />
                        {/* Core node */}
                        <circle
                            cx={node.cx} cy={node.cy}
                            r={node.r}
                            fill={isEmber ? `url(#ember-node-${uid})` : `url(#current-node-${uid})`}
                            style={animate ? {
                                opacity: 0,
                                animation: `constellation-draw 0.6s ease forwards, node-pulse 2.5s ease-in-out infinite`,
                                animationDelay: `${node.delay}s, ${node.delay + 0.8}s`,
                            } : { opacity: 1 }}
                        />
                    </g>
                );
            })}
        </svg>
    );
};

export default ConstellationSVG;
