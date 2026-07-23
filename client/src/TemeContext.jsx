// import { createContext, useContext, useState, useEffect } from 'react';

// // 1. Create the context
// const ThemeContext = createContext();

// // 2. Create the provider component
// export function ThemeProvider({ children }) {
//   const [darkMode, setDarkMode] = useState(() => {
//     const saved = localStorage.getItem('darkMode');
//     return saved ? JSON.parse(saved) : false;
//   });

//   useEffect(() => {
//     localStorage.setItem('darkMode', JSON.stringify(darkMode));
//     if (darkMode) {
//       document.body.classList.add('dark-mode');
//     } else {
//       document.body.classList.remove('dark-mode');
//     }
//   }, [darkMode]);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   const value = {
//     darkMode,
//     toggleDarkMode,
//   };

//   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
// }

// // 3. Custom hook for easy use
// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// }