import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) return <div style={styles.loading}>Loading product...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (!product) return <div style={styles.loading}>Product not found.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.inner}>
          {/* Image Section */}
          <div style={styles.imageWrapper}>
            <img src={product.image} alt={product.name} style={styles.image} />
          </div>

          {/* Details Section */}
          <div style={styles.details}>
            <h1 style={styles.title}>{product.name}</h1>
            <p style={styles.price}>${product.price}</p>
            <p style={styles.description}>{product.description}</p>
            <p style={styles.category}>Category: {product.category}</p>
            <p style={styles.stock}>
              In Stock: {product.countInStock > 0 ? '✅ Yes' : '❌ Out of Stock'}
            </p>

            <div style={styles.quantityWrapper}>
              <label style={styles.label}>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.countInStock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={styles.quantityInput}
              />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              style={{
                ...styles.addButton,
                ...(product.countInStock === 0 ? styles.disabledButton : {}),
              }}
            >
              {product.countInStock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>

            <div style={styles.backLink}>
              <Link to="/" style={styles.link}>← Back to Products</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  // Container
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  inner: {
    display: 'flex',
    flexDirection: 'row',
    gap: '40px',
    padding: '40px',
    flexWrap: 'wrap',
  },

  // Image Section
  imageWrapper: {
    flex: '1 1 40%',
    minWidth: '280px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: '8px',
  },

  // Details Section
  details: {
    flex: '1 1 50%',
    minWidth: '280px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px 0',
    lineHeight: '1.2',
  },
  price: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#b12704',
    margin: '8px 0 12px 0',
  },
  description: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.6',
    margin: '12px 0',
  },
  category: {
    fontSize: '14px',
    color: '#777',
    margin: '4px 0',
  },
  stock: {
    fontSize: '14px',
    color: '#555',
    margin: '4px 0 16px 0',
  },

  // Quantity
  quantityWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '16px',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: '600',
    fontSize: '16px',
    color: '#333',
  },
  quantityInput: {
    width: '70px',
    padding: '8px 12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  // Buttons
  addButton: {
    marginTop: '20px',
    padding: '12px 32px',
    fontSize: '18px',
    fontWeight: '600',
    backgroundColor: '#f0c14b',
    border: '1px solid #a88734',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#111',
    transition: 'background-color 0.2s, transform 0.1s',
    display: 'inline-block',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    borderColor: '#aaaaaa',
    cursor: 'not-allowed',
    opacity: 0.6,
  },

  // Back Link
  backLink: {
    marginTop: '24px',
  },
  link: {
    color: '#0066c0',
    textDecoration: 'none',
    fontSize: '15px',
  },

  // Loading / Error
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#d32f2f',
  },
};

// ✅ Responsive Styles via Media Queries
// Add this to your index.css or App.css for full responsiveness

/*
@media (max-width: 768px) {
  .inner {
    flex-direction: column !important;
    padding: 20px !important;
  }
  .title {
    font-size: 22px !important;
  }
  .price {
    font-size: 20px !important;
  }
  .addButton {
    width: 100% !important;
    text-align: center !important;
  }
}
*/

export default ProductScreen;