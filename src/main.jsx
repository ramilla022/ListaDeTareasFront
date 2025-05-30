import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TareasApp from './TareasApp.jsx'
import { AuthProvider } from "./Context/AuthContext";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
    <AuthProvider>
      <StrictMode>
        <TareasApp />
      </StrictMode>
      </AuthProvider>
    </BrowserRouter>
)
