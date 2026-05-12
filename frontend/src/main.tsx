import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import './styles.css'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
       <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
      zIndex: 10000, 
    },
        }}
          containerStyle={{
    zIndex: 10000, 
  }}

        
      />
      
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
