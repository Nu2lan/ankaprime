/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                'luxe-black': '#0B0B0D',
                'luxe-surface': '#121218',
                'luxe-card': '#1A1A22',
                'luxe-border': '#2A2A35',
                'luxe-gold': '#d6b068',
                'luxe-gold-hover': '#F1D27A',
                'luxe-gold-dim': '#B8962E',
                'luxe-text': '#F5F5F5',
                'luxe-muted': '#B8B8B8',
                'luxe-error': '#E74C3C',
                'luxe-success': '#2ECC71',
            },
            fontFamily: {
                'display': ['Playfair Display', 'Georgia', 'serif'],
                'body': ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'luxe': '0 4px 30px rgba(212, 175, 55, 0.08)',
                'luxe-lg': '0 8px 40px rgba(212, 175, 55, 0.12)',
            }
        },
    },
    plugins: [],
}
