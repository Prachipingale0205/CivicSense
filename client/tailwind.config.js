/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563EB',
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                },
                secondary: '#64748B',
                background: '#F8FAFC',
                card: '#FFFFFF',
                border: '#E2E8F0',
                'text-primary': '#0F172A',
                'text-secondary': '#64748B',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            borderRadius: {
                'lg': '8px',
                'xl': '12px',
                '2xl': '16px',
            },
            boxShadow: {
                'soft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
                'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
                'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
                'float': '0 8px 30px rgba(0, 0, 0, 0.12)',
                'nav': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 0 0 rgba(0, 0, 0, 0.02)',
                'input-focus': '0 0 0 3px rgba(37, 99, 235, 0.1)',
                'btn': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'btn-primary': '0 1px 3px 0 rgba(37, 99, 235, 0.3), 0 1px 2px -1px rgba(37, 99, 235, 0.2)',
            },
            keyframes: {
                slideUp: {
                    '0%': { opacity: 0, transform: 'translateY(8px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: 0, transform: 'scale(0.95)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                floatBounce: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                },
            },
            animation: {
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
                'float-bounce': 'floatBounce 3s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
