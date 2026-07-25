import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

function SearchScreen() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  const { addToCart } = useCart();
  const { darkMode } = useTheme();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        let filtered = data;

        // Filter by search query
        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q)
          );
        }

        // Filter by category (if not 'All')
        if (category !== 'All') {
          filtered = filtered.filter(
            (p) =>
              p.category?.toLowerCase() === category.toLowerCase() ||
              p.category_name?.toLowerCase() === category.toLowerCase()
          );
        }

        setProducts(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [query, category]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const styles = getStyles(darkMode);

  if (loading) {
    return <div style={styles.loading}>Searching products...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {query ? `Results for "${query}"` : 'All Products'}
        {category !== 'All' && ` in ${category}`}
      </h1>
      <p style={styles.resultCount}>{products.length} results found</p>

      {products.length === 0 ? (
        <div style={styles.noResults}>
          <h2>No products found</h2>
          <p>Try searching with different keywords or browse our categories.</p>
          <Link to="/" style={styles.backLink}>← Back to Home</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.productCardWrapper}>
              <Link to={`/product/${product.id}`} style={styles.productLink}>
                <div style={styles.productCard}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.productImage}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/200')}
                  />
                  <h4 style={styles.productName}>{product.name}</h4>
                  <p style={styles.productPrice}>${product.price}</p>
                  <p style={styles.productStock}>
                    {product.countInStock > 0 ? '🟢 In Stock' : '🔴 Out of Stock'}
                  </p>
                </div>
              </Link>
              <button
                onClick={(e) => handleAddToCart(e, product)}
                disabled={product.countInStock === 0}
                style={{
                  ...styles.addButton,
                  ...(product.countInStock === 0 ? styles.addButtonDisabled : {}),
                  ...(addedProductId === product.id ? styles.addButtonAdded : {}),
                }}
              >
                {addedProductId === product.id ? '✅ Added!' : '🛒 Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// STYLES FUNCTION (with Dark Mode support)
// ============================================================
const getStyles = (darkMode) => ({
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Amazon Ember', Arial, sans-serif",
    backgroundColor: darkMode ? '#131921' : '#f3f3f3',
    minHeight: '100vh',
    transition: 'background-color 0.3s ease',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: darkMode ? '#e0e0e0' : '#1a1a2e',
    marginBottom: '8px',
    transition: 'color 0.3s ease',
  },
  resultCount: {
    fontSize: '16px',
    color: darkMode ? '#aaa' : '#666',
    marginBottom: '24px',
    transition: 'color 0.3s ease',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: darkMode ? '#aaa' : '#666',
    transition: 'color 0.3s ease',
  },
  noResults: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9',
    borderRadius: '12px',
    transition: 'background-color 0.3s ease',
  },
  backLink: {
    display: 'inline-block',
    marginTop: '16px',
    color: '#0066c0',
    textDecoration: 'none',
    fontSize: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  productCardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.3s ease',
    border: darkMode ? '1px solid #333' : '1px solid #f0f0f0',
  },
  productLink: {
    textDecoration: 'none',
    color: darkMode ? '#e0e0e0' : '#111',
  },
  productCard: {
    padding: '16px',
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  productName: {
    fontSize: '15px',
    fontWeight: '600',
    color: darkMode ? '#e0e0e0' : '#1a1a2e',
    margin: '4px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'color 0.3s ease',
  },
  productPrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#febd69',
    margin: '4px 0',
  },
  productStock: {
    fontSize: '12px',
    color: darkMode ? '#aaa' : '#666',
    margin: '4px 0 8px 0',
    transition: 'color 0.3s ease',
  },
  addButton: {
    width: '90%',
    margin: '0 auto 16px auto',
    padding: '10px',
    backgroundColor: '#febd69',
    border: '1px solid #a88734',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#111',
    transition: 'all 0.2s',
  },
  addButtonDisabled: {
    backgroundColor: '#cccccc',
    borderColor: '#aaaaaa',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  addButtonAdded: {
    backgroundColor: '#28a745',
    borderColor: '#1e7e34',
    color: 'white',
  },
});

// ============================================================
// HOVER EFFECTS
// ============================================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .product-card-wrapper:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  }
  .add-button:hover:not(:disabled) {
    background-color: #f3a847 !important;
    transform: scale(1.03);
  }
  .add-button:active:not(:disabled) {
    transform: scale(0.95);
  }
`;
document.head.appendChild(styleSheet);

export default SearchScreen;