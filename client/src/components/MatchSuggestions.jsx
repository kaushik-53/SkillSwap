import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCw, Sparkles, User, AlertCircle, HelpCircle } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import ExchangeSeal from './ui/ExchangeSeal';

const MatchSuggestions = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionStatus, setActionStatus] = useState({}); // To track proposal button loading states

    const fetchMatches = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills/matches`, config);
            setMatches(res.data);
        } catch (err) {
            console.error('Error fetching match recommendations:', err);
            setError('Could not load smart suggestions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const handleProposeSwap = (matchId, users) => {
        setActionStatus(prev => ({ ...prev, [matchId]: 'proposing' }));
        setTimeout(() => {
            setActionStatus(prev => ({ ...prev, [matchId]: 'proposed' }));
        }, 1500);
    };

    if (loading) {
        return (
            <div className="glass" style={{ padding: 24, borderRadius: 'var(--r-xl)', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <Sparkles size={18} className="animate-pulse" style={{ color: 'var(--ember)' }} />
                    <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-hi)' }}>
                        Finding swap loops...
                    </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[1, 2].map(i => (
                        <div key={i} className="skeleton" style={{ height: 110, width: '100%', borderRadius: 12 }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass" style={{ padding: 20, borderRadius: 'var(--r-xl)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(248,113,113,0.2)' }}>
                <AlertCircle size={20} style={{ color: '#F87171' }} />
                <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>{error}</span>
                <button onClick={fetchMatches} style={{ background: 'none', border: 'none', color: 'var(--current)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <RefreshCw size={14} />
                </button>
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="glass" style={{ padding: 24, borderRadius: 'var(--r-xl)', marginBottom: 24, textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <Sparkles size={18} style={{ color: 'var(--text-low)' }} />
                    <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-hi)' }}>
                        Smart Match Recommendations
                    </h3>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-low)', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
                    No circular loops found yet. Try adding more skills you want in your profile to trigger the loop matching engine!
                </p>
            </div>
        );
    }

    return (
        <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Sparkles size={20} style={{ color: 'var(--ember)', filter: 'drop-shadow(0 0 8px var(--ember-glow))' }} />
                    <div>
                        <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-hi)' }}>
                            Smart Swap Recommendations
                        </h2>
                        <p style={{ fontSize: 11, color: 'var(--text-low)', fontFamily: 'Space Mono, monospace', marginTop: 2 }}>
                            ALGORITHMIC MATCH LOOPS ACTIVE
                        </p>
                    </div>
                </div>
                <button 
                    onClick={fetchMatches} 
                    className="btn-ghost" 
                    style={{ padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
                >
                    <RefreshCw size={12} /> Refresh
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <AnimatePresence>
                    {matches.map((match, idx) => {
                        const matchId = `match-${idx}`;
                        const isProposed = actionStatus[matchId] === 'proposed';
                        const isProposing = actionStatus[matchId] === 'proposing';

                        return (
                            <motion.div
                                key={matchId}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.3, delay: idx * 0.08 }}
                            >
                                <GlassCard style={{ padding: 24, borderRadius: 'var(--r-xl)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                                        <span style={{ 
                                            fontFamily: 'Space Mono, monospace', 
                                            fontSize: 9, 
                                            fontWeight: 700, 
                                            padding: '4px 10px', 
                                            borderRadius: 100, 
                                            background: match.type === '3-way' ? 'var(--ember-dim)' : 'var(--current-dim)', 
                                            color: match.type === '3-way' ? 'var(--ember)' : 'var(--current)',
                                            letterSpacing: '0.08em' 
                                        }}>
                                            {match.type === '3-way' ? '3-PARTY LOOP MATCH' : 'DIRECT SWAP MATCH'}
                                        </span>

                                        <button 
                                            onClick={() => handleProposeSwap(matchId, match.users)}
                                            disabled={isProposed || isProposing}
                                            className={isProposed ? "btn-ghost" : "btn-current"}
                                            style={{ 
                                                padding: '8px 16px', 
                                                borderRadius: 10, 
                                                fontSize: 12, 
                                                fontWeight: 700,
                                                minWidth: 140,
                                            }}
                                        >
                                            {isProposing ? 'Contacting...' : isProposed ? '✓ Loop Proposal Sent' : 'Propose Swap Loop'}
                                        </button>
                                    </div>

                                    {/* Visual Graph Loop representation */}
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-around', 
                                        background: 'rgba(255,255,255,0.01)', 
                                        border: '1px solid var(--glass-border)', 
                                        borderRadius: 14, 
                                        padding: '16px 12px',
                                        flexWrap: 'wrap',
                                        gap: 16
                                    }}>
                                        {match.users.map((member, mIdx) => (
                                            <div key={mIdx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                {/* Node User profile */}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100, textAlign: 'center' }}>
                                                    <div style={{ position: 'relative', marginBottom: 8 }}>
                                                        <div style={{
                                                            width: 44, height: 44,
                                                            borderRadius: '50%',
                                                            border: `2px solid ${mIdx === 0 ? 'var(--ember)' : 'var(--glass-border)'}`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            background: 'var(--ink-2)',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {member.avatar ? (
                                                                <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <User size={18} style={{ color: 'var(--text-low)' }} />
                                                            )}
                                                        </div>
                                                        <span style={{ 
                                                            position: 'absolute', 
                                                            bottom: -2, right: -2, 
                                                            width: 16, height: 16, 
                                                            borderRadius: '50%', 
                                                            background: 'var(--ink-2)', 
                                                            border: '1px solid var(--glass-border)', 
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                            fontSize: 9, fontFamily: 'Space Mono, monospace', fontWeight: 800, color: 'var(--text-low)' 
                                                        }}>
                                                            {mIdx + 1}
                                                        </span>
                                                    </div>
                                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hi)', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                                                        {mIdx === 0 ? 'You' : member.name.split(' ')[0]}
                                                    </span>
                                                    <span style={{ 
                                                        fontSize: 10, 
                                                        color: 'var(--text-low)', 
                                                        marginTop: 2, 
                                                        background: 'rgba(255,255,255,0.03)', 
                                                        padding: '2px 8px', 
                                                        borderRadius: 6,
                                                        border: '1px solid var(--glass-border)',
                                                        width: '100%',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }} title={member.teaches}>
                                                        {member.teaches}
                                                    </span>
                                                </div>

                                                {/* Edge connection arrow */}
                                                {mIdx < match.users.length - 1 && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                                        <ArrowRight size={16} style={{ color: 'var(--text-low)' }} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Cycle indicator pointing back from last user to first user */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.5, borderLeft: '1px dashed var(--glass-border)', paddingLeft: 12 }}>
                                            <span style={{ fontSize: 10, fontFamily: 'Space Mono, monospace', color: 'var(--text-low)' }}>
                                                closes loop
                                            </span>
                                            <ExchangeSeal size={18} triggered={false} />
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MatchSuggestions;
