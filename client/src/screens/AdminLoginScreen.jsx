import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminLoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (!res.ok) throw new Error(data.message || 'Login failed');
          return data;
        } catch (e) {
          throw new Error('Server error. Please try again.');
        }
      })
      .then((data) => {
        setLoading(false);
        if (data.token) {
          if (data.user?.isAdmin) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/admin/dashboard');
            window.location.reload();
          } else {
            setError('❌ Access denied. You do not have admin privileges.');
          }
        } else {
          setError(data.message || 'Invalid email or password');
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>🛡️</div>
          <h1 style={styles.title}>Admin Login</h1>
          <p style={styles.subtitle}>Sign in to manage your store</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="admin@example.com"
              autoComplete="email"  // ✅ Auto-fill email
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
              autoComplete="current-password"  // ✅ Auto-fill password
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? '⏳ Signing in...' : '🔐 Sign In as Admin'}
          </button>
        </form>

        <div style={styles.footer}>
          <Link to="/login" style={styles.footerLink}>👤 User Login</Link>
          <span style={styles.footerDivider}>•</span>
          <Link to="/admin/register" style={styles.footerLink}>👑 Register Admin</Link>
          <span style={styles.footerDivider}>•</span>
          <Link to="/" style={styles.footerLink}>🏠 Home</Link>
        </div>
      </div>
    </div>
  );
}

// ===================== STYLES =====================
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '440px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    animation: 'fadeInUp 0.6s ease-out',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  iconWrapper: {
    fontSize: '48px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    marginTop: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: '600',
    marginBottom: '6px',
    fontSize: '14px',
    color: '#333',
  },
  input: {
    padding: '12px 14px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    backgroundColor: '#fafafa',
    color: '#1a1a2e',
  },
  button: {
    padding: '14px',
    backgroundColor: '#0f3460',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.1s',
    marginTop: '8px',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    backgroundColor: '#888',
  },
  error: {
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '10px',
    fontSize: '14px',
    border: '1px solid #fecaca',
    marginBottom: '12px',
  },
  footer: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#0f3460',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  footerDivider: {
    color: '#ccc',
  },
};

// Add keyframe animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  input:focus {
    border-color: #0f3460 !important;
    box-shadow: 0 0 0 4px rgba(15, 52, 96, 0.15) !important;
  }
  button:hover:not(:disabled) {
    background-color: #1a1a4e !important;
    transform: translateY(-2px);
  }
  a:hover {
    color: #0f3460 !important;
    text-decoration: underline !important;
  }
  input::placeholder {
    color: #aaa !important;
    opacity: 1;
  }
`;
document.head.appendChild(styleSheet);

export default AdminLoginScreen;