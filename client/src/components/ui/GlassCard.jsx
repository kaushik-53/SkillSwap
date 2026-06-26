import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * GlassCard — the core glass-morphism primitive.
 * Props:
 *   className   — additional classes
 *   hoverTilt   — enable 3D cursor-driven tilt (max 6°)
 *   children
 */
const GlassCard = ({ children, className = '', hoverTilt = false, style = {}, ...rest }) => {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

    const handleMouseMove = (e) => {
        if (!hoverTilt || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        setTilt({ rotateX: -dy * 6, rotateY: dx * 6 });
    };

    const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

    return (
        <motion.div
            ref={cardRef}
            className={`glass ${className}`}
            style={{
                ...style,
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={hoverTilt ? { scale: 1.02, y: -4 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
