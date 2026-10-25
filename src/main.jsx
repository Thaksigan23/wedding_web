import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './cover-fallback.css'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './analytics'

initAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
