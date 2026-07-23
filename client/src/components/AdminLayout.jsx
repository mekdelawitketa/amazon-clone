import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function AdminLayout() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Redirect if not logged in or not admin
  if (!userInfo || !userInfo.user.isAdmin) {
    navigate('/login');
    return null;
  }

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      {/* Top Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <Link to="/admin/dashboard" style={styles.navBrand}>
            🛠️ Admin Panel
          </Link>
        </div>
        <div style={styles.navRight}>
          <Link to="/" style={styles.navLink}>🛒 Store</Link>
          <Link to="/cart" style={styles.navLink}>
            🛒 Cart
            {totalItems > 0 && (
              <span style={styles.badge}>{totalItems}</span>
            )}
          </Link>
          <span style={styles.userName}>👋 {userInfo.user.name}</span>
          <button onClick={logoutHandler} style={styles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </nav>

      <div style={styles.body}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <ul style={styles.menu}>
            <li style={styles.menuItem}>
              <Link to="/admin/dashboard" style={styles.menuLink}>📊 Dashboard</Link>
            </li>
            <li style={styles.menuItem}>
              <Link to="/admin/products" style={styles.menuLink}>📦 Products</Link>
            </li>
            <li style={styles.menuItem}>
  <Link to="/admin/categories" style={styles.menuLink}>📁 Categories</Link>
</li>
            <li style={styles.menuItem}>
              <Link to="/admin/orders" style={styles.menuLink}>📜 Orders</Link>
            </li>
            <li style={styles.menuItem}>
              <Link to="/admin/users" style={styles.menuLink}>👥 Users</Link>
            </li>
            <li style={styles.menuItem}>
              <Link to="/admin/register" style={styles.menuLink}>➕ New Admin</Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main style={styles.content}>
          <Outlet /> {/* Renders the current admin page */}
        </main>
      </div>
    </div>
  );
}

// ===================== STYLES =====================
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f9',
  },
  navbar: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    borderBottom: '3px solid #f0c14b',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navBrand: {
    color: '#f0c14b',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    position: 'relative',
  },
  badge: {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '0 6px',
    fontSize: '12px',
    marginLeft: '4px',
  },
  userName: {
    color: '#ddd',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '4px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  body: {
    display: 'flex',
    minHeight: 'calc(100vh - 70px)',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#ffffff',
    padding: '20px 0',
    boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
    borderRight: '1px solid #e0e0e0',
  },
  menu: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: {
    padding: '0',
  },
  menuLink: {
    display: 'block',
    padding: '12px 24px',
    color: '#333',
    textDecoration: 'none',
    transition: 'background 0.2s, color 0.2s',
    borderLeft: '3px solid transparent',
  },
  content: {
    flex: 1,
    padding: '24px',
    backgroundColor: '#f4f6f9',
  },
};

// Add hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .admin-menu-link:hover {
    background-color: #f0f0f0;
    color: #f0c14b;
    border-left-color: #f0c14b;
  }
  .admin-logout-btn:hover {
    background-color: white !important;
    color: #1a1a2e !important;
  }
`;
document.head.appendChild(styleSheet);

export default AdminLayout;