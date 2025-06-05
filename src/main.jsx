import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TareasApp from './TareasApp.jsx'
import { AuthProvider } from "./Context/AuthContext";
import { BrowserRouter } from 'react-router-dom';
import { TareasProvider } from './Context/TareasContext';

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <AuthProvider>
        <TareasProvider>
          <StrictMode>
            <TareasApp />
          </StrictMode>
        </TareasProvider>
      </AuthProvider>
    </BrowserRouter>
)
