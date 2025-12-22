import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Carregar preferência salva
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDark(savedTheme === 'dark');
            applyTheme(savedTheme === 'dark');
        }
    }, []);

    const applyTheme = (dark) => {
        const root = document.documentElement;

        if (dark) {
            // Tema Escuro
            root.style.setProperty('--bg-primary', '#0f172a');
            root.style.setProperty('--bg-secondary', '#1e293b');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#94a3b8');
            root.style.setProperty('--border', 'rgba(255, 255, 255, 0.1)');
            root.style.setProperty('--glass-bg', 'rgba(30, 41, 59, 0.7)');
            root.style.setProperty('--card-bg', 'rgba(30, 41, 59, 0.5)');
            root.style.setProperty('--hover-bg', 'rgba(255, 255, 255, 0.05)');
            document.body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
        } else {
            // Tema Claro
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f1f5f9');
            root.style.setProperty('--text-primary', '#000000');
            root.style.setProperty('--text-secondary', '#475569');
            root.style.setProperty('--border', 'rgba(0, 0, 0, 0.1)');
            root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.9)');
            root.style.setProperty('--card-bg', 'rgba(248, 250, 252, 0.8)');
            root.style.setProperty('--hover-bg', 'rgba(0, 0, 0, 0.05)');
            document.body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
        }
    };

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: isDark
                    ? '1px solid rgba(255, 255, 255, 0.2)'
                    : '1px solid rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                zIndex: 9999,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
            {isDark ? (
                <Sun size={22} color="#ffffff" strokeWidth={2} />
            ) : (
                <Moon size={22} color="#000000" strokeWidth={2} />
            )}
        </button>
    );
}
