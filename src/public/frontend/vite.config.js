import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [react(), tailwindcss()],
  base: '/dashboard/', // Important: matches your server route
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
