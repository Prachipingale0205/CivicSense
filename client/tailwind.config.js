/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'civic-blue': '#1A56DB',
                'deep-navy': '#1E429F',
                'blue-mid': '#C3DDFD',
                'blue-tint': '#EBF5FF',
                'teal-ai': '#0694A2',
                'teal-tint': '#D5F5F6',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
