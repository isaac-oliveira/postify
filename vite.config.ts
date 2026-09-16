/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [tailwindcss(), react(), svgr()],
  test: {
    passWithNoTests: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
