/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': 'var(--color-primary-green)',
        'secondary-green': 'var(--color-secondary-green)',
        'accent-orange': 'var(--color-accent-orange)',
        'hero-bg': 'var(--color-hero-bg)',
        'body-bg': 'var(--color-body-bg)',
        'footer-bg': 'var(--color-footer-bg)',
        'text-dark': 'var(--color-text-dark)',
        'text-muted': 'var(--color-text-muted)',
      },
    },
  },
  plugins: [],
}