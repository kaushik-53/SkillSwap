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

export default Skeleton;
