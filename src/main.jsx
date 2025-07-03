import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import './index.css'  // optional – create index.css if it doesn't exist

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

