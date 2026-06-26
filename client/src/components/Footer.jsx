import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* Seal Logo (reuse same SVG as Navbar) */
const SealLogo = () => (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="9" fill="none" stroke="var(--ember)" strokeWidth="2"
            strokeLinecap="round" strokeDasharray="56.5" strokeDashoffset="22" />
        <circle cx="14" cy="14" r="9" fill="none" stroke="var(--current)" strokeWidth="2"
            strokeLinecap="round" strokeDasharray="56.5" strokeDashoffset="22"
            transform="rotate(180 14 14)" />
        <circle cx="11" cy="14" r="1.6" fill="var(--ember)" opacity="0.9" />
        <circle cx="17" cy="14" r="1.6" fill="var(--current)" opacity="0.9" />
    </svg>
);

const Footer = () => {
    const { theme } = useTheme();
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const links = [
        { label: 'Explore', href: '/explore' },
        { label: 'About', href: '/about' },
        { label: 'Safety', href: '/safety' },
        { label: 'Terms', href: '/terms' },
        { label: 'Privacy', href: '/privacy' },
    ];

    const socials = [
        { icon: <Twitter size={16} />, href: '#', label: 'Twitter' },
        { icon: <Instagram size={16} />, href: '#', label: 'Instagram' },
        { icon: <Linkedin size={16} />, href: '#', label: 'LinkedIn' },
    ];

    return (
        <footer
            style={{
                borderTop: '1px solid var(--glass-border)',
                background: theme === 'dark' ? 'rgba(17,22,43,0.80)' : 'rgba(244,245,251,0.90)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                padding: '40px 0 24px',
                position: 'relative',
                zIndex: 10,
            }}
        >
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 24,
                    marginBottom: 32,
                }}>
                    {/* Brand */}
                    <div>
                        <Link
                            to="/"
                            onClick={scrollToTop}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                textDecoration: 'none',
                                marginBottom: 8,
                            }}
                        >
                            <SealLogo />
                            <span style={{
                                fontFamily: 'Cabinet Grotesk, sans-serif',
                                fontWeight: 800,
                                fontSize: 18,
                                color: 'var(--text-hi)',
                                letterSpacing: '-0.02em',
                            }}>
                                SkillSwap
                            </span>
                        </Link>
                        <p style={{
                            fontSize: 13,
                            color: 'var(--text-low)',
                            fontStyle: 'italic',
                            marginTop: 4,
                        }}>
                            Exchange skills, not money.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                        {links.map(l => (
                            <Link
                                key={l.label}
                                to={l.href}
                                style={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: 'var(--text-low)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={e => e.target.style.color = 'var(--text-hi)'}
                                onMouseLeave={e => e.target.style.color = 'var(--text-low)'}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Socials */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        {socials.map(s => (
                            <a
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                style={{
                                    width: 34,
                                    height: 34,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--glass)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 8,
                                    color: 'var(--text-low)',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = 'var(--current)';
                                    e.currentTarget.style.borderColor = 'var(--current)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'var(--text-low)';
                                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                                }}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: 20,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                }}>
                    <p style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'Space Mono, monospace' }}>
                        © {new Date().getFullYear()} SkillSwap
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-low)' }}>
                        Built with trust, not transactions.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
