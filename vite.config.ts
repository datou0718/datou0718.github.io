import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { renderSeoHead } from './src/seo'
import { travelPlugin } from './scripts/travel-plugin'

// https://vite.dev/config/
export default defineConfig({
  publicDir: 'content/public',
  plugins: [
    react(),
    travelPlugin(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/,
          () => `<!--seo:start-->\n  ${renderSeoHead('/')}\n  <!--seo:end-->`);
      },
    }
  ],
  server: {
    port: Number(process.env.PORT) || 8080,
    strictPort: true,
  },
  base: '/',
})
