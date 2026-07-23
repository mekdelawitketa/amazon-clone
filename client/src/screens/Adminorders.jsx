import { useEffect, useState } from 'react';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    // Fetch all orders (you'll need a backend endpoint for this)
    fetch('/api/orders/all', {
      headers: { 'Authorization': `Bearer ${userInfo?.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={styles.loading}>Loading orders...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📜 All Orders</h1>
      {orders.length === 0 ? (
        <p style={styles.empty}>No orders found.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={styles.tableRow}>
                  <td style={styles.td}>#{order.id}</td>
                  <td style={styles.td}>{order.user_name || 'User'}</td>
                  <td style={styles.td}>${order.total_price}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      ...(order.is_paid ? styles.paid : styles.pending)
                    }}>
                      {order.is_paid ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <button style={styles.viewButton}>👁️ View</button>
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
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  paid: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
  pending: { backgroundColor: '#fff3e0', color: '#e65100' },
  viewButton: { padding: '6px 12px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default AdminOrders;