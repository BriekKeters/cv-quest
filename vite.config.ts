import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site at /cv-quest/; local dev stays at /
  base: process.env.DEPLOY_BASE ?? '/',
  plugins: [react(), tailwindcss()],
})
