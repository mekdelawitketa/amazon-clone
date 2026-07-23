import { useEffect, useState } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetch('/api/users/all', {
      headers: { 'Authorization': `Bearer ${userInfo?.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={styles.loading}>Loading users...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👥 All Users</h1>
      {users.length === 0 ? (
        <p style={styles.empty}>No users found.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={styles.tableRow}>
                  <td style={styles.td}>#{user.id}</td>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.roleBadge,
                      ...(user.isAdmin ? styles.admin : styles.user)
                    }}>
                      {user.isAdmin ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <button style={styles.actionButton}>✏️ Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' },
  loading: { padding: '40px', textAlign: 'center', fontSize: '18px', color: '#666' },
  error: { padding: '40px', textAlign: 'center', fontSize: '18px', color: '#d32f2f' },
  empty: { padding: '40px', textAlign: 'center', fontSize: '16px', color: '#666' },
  tableWrapper: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  tableHeader: { backgroundColor: '#f5f5f5' },
  th: { padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '2px solid #ddd' },
  td: { padding: '12px', borderBottom: '1px solid #eee', verticalAlign: 'middle' },
  tableRow: { transition: 'background 0.2s' },
  roleBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  admin: { backgroundColor: '#e3f2fd', color: '#0d47a1' },
  user: { backgroundColor: '#f5f5f5', color: '#616161' },
  actionButton: { padding: '6px 12px', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default AdminUsers;