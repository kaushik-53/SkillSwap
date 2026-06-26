import { useState } from 'react';

/**
 * Button — design-system button
 * Props:
 *   variant  — 'ember' | 'current' | 'ghost' | 'danger'
 *   loading  — bool: shows dual-arc spinner, preserves width
 *   size     — 'sm' | 'md' | 'lg'
 *   children, className, disabled, ...rest
 */

const DualArcSpinner = () => (
    <span
        style={{
            display: 'inline-block',
            width: 18,
            height: 18,
            border: '2.5px solid transparent',
            borderTopColor: 'var(--ember)',
            borderBottomColor: 'var(--current)',
            borderRadius: '50%',
            animation: 'spin-dual 0.8s linear infinite',
            verticalAlign: 'middle',
        }}
        aria-hidden="true"
    />
);

const VARIANTS = {
    ember:   'btn-ember',
    current: 'btn-current',
    ghost:   'btn-ghost',
    danger:  'bg-[#7F2828] hover:bg-[#9B3333] text-[var(--text-hi)] border border-[rgba(255,100,100,0.25)] rounded-[var(--r-sm)] cursor-pointer transition-all',
};

const SIZES = {
    sm:  'px-4 py-2 text-sm',
    md:  'px-6 py-3 text-sm',
    lg:  'px-8 py-4 text-base',
};

const Button = ({
    variant = 'ghost',
    loading = false,
    size = 'md',
    children,
    className = '',
    disabled,
    ...rest
}) => {
    const base = `inline-flex items-center justify-center gap-2 font-bold transition-all select-none focus-visible:outline-2 focus-visible:outline-offset-3 ${SIZES[size]} ${VARIANTS[variant]}`;
    const isDisabled = disabled || loading;

    return (
        <button
            className={`${base} ${className} ${isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
            disabled={isDisabled}
            {...rest}
        >
            {loading ? <DualArcSpinner /> : children}
        </button>
    );
};

export default Button;
