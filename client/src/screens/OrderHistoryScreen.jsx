import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) return;

    fetch('/api/orders/myorders', {
      headers: {
        'Authorization': `Bearer ${userInfo.token}`
      }
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
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [userInfo]);

  if (!userInfo) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Please Login to view your orders</h2>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  if (loading) {
    return <p style={{ padding: '20px' }}>Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No Orders Yet</h2>
        <p>Go to <Link to="/">Home</Link> and start shopping!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order.id} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
            <div>
              <strong>Order ID:</strong> #{order.id}
            </div>
            <div>
              <strong>Total:</strong> ${order.total_price}
            </div>
            <div>
              <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <strong>Status:</strong> 
              <span style={{ color: order.is_paid ? 'green' : 'orange', marginLeft: '5px' }}>
                {order.is_paid ? 'Paid ✅' : 'Pending Payment'}
              </span>
            </div>
            <div>
              <strong>Shipping:</strong> 
              <span style={{ color: order.is_delivered ? 'green' : 'orange', marginLeft: '5px' }}>
                {order.is_delivered ? 'Delivered' : 'Processing'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderHistoryScreen;