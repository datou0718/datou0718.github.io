import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { renderSeoHead } from './src/seo'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
