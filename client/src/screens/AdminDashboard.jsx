import { useEffect, useState } from 'react';

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    // ✅ FETCH ALL REAL DATA FROM BACKEND
    Promise.all([
      // 1. Total Products
      fetch('/api/products')
        .then(res => res.json())
        .catch(() => []),
      
      // 2. Total Orders (for logged-in user)
      fetch('/api/orders/myorders', {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      })
        .then(res => res.json())
        .catch(() => []),
      
      // 3. Total Users
      fetch('/api/users/total-users', {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      })
        .then(res => res.json())
        .catch(() => ({ total: 0 })),
      
      // 4. Total Revenue
      fetch('/api/users/total-revenue', {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      })
        .then(res => res.json())
        .catch(() => ({ total: 0 }))
    ])
    .then(([products, orders, usersData, revenueData]) => {
      // ✅ SAFELY CONVERT ALL VALUES TO NUMBERS
      const totalProducts = Array.isArray(products) ? products.length : 0;
      const totalOrders = Array.isArray(orders) ? orders.length : 0;
      const totalUsers = typeof usersData.total === 'number' ? usersData.total : parseInt(usersData.total) || 0;
      const totalRevenue = typeof revenueData.total === 'number' ? revenueData.total : parseFloat(revenueData.total) || 0;

      setStats({
        products: totalProducts,
        orders: totalOrders,
        users: totalUsers,
        revenue: totalRevenue,
      });
      setLoading(false);
    })
    .catch((err) => {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div>
      <h1 style={styles.title}>📊 Dashboard</h1>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Products</h3>
          <p style={styles.cardNumber}>{stats.products}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Orders</h3>
          <p style={styles.cardNumber}>{stats.orders}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Users</h3>
          <p style={styles.cardNumber}>{stats.users}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Revenue</h3>
          <p style={styles.cardNumber}>${typeof stats.revenue === 'number' ? stats.revenue.toFixed(2) : '0.00'}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  loading: { 
    padding: '40px', 
    textAlign: 'center', 
    fontSize: '18px', 
    color: '#666' 
  },
  error: { 
    padding: '40px', 
    textAlign: 'center', 
    fontSize: '18px', 
    color: '#d32f2f' 
  },
  title: { 
    fontSize: '28px', 
    fontWeight: '700', 
    color: '#1a1a2e', 
    marginBottom: '24px' 
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
    gap: '20px' 
  },
  card: { 
    backgroundColor: 'white', 
    padding: '24px', 
    borderRadius: '12px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)', 
    textAlign: 'center' 
  },
  cardTitle: { 
    fontSize: '14px', 
    color: '#888', 
    marginBottom: '8px' 
  },
  cardNumber: { 
    fontSize: '32px', 
    fontWeight: 'bold', 
    color: '#1a1a2e' 
  },
};

export default AdminDashboard;