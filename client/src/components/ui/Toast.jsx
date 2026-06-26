import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Toast — glass notification system (replaces alert()).
 * Props:
 *   message  — string
 *   type     — 'success' | 'error' | 'info'
 *   visible  — bool
 *   onHide   — callback
 *   duration — ms (default 3200)
 */
const ICONS = {
    success: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="var(--current)" strokeWidth="1.2" />
            <polyline points="4.5,8 7,10.5 11.5,5.5" stroke="var(--current)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    error: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="#F87171" strokeWidth="1.2" />
            <line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    info: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="var(--ember)" strokeWidth="1.2" />
            <line x1="8" y1="7" x2="8" y2="11" stroke="var(--ember)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.8" fill="var(--ember)" />
        </svg>
    ),
};

const Toast = ({ message, type = 'success', visible, onHide, duration = 3200 }) => {
    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => onHide?.(), duration);
        return () => clearTimeout(timer);
    }, [visible, duration, onHide]);

    return createPortal(
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{
                        position: 'fixed',
                        bottom: 32,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9998,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 24px',
                        borderRadius: 'var(--r-md)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        color: 'var(--text-hi)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 14,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                    }}
                    role="status"
                    aria-live="polite"
                >
                    {ICONS[type]}
                    {message}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

// Hook for easy use
export const useToast = () => {
    const [state, setState] = useState({ visible: false, message: '', type: 'success' });

    const show = (message, type = 'success') => setState({ visible: true, message, type });
    const hide = () => setState(s => ({ ...s, visible: false }));

    const ToastComponent = () => (
        <Toast
            message={state.message}
            type={state.type}
            visible={state.visible}
            onHide={hide}
        />
    );

    return { show, hide, Toast: ToastComponent };
};

export default Toast;
