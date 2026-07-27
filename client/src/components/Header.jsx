import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  // ===== SEARCH STATE =====
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');

  // ===== SEARCH HANDLER =====
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.append('q', searchQuery.trim());
      if (searchCategory !== 'All') {
        params.append('category', searchCategory);
      }
      navigate(`/search?${params.toString()}`);
    }
  };

  // Get user info
  let userInfo = null;
  try {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      userInfo = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error parsing userInfo:', error);
  }

  const userName = userInfo?.user?.name || userInfo?.name || null;
  const isAdmin = userInfo?.user?.isAdmin || false;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
    window.location.reload();
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header style={styles.header}>
      {/* ===== TOP NAVBAR ===== */}
      <div style={styles.topBar}>
        {/* Logo */}
        <Link to="/" style={styles.logoContainer}>
          <img 
            src="/amazon-logo.png"
            alt="Amazon Clone" 
            style={{ height: '35px', width: 'auto', display: 'block' }}
          />
        </Link>

        {/* Delivery Location */}
        <div style={styles.delivery}>
          <span style={styles.deliveryLabel}>Deliver to</span>
          <span style={styles.deliveryLocation}>🇪🇹 Ethiopia</span>
        </div>

        {/* ===== SEARCH BAR (FUNCTIONAL) ===== */}
        <form onSubmit={handleSearch} style={styles.searchContainer}>
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            style={styles.searchSelect}
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Books</option>
            <option>Gaming</option>
            <option>Kitchen</option>
            <option>Fashion</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
            placeholder="Search Amazon"
          />
          <button type="submit" style={styles.searchButton}>🔍</button>
        </form>

        {/* Language Selector */}
        <div style={styles.language}>
          <span style={styles.languageFlag}>🇺🇸</span>
          <span style={styles.languageText}>EN</span>
        </div>

        {/* ===== Account & Lists (Dropdown) ===== */}
        <div
          style={styles.accountContainer}
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div style={styles.account}>
            <span style={styles.accountLabel}>
              {userInfo ? `Hello, ${userName}` : 'Hello, Sign in'}
                            <span style={styles.dropdownArrow}>▼</span>
            </span>
            
          </div>
          <Link to="/wishlist" style={styles.cart}>
    <span style={styles.cartIcon}>❤️</span>
    <span style={styles.cartText}>Wishlist</span>
</Link>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div style={styles.dropdown}>
              {userInfo ? (
                <>
                  <div style={styles.dropdownHeader}>
                    <strong>{userName}</strong>
                  </div>
                  <Link to={isAdmin ? '/admin/dashboard' : '/orders'} style={styles.dropdownItem}>
                    👤 Your Account
                  </Link>
                  <Link to="/orders" style={styles.dropdownItem}>
                    📦 Your Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin/dashboard" style={styles.dropdownItem}>
                      🛠️ Admin Dashboard
                    </Link>
                  )}
                  <hr style={styles.dropdownDivider} />
                  <button onClick={logoutHandler} style={styles.dropdownSignOut}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.dropdownItem}>
                    🔐 Sign In
                  </Link>
                  <Link to="/register" style={styles.dropdownItem}>
                    👤 Create Account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Orders */}
        <Link to="/orders" style={styles.orders}>
          <span style={styles.ordersLink}>Returns & Orders</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" style={styles.cart}>
          <span style={styles.cartIcon}>🛒</span>
          {totalItems > 0 && (
            <span style={styles.cartBadge}>{totalItems}</span>
          )}
          <span style={styles.cartText}>Cart</span>
        </Link>
      </div>

      {/* ===== SECONDARY NAVBAR ===== */}
      {/* <div style={styles.bottomBar}>
        <button style={styles.allButton}>☰ All</button>
        <Link to="/" style={styles.navLink}>Today's Deals</Link>
        <Link to="/" style={styles.navLink}>Customer Service</Link>
        <Link to="/" style={styles.navLink}>Registry</Link>
        <Link to="/" style={styles.navLink}>Gift Cards</Link>
        <Link to="/" style={styles.navLink}>Sell</Link>
      </div> */}
    </header>
  );
}

