import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminRegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('❌ Passwords do not match');
      setLoading(false);
      return;
    }

    fetch('/api/users/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        secretKey: formData.secretKey,
      }),
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (!res.ok) throw new Error(data.message || 'Registration failed');
          return data;
        } catch (e) {
          throw new Error('Server error. Please try again.');
        }
      })
      .then((data) => {
        setSuccess(`✅ ${data.name} registered as Admin successfully!`);
        setFormData({ name: '', email: '', password: '', confirmPassword: '', secretKey: '' });
        setLoading(false);
        // Auto-redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>👑</div>
          <h1 style={styles.title}>Admin Registration</h1>
          <p style={styles.subtitle}>Create a new administrator account</p>
        </div>

        {/* Messages */}
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter full name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="admin@example.com"
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Min 6 characters"
              />
            </div>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Admin Secret Key</label>
            <input
              type="password"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter the admin secret key"
            />
            <small style={styles.hint}>🔑 Ask the main administrator for the secret key</small>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? (
              <span style={styles.loadingText}>⏳ Creating Admin...</span>
            ) : (
              '🚀 Create Admin'
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <Link to="/" style={styles.footerLink}>🏠 Home</Link>
          <span style={styles.footerDivider}>•</span>
          <Link to="/login" style={styles.footerLink}>🔐 Admin Login</Link>
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '520px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
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
  row: {
    display: 'flex',
    gap: '16px',
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
  },
  inputFocus: {
    borderColor: '#667eea',
    boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
  },
  hint: {
    fontSize: '12px',
    color: '#888',
    marginTop: '4px',
  },
  button: {
    padding: '14px',
    backgroundColor: '#667eea',
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
  loadingText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
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
  success: {
    padding: '12px 16px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '10px',
    fontSize: '14px',
    border: '1px solid #bbf7d0',
    marginBottom: '12px',
  },
  footer: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '14px',
  },
  footerLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  footerDivider: {
    color: '#ccc',
  },
};

// Add keyframe animation via style injection
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
    border-color: #667eea !important;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15) !important;
  }
  button:hover:not(:disabled) {
    background-color: #5a6fd6 !important;
    transform: translateY(-2px);
  }
  a:hover {
    color: #5a6fd6 !important;
    text-decoration: underline !important;
  }
`;
document.head.appendChild(styleSheet);

export default AdminRegisterScreen;