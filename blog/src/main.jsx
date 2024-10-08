import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  // StrictMode triggers renders twice in dev mode
  // <StrictMode>
    
  // </StrictMode>,
  
  <App />
)
