import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function LoginScreen() {
  const { darkMode } = useTheme(); // ✅ Get dark mode

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.token) {
          localStorage.setItem('userInfo', JSON.stringify(data));
          if (data.user?.isAdmin) {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
          window.location.reload();
        } else {
          setError(data.message || 'Invalid email or password');
        }
      })
      .catch((err) => {
        setLoading(false);
        setError('Server error. Please try again.');
        console.error(err);
      });
  };

  const styles = getStyles(darkMode);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Sign In</h2>
          <p style={styles.subtitle}>Welcome back! Please sign in to your account.</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={submitHandler} style={styles.form} autoComplete="off">
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={styles.input}
              autoComplete="off"
              name="email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={styles.input}
              autoComplete="new-password"
              name="password"
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            New Customer? <Link to="/register" style={styles.link}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STYLES FUNCTION (FULL DARK MODE SUPPORT)
// ============================================================
const getStyles = (darkMode) => ({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkMode ? '#121212' : '#f0f2f5',
    padding: '20px',
    fontFamily: "'Amazon Ember', Arial, sans-serif",
    transition: 'background-color 0.3s ease',
  },

  card: {
    backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '440px',
    width: '100%',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
    transition: 'background-color 0.3s ease',
  },

  header: {
    marginBottom: '32px',
  },

  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: darkMode ? '#e0e0e0' : '#1a1a2e',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
    transition: 'color 0.3s ease',
  },

  subtitle: {
    fontSize: '15px',
    color: darkMode ? '#aaa' : '#666',
    margin: '0',
    transition: 'color 0.3s ease',
  },

  error: {
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid #fecaca',
    marginBottom: '20px',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },

  label: {
    fontWeight: '600',
    marginBottom: '6px',
    fontSize: '14px',
    color: darkMode ? '#e0e0e0' : '#333',
    transition: 'color 0.3s ease',
  },

  input: {
    padding: '12px 14px',
    border: darkMode ? '2px solid #444' : '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s, background-color 0.3s',
    backgroundColor: darkMode ? '#2a2a2a' : '#fafafa',
    color: darkMode ? '#e0e0e0' : '#1a1a2e',
  },

  button: {
    padding: '14px',
    backgroundColor: '#febd69',
    border: '1px solid #a88734',
    borderRadius: '10px',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#111',
    transition: 'background 0.3s, transform 0.1s',
    marginTop: '8px',
  },

  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },

  footer: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: darkMode ? '1px solid #333' : '1px solid #eee',
    textAlign: 'center',
    transition: 'border-color 0.3s ease',
  },

  footerText: {
    fontSize: '14px',
    color: darkMode ? '#aaa' : '#555',
    margin: 0,
    transition: 'color 0.3s ease',
  },

  link: {
    color: '#0066c0',
    textDecoration: 'none',
    fontWeight: '500',
  },
});

// ============================================================
// HOVER EFFECTS (Injected CSS)
// ============================================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  input:focus {
    border-color: #febd69 !important;
    box-shadow: 0 0 0 4px rgba(254, 189, 105, 0.15) !important;
    background-color: #ffffff !important;
  }
  button:hover:not(:disabled) {
    background-color: #f3a847 !important;
    transform: translateY(-2px);
  }
  a:hover {
    color: #febd69 !important;
    text-decoration: underline !important;
  }
  input::placeholder {
    color: #aaa !important;
    opacity: 1;
  }
`;
document.head.appendChild(styleSheet);

export default LoginScreen;