import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartScreen() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  // Get logged-in user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // ✅ UPDATED: Redirect to Checkout page instead of placing order directly
  const checkoutHandler = () => {
  if (!userInfo) {
    alert('Please login first!');
    navigate('/login');
    return;
  }
  navigate('/checkout');
};

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <p>Go back to <Link to="/">Home</Link> and add some products!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Shopping Cart</h2>
      <button 
        onClick={clearCart} 
        style={{ 
          marginBottom: '20px', 
          background: 'red', 
          color: 'white', 
          border: 'none', 
          padding: '8px 15px', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}
      >
        Clear Cart
      </button>

      {cartItems.map(item => (
        <div key={item.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          borderBottom: '1px solid #ddd',
          padding: '15px 0'
        }}>
          <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
          <div style={{ flex: '2' }}>
            <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'black' }}>
              <h4>{item.name}</h4>
            </Link>
            <p><strong>${item.price}</strong></p>
          </div>
          <div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              style={{ width: '60px', padding: '5px' }}
            />
          </div>
          <div>
            <strong>${(item.price * item.quantity).toFixed(2)}</strong>
          </div>
          <div>
            <button
              onClick={() => removeFromCart(item.id)}
              style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontSize: '20px' }}
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid #333', paddingTop: '20px' }}>
        <h3>Total: <strong>${totalPrice.toFixed(2)}</strong></h3>
        
        {/* ✅ Checkout Button now redirects to /checkout */}
        <button
          onClick={checkoutHandler}
          style={{
            backgroundColor: '#f0c14b',
            border: '1px solid #a88734',
            padding: '12px 30px',
            fontSize: '18px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default CartScreen;