import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { content } from './src/data/content'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        const rawName = content.name.split(' (')[0];
        return html
          .replace('__TITLE__', `${rawName}'s Homepage`)
          .replace('__DESCRIPTION__', content.title.replace(/"/g, '&quot;'));
      },
    }
  ],
  base: '/',
})
