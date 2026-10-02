import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { normalizePath } from './seo'

// Preserve previously shared HashRouter links, including post heading anchors.
function migrateLegacyLink(reload: boolean) {
  if (!window.location.hash.startsWith('#/')) return
  try {
    const legacyUrl = new URL(window.location.hash.slice(1), window.location.origin)
    // Never turn a fragment into an external redirect.
    if (legacyUrl.origin !== window.location.origin) return
    const path = `${normalizePath(legacyUrl.pathname)}${legacyUrl.search}${legacyUrl.hash}`
    if (reload) window.location.replace(path)
    else window.history.replaceState(null, '', path)
  } catch {
    // A malformed fragment must not prevent the page from loading.
  }
}
migrateLegacyLink(false)
// A link to another hash on the already open homepage doesn't reload its JS.
window.addEventListener('hashchange', () => migrateLegacyLink(true))

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Legacy links can select a different page than the prerendered homepage.
if (root.hasChildNodes() && root.dataset.page === normalizePath(window.location.pathname)) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
