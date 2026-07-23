import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Footer() {
  const { darkMode, toggleDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={styles.footer}>
      {/* Back to Top Button */}
      <div style={styles.backToTop} onClick={scrollToTop}>
        <span>Back to top</span>
      </div>

      {/* Main Footer Links */}
      <div style={styles.mainFooter}>
        <div style={styles.columnsContainer}>
          {/* Column 1: Get to Know Us */}
          <div style={styles.column}>
            <h4 style={styles.heading}>Get to Know Us</h4>
            <Link to="/" style={styles.link}>About Us</Link>
            <Link to="/" style={styles.link}>Careers</Link>
            <Link to="/" style={styles.link}>Press Releases</Link>
            <Link to="/" style={styles.link}>Amazon Science</Link>
          </div>

          {/* Column 2: Make Money with Us */}
          <div style={styles.column}>
            <h4 style={styles.heading}>Make Money with Us</h4>
            <Link to="/" style={styles.link}>Sell products on Amazon</Link>
            <Link to="/" style={styles.link}>Sell on Amazon Business</Link>
            <Link to="/" style={styles.link}>Become an Affiliate</Link>
            <Link to="/" style={styles.link}>Advertise Your Products</Link>
          </div>

          {/* Column 3: Amazon Payment Products */}
          <div style={styles.column}>
            <h4 style={styles.heading}>Amazon Payment Products</h4>
            <Link to="/" style={styles.link}>Amazon Business Card</Link>
            <Link to="/" style={styles.link}>Shop with Points</Link>
            <Link to="/" style={styles.link}>Reload Your Balance</Link>
            <Link to="/" style={styles.link}>Amazon Currency Converter</Link>
          </div>

          {/* Column 4: Let Us Help You */}
          <div style={styles.column}>
            <h4 style={styles.heading}>Let Us Help You</h4>
            <Link to="/" style={styles.link}>Your Account</Link>
            <Link to="/orders" style={styles.link}>Your Orders</Link>
            <Link to="/" style={styles.link}>Shipping Rates & Policies</Link>
            <Link to="/" style={styles.link}>Returns & Replacements</Link>
            <Link to="/" style={styles.link}>Help</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Dark Mode Toggle */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomContent}>
          <div style={styles.logo}>
            <span style={styles.logoText}>amazon</span>
            <span style={styles.logoDot}>.com</span>
          </div>

          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              ...styles.darkModeButton,
              backgroundColor: darkMode ? '#febd69' : '#37475a',
              color: darkMode ? '#111' : '#febd69',
            }}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

          <div style={styles.languageSelector}>
            <span style={styles.languageIcon}>🌐</span>
            <span style={styles.languageText}>English</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={styles.copyright}>
        <p style={styles.copyrightText}>
          © {currentYear} Amazon Clone. All rights reserved. | Built with ❤️ by Tigist
        </p>
      </div>
    </footer>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = {
  backToTop: {
    backgroundColor: '#37475a',
    color: 'white',
    textAlign: 'center',
    padding: '14px 0',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontSize: '14px',
    fontWeight: '600',
  },

  mainFooter: {
    backgroundColor: '#232f3e',
    padding: '40px 20px',
  },

  columnsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
  },

  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  heading: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },

  link: {
    color: '#ddd',
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'color 0.2s, text-decoration 0.2s',
    padding: '2px 0',
  },

  bottomBar: {
    backgroundColor: '#131921',
    padding: '16px 20px',
    borderTop: '1px solid #3a4a5a',
  },

  bottomContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
  },

  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#febd69',
  },

  logoDot: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
  },

  languageSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: '1px solid #888',
    padding: '6px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },

  languageIcon: {
    fontSize: '18px',
  },

  languageText: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },

  copyright: {
    backgroundColor: '#131921',
    padding: '12px 20px',
    textAlign: 'center',
  },

  copyrightText: {
    color: '#aaa',
    fontSize: '12px',
    margin: 0,
  },

  // ✅ Dark Mode Toggle Button
  darkModeButton: {
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
};

// ============================================================
// HOVER EFFECTS (Injected CSS)
// ============================================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .footer-back-to-top:hover {
    background-color: #485769 !important;
  }
  .footer-link:hover {
    color: #febd69 !important;
    text-decoration: underline !important;
  }
  .footer-language:hover {
    border-color: #febd69 !important;
  }
  .footer-dark-mode-button:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 0 15px rgba(254, 189, 105, 0.3) !important;
  }
`;
document.head.appendChild(styleSheet);

export default Footer;