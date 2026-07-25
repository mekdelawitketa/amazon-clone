import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

function ProductScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
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

  const styles = {
    container: {
      padding: '40px 20px',
      maxWidth: '1400px', // ✅ WIDER container
      margin: '0 auto',
    },
    card: {
      backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
      borderRadius: '20px',
      boxShadow: darkMode 
        ? '0 8px 40px rgba(0,0,0,0.5)' 
        : '0 8px 40px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: darkMode ? '1px solid #333' : '1px solid #e8e8e8',
    },
    inner: {
      display: 'flex',
      flexDirection: 'row',
      gap: '60px', // ✅ BIGGER gap
      padding: '60px', // ✅ MORE padding
      flexWrap: 'wrap',
    },

    imageWrapper: {
      flex: '1 1 45%',
      minWidth: '350px', // ✅ LARGER min width
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkMode ? '#0d0d1a' : '#fafafa',
      borderRadius: '16px',
      padding: '30px',
    },
    image: {
      width: '100%',
      maxWidth: '600px', // ✅ BIGGER image
      height: 'auto',
      maxHeight: '500px',
      objectFit: 'contain',
      borderRadius: '8px',
      transition: 'transform 0.3s ease',
    },

    details: {
      flex: '1 1 45%',
      minWidth: '350px', // ✅ LARGER min width
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    title: {
      fontSize: '34px', // ✅ BIGGER title
      fontWeight: '700',
      color: darkMode ? '#e8e8e8' : '#1a1a2e',
      margin: '0 0 4px 0',
      lineHeight: '1.2',
      transition: 'color 0.3s ease',
    },
    price: {
      fontSize: '32px', // ✅ BIGGER price
      fontWeight: '700',
      color: '#b12704',
      margin: '4px 0 8px 0',
    },
    description: {
      fontSize: '18px', // ✅ BIGGER description
      color: darkMode ? '#bbbbbb' : '#555555',
      lineHeight: '1.8',
      margin: '8px 0',
      transition: 'color 0.3s ease',
    },
    category: {
      fontSize: '16px', // ✅ BIGGER category
      color: darkMode ? '#999' : '#777',
      margin: '2px 0',
      transition: 'color 0.3s ease',
    },
    stock: {
      fontSize: '16px', // ✅ BIGGER stock
      color: darkMode ? '#aaa' : '#555',
      margin: '2px 0 12px 0',
      fontWeight: '500',
      transition: 'color 0.3s ease',
    },

    quantityWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginTop: '16px',
      flexWrap: 'wrap',
    },
    label: {
      fontWeight: '600',
      fontSize: '17px',
      color: darkMode ? '#ddd' : '#333',
      transition: 'color 0.3s ease',
    },
    quantityInput: {
      width: '80px', // ✅ BIGGER input
      padding: '12px 16px',
      fontSize: '18px',
      border: darkMode ? '2px solid #444' : '2px solid #ddd',
      borderRadius: '10px',
      outline: 'none',
      backgroundColor: darkMode ? '#2a2a3a' : '#ffffff',
      color: darkMode ? '#e8e8e8' : '#111',
      transition: 'border-color 0.3s, background-color 0.3s, color 0.3s',
      fontWeight: '500',
    },

    addButton: {
      marginTop: '24px',
      padding: '16px 50px', // ✅ BIGGER button
      fontSize: '20px', // ✅ BIGGER text
      fontWeight: '600',
      backgroundColor: '#febd69',
      border: '1px solid #a88734',
      borderRadius: '12px',
      cursor: 'pointer',
      color: '#111',
      transition: 'all 0.2s ease',
      display: 'inline-block',
      width: '100%',
      maxWidth: '350px', // ✅ WIDER button
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    disabledButton: {
      backgroundColor: '#cccccc',
      borderColor: '#aaaaaa',
      cursor: 'not-allowed',
      opacity: 0.6,
      boxShadow: 'none',
    },

    backLink: {
      marginTop: '24px',
    },
    link: {
      color: '#0066c0',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'color 0.2s',
    },

    loading: {
      textAlign: 'center',
      padding: '80px',
      fontSize: '20px',
      color: darkMode ? '#aaa' : '#666',
      transition: 'color 0.3s ease',
    },
    error: {
      textAlign: 'center',
      padding: '80px',
      fontSize: '20px',
      color: '#d32f2f',
    },
  };

  if (loading) return <div style={styles.loading}>Loading product...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (!product) return <div style={styles.loading}>Product not found.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.inner}>
          {/* Image Section */}
          <div style={styles.imageWrapper} className="product-image-wrapper">
            <img 
              src={product.image} 
              alt={product.name} 
              style={styles.image} 
              onError={(e) => (e.target.src = 'https://via.placeholder.com/600')}
            />
          </div>

          {/* Details Section */}
          <div style={styles.details}>
            <h1 style={styles.title}>{product.name}</h1>
            <p style={styles.price}>${product.price}</p>
            <p style={styles.description}>{product.description}</p>
            <p style={styles.category}>Category: {product.category}</p>
            <p style={styles.stock}>
              {product.countInStock > 0 ? '✅ In Stock' : '❌ Out of Stock'}
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
                className="product-quantity-input"
              />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              style={{
                ...styles.addButton,
                ...(product.countInStock === 0 ? styles.disabledButton : {}),
              }}
              className="product-add-button"
            >
              {product.countInStock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>

            <div style={styles.backLink}>
              <Link to="/" style={styles.link} className="product-back-link">
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HOVER EFFECTS & RESPONSIVE
// ============================================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  /* Responsive */
  @media (max-width: 768px) {
    .product-inner {
      flex-direction: column !important;
      padding: 25px !important;
      gap: 30px !important;
    }
    .product-title {
      font-size: 26px !important;
    }
    .product-price {
      font-size: 26px !important;
    }
    .product-add-button {
      width: 100% !important;
      max-width: 100% !important;
    }
    .product-image-wrapper {
      padding: 15px !important;
    }
    .product-image-wrapper img {
      max-height: 300px !important;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .product-inner {
      padding: 40px !important;
      gap: 40px !important;
    }
  }

  /* Hover Effects */
  .product-add-button:hover:not(:disabled) {
    background-color: #f3a847 !important;
    transform: scale(1.03);
    box-shadow: 0 6px 20px rgba(254, 189, 105, 0.4) !important;
  }

  .product-quantity-input:focus {
    border-color: #febd69 !important;
    box-shadow: 0 0 0 4px rgba(254, 189, 105, 0.15) !important;
  }

  .product-back-link:hover {
    text-decoration: underline !important;
    color: #febd69 !important;
  }

  .product-image-wrapper:hover img {
    transform: scale(1.03);
  }

  body.dark-mode .product-quantity-input {
    background-color: #2a2a3a !important;
    color: #e8e8e8 !important;
    border-color: #444 !important;
  }

  body.dark-mode .product-quantity-input:focus {
    border-color: #febd69 !important;
    box-shadow: 0 0 0 4px rgba(254, 189, 105, 0.15) !important;
  }
`;
document.head.appendChild(styleSheet);

export default ProductScreen;