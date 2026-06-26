/**
 * Skeleton — glass-shaped shimmer placeholder.
 * Used in Explore + Dashboard while data is loading.
 * 
 * Props:
 *   variant — 'card' | 'line' | 'circle' | 'text'
 *   width, height — override sizes (CSS strings)
 *   className
 */

const Skeleton = ({ variant = 'line', width, height, className = '', style = {} }) => {
    const base = 'skeleton';

    if (variant === 'card') {
        return (
            <div
                className={`${base} ${className}`}
                style={{ width: width || '100%', height: height || 280, ...style }}
            />
        );
    }

    if (variant === 'circle') {
        const size = width || height || 48;
        return (
            <div
                className={`${base} rounded-full ${className}`}
                style={{ width: size, height: size, flexShrink: 0, ...style }}
            />
        );
    }

    if (variant === 'text') {
        return (
            <div
                className={`${base} ${className}`}
                style={{ width: width || '70%', height: height || 14, borderRadius: 8, ...style }}
            />
        );
    }

    // default: line
    return (
        <div
            className={`${base} ${className}`}
            style={{ width: width || '100%', height: height || 20, borderRadius: 8, ...style }}
        />
    );
};

// Preset: skill card skeleton
export const SkillCardSkeleton = () => (
    <div
        className="glass overflow-hidden"
        style={{ borderRadius: 'var(--r-lg)' }}
    >
        {/* Banner */}
        <Skeleton variant="card" height={144} style={{ borderRadius: 0 }} />
        <div style={{ padding: '56px 24px 24px' }}>
            {/* Avatar placeholder already overlapping */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Skeleton variant="text" width="50%" height={18} />
                <Skeleton variant="text" width={40} height={18} />
            </div>
            <Skeleton variant="text" width="70%" height={14} style={{ marginBottom: 12 }} />
            <Skeleton variant="text" width="90%" height={13} style={{ marginBottom: 6 }} />
            <Skeleton variant="text" width="75%" height={13} style={{ marginBottom: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="text" width={80} height={14} />
                <Skeleton variant="text" width={80} height={36} style={{ borderRadius: 12 }} />
            </div>
        </div>
    </div>
);

// Preset: Profile page skeleton loader
export const ProfileSkeleton = () => (
    <div style={{ padding: '32px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '28px', alignItems: 'start' }}>
            
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Profile card */}
                <div className="glass" style={{ borderRadius: 'var(--r-2xl)', overflow: 'hidden' }}>
                    {/* Cover Banner */}
                    <div style={{ height: 120, background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
                        <Skeleton variant="card" height={120} style={{ borderRadius: 0, opacity: 0.3 }} />
                    </div>
                    
                    <div style={{ padding: '0 28px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Avatar */}
                        <div style={{ marginTop: -40, marginBottom: 16 }}>
                            <Skeleton variant="circle" width={88} height={88} style={{ border: '4px solid var(--ink-2)' }} />
                        </div>
                        
                        {/* Name */}
                        <Skeleton variant="text" width="70%" height={20} style={{ marginBottom: 12 }} />
                        
                        {/* Location */}
                        <Skeleton variant="text" width="45%" height={12} style={{ marginBottom: 16 }} />
                        
                        {/* Rating */}
                        <Skeleton variant="text" width="55%" height={28} style={{ borderRadius: 100, marginBottom: 24 }} />
                        
                        {/* Buttons */}
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Skeleton variant="text" width="100%" height={40} style={{ borderRadius: 12 }} />
                            <Skeleton variant="text" width="100%" height={40} style={{ borderRadius: 12 }} />
                        </div>
                    </div>
                </div>
                
                {/* Stats */}
                <div className="glass" style={{ borderRadius: 'var(--r-xl)', padding: '20px 24px' }}>
                    <Skeleton variant="text" width="30%" height={10} style={{ marginBottom: 14 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid var(--glass-border)', paddingTop: 14 }}>
                        <div>
                            <Skeleton variant="text" width="80%" height={24} style={{ marginBottom: 6 }} />
                            <Skeleton variant="text" width="50%" height={10} />
                        </div>
                        <div>
                            <Skeleton variant="text" width="80%" height={24} style={{ marginBottom: 6 }} />
                            <Skeleton variant="text" width="50%" height={10} />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* About Card */}
                <div className="glass" style={{ padding: 32, borderRadius: 'var(--r-xl)' }}>
                    <Skeleton variant="text" width="25%" height={20} style={{ marginBottom: 16 }} />
                    <Skeleton variant="text" width="100%" height={14} style={{ marginBottom: 8 }} />
                    <Skeleton variant="text" width="95%" height={14} style={{ marginBottom: 8 }} />
                    <Skeleton variant="text" width="60%" height={14} />
                </div>
                
                {/* Skills Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Skills Offered */}
                    <div className="glass" style={{ padding: 28, borderRadius: 'var(--r-lg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <Skeleton variant="circle" width={36} height={36} style={{ borderRadius: 10 }} />
                            <Skeleton variant="text" width="40%" height={16} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {[1, 2].map((i) => (
                                <div key={i} style={{ paddingBottom: 20, borderBottom: i < 2 ? '1px solid var(--glass-border)' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Skeleton variant="text" width="60%" height={14} />
                                        <Skeleton variant="text" width="20%" height={14} />
                                    </div>
                                    <Skeleton variant="text" width="90%" height={12} style={{ marginBottom: 6 }} />
                                    <Skeleton variant="text" width="75%" height={12} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Skills Wanted */}
                    <div className="glass" style={{ padding: 28, borderRadius: 'var(--r-lg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <Skeleton variant="circle" width={36} height={36} style={{ borderRadius: 10 }} />
                            <Skeleton variant="text" width="40%" height={16} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[1, 2].map((i) => (
                                <div key={i} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 12 }}>
                                    <Skeleton variant="text" width="50%" height={14} style={{ marginBottom: 6 }} />
                                    <Skeleton variant="text" width="85%" height={12} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Reviews */}
                <div className="glass" style={{ padding: 32, borderRadius: 'var(--r-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                        <Skeleton variant="text" width="30%" height={20} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {[1, 2].map((i) => (
                            <div key={i} style={{ paddingBottom: 24, borderBottom: i < 2 ? '1px solid var(--glass-border)' : 'none', display: 'flex', gap: 14 }}>
                                <Skeleton variant="circle" width={44} height={44} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <Skeleton variant="text" width="35%" height={14} />
                                        <Skeleton variant="text" width="15%" height={12} />
                                    </div>
                                    <Skeleton variant="text" width="20%" height={12} style={{ marginBottom: 8 }} />
                                    <Skeleton variant="text" width="90%" height={12} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
        </div>
    </div>
);

export default Skeleton;
