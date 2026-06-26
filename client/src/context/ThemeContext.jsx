import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // 1. Persisted preference
        const saved = localStorage.getItem('skillswap-theme');
        if (saved === 'light' || saved === 'dark') return saved;
        // 2. System preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // Apply data-theme to <html> whenever theme changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('skillswap-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
