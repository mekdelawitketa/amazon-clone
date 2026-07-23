import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CheckoutScreen() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Form states
  const [shippingAddress, setShippingAddress] = useState('123 Main St, Addis Ababa, Ethiopia');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  if (!userInfo) {
    navigate('/login');
    return null;
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    navigate('/');
    return null;
  }

  const placeOrderHandler = () => {
    setLoading(true);

    const orderItems = cartItems.map(item => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const orderData = {
      orderItems: orderItems,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.token}`
      },
      body: JSON.stringify(orderData)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(data.message || 'Order failed');
          });
        }
        return res.json();
      })
      .then(data => {
        alert(`✅ Order placed successfully! Order ID: ${data.orderId}`);
        clearCart();
        navigate('/orders'); // Go to order history
      })
      .catch(err => {
        alert(`❌ Error: ${err.message}`);
        console.error('Checkout error:', err);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Checkout</h2>

      {/* Order Summary */}
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginTop: '10px' }}>
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping & Payment Form */}
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h3>Shipping & Payment</h3>

        <div style={{ marginBottom: '15px' }}>
          <label><strong>Shipping Address</strong></label>
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            rows="3"
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label><strong>Payment Method</strong></label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option>Credit Card</option>
            <option>PayPal</option>
            <option>Cash on Delivery</option>
          </select>
        </div>

        <button
          onClick={placeOrderHandler}
          disabled={loading}
          style={{
            backgroundColor: '#f0c14b',
            border: '1px solid #a88734',
            padding: '12px 30px',
            fontSize: '18px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>

        <Link to="/cart" style={{ display: 'block', marginTop: '15px', textAlign: 'center' }}>← Back to Cart</Link>
      </div>
    </div>
  );
}

export default CheckoutScreen;