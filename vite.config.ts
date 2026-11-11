import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Kompyuter bilan tanishuv',
        short_name: 'Kompyuter',
        lang: 'uz',
        display: 'standalone',
        background_color: '#FFF8EC',
        theme_color: '#2BB3A3',
        icons: [{ src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        // Hamma narsa oldindan keshlanadi: sayt internetsiz ishlashi shart.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,mp3}'],
        navigateFallback: '/index.html',
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
    }),
  ],
  test: { environment: 'node' },
})
