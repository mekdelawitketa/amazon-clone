import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext'; // ✅ Import
import App from './App.jsx';
import './index.css';
import { WishlistProvider } from './context/WishlistContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>   {/* ✅ Wrap App */}
        <CartProvider>
           <WishlistProvider> 
          <App />
           </WishlistProvider> 
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);