// ===================== STYLES =====================
const styles = {
  header: {
    backgroundColor: '#131921',
    color: 'white',
    fontFamily: "'Amazon Ember', Arial, sans-serif",
  },

  topBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    gap: '12px',
    flexWrap: 'wrap',
    minHeight: '60px',
  },

  logoContainer: {
    textDecoration: 'none',
    padding: '4px 8px',
    borderRadius: '2px',
    transition: 'border 0.2s',
  },

  delivery: {
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: '2px',
  },

  deliveryLabel: {
    fontSize: '12px',
    color: '#ccc',
    display: 'block',
    lineHeight: '1',
  },

  deliveryLocation: {
    fontSize: '14px',
    fontWeight: '700',
    display: 'block',
    lineHeight: '1.2',
  },

  searchContainer: {
    display: 'flex',
    flex: '1',
    minWidth: '200px',
    maxWidth: '700px',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: 'white',
  },

  searchSelect: {
    padding: '8px 12px',
    border: 'none',
    backgroundColor: '#f3f3f3',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#555',
    borderRight: '1px solid #ccc',
    minWidth: '60px',
  },

  searchInput: {
    flex: '1',
    padding: '8px 12px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#111',
    minWidth: '100px',
  },

  searchButton: {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: '#febd69',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#111',
  },

  language: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: '2px',
  },

  languageFlag: {
    fontSize: '18px',
  },

  languageText: {
    fontSize: '14px',
    fontWeight: '700',
  },

  accountContainer: {
    position: 'relative',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '1px',
  },

  account: {
    textDecoration: 'none',
  },

  accountLabel: {
    fontSize: '12px',
    color: '#ccc',
    display: 'block',
    lineHeight: '1',
  },

  accountLink: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'white',
    textDecoration: 'none',
    display: 'block',
    lineHeight: '1.2',
  },

  dropdownArrow: {
    fontSize: '10px',
    marginLeft: '4px',
  },

  dropdown: {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: 'white',
    color: '#111',
    minWidth: '220px',
    borderRadius: '4px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    padding: '8px 0',
    zIndex: 1000,
    border: '1px solid #e0e0e0',
  },

  dropdownHeader: {
    padding: '12px 20px 8px 20px',
    fontSize: '14px',
    color: '#333',
    borderBottom: '1px solid #eee',
  },

  dropdownItem: {
    display: 'block',
    padding: '10px 20px',
    color: '#111',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'background 0.2s',
  },

  dropdownDivider: {
    margin: '6px 0',
    border: 'none',
    borderTop: '1px solid #eee',
  },

  dropdownSignOut: {
    display: 'block',
    width: '100%',
    padding: '10px 20px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    color: '#111',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  orders: {
    padding: '4px 8px',
    textDecoration: 'none',
    color: 'white',
    borderRadius: '2px',
  },

  ordersLink: {
    fontSize: '14px',
    fontWeight: '700',
    display: 'block',
    lineHeight: '1.2',
    color: 'white',
    textDecoration: 'none',
  },

  cart: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    textDecoration: 'none',
    color: 'white',
    position: 'relative',
    borderRadius: '2px',
  },

  cartIcon: {
    fontSize: '28px',
  },

  cartBadge: {
    position: 'absolute',
    top: '-4px',
    left: '22px',
    backgroundColor: '#febd69',
    color: '#111',
    borderRadius: '50%',
    padding: '0 6px',
    fontSize: '12px',
    fontWeight: '700',
    minWidth: '20px',
    textAlign: 'center',
  },

  cartText: {
    fontSize: '14px',
    fontWeight: '700',
    marginLeft: '4px',
  },

  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#232f3e',
    padding: '4px 12px',
    gap: '16px',
    flexWrap: 'wrap',
    minHeight: '38px',
  },

  allButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '4px 8px',
    borderRadius: '2px',
  },
};

// ============================================================
// HOVER EFFECTS (Injected CSS)
// ============================================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .dropdown-item:hover {
    background-color: #f0f0f0 !important;
  }
  .dropdown-signout:hover {
    background-color: #f0f0f0 !important;
  }
  .logo-container:hover {
    border: 1px solid white;
    padding: 3px 7px !important;
  }
  .account-container:hover {
    border: 1px solid white;
    padding: 3px 7px !important;
  }
  .nav-link:hover {
    border: 1px solid white;
    padding: 3px 7px;
  }
  .all-button:hover {
    border: 1px solid white;
    padding: 3px 7px;
  }
  .search-button:hover {
    background-color: #f3a847 !important;
  }
`;
document.head.appendChild(styleSheet);

export default Header;