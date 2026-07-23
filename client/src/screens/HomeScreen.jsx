import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

function HomeScreen() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { darkMode } = useTheme(); // ✅ Get dark mode

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [addedProductId, setAddedProductId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // ============================================================
  // 1. HERO SLIDES
  // ============================================================
  const slides = [
    {
      id: 1,
      title: 'Shop Back to School',
      subtitle: 'School essentials at every price',
      buttonText: 'Shop now',
      image: 'https://picsum.photos/seed/school/1200/500',
      emoji: '📚',
      color: '#1a1a2e',
    },
    {
      id: 2,
      title: 'Gaming store',
      subtitle: 'Upgrade your gaming gear',
      buttonText: 'Shop Gaming',
      tag: '🔥 New Arrivals',
      image: 'https://picsum.photos/seed/gaming/1200/500',
      emoji: '🎮',
      color: '#0a0a0a',
    },
    {
      id: 3,
      title: 'Shop Fashion for less',
      subtitle: 'Jeans under $50 • Tops under $25 • Dresses under $30',
      buttonText: 'Shop Fashion',
      image: 'https://picsum.photos/seed/fashion/1200/500',
      emoji: '👗',
      color: '#533483',
    },
    {
      id: 4,
      title: 'Top categories in Kitchen',
      subtitle: 'Cooker • Pots and Pans • Kettles',
      buttonText: 'Shop Kitchen',
      image: 'https://picsum.photos/seed/kitchen/1200/500',
      emoji: '🍳',
      color: '#2d4059',
    },
  ];

  // ============================================================
  // 2. FETCH DATA
  // ============================================================
  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  // ============================================================
  // 3. AUTO-SLIDE CAROUSEL
  // ============================================================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // ============================================================
  // 4. ADD TO CART HANDLER (WITH TOAST)
  // ============================================================
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedProductId(product.id);

    setToast({ show: true, message: `✅ ${product.name} added to cart!` });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2500);

    setTimeout(() => setAddedProductId(null), 2000);
  };

  // ============================================================
  // 5. LOADING STATE
  // ============================================================
  if (loading) {
    return <div style={getStyles(darkMode).loading}>Loading products...</div>;
  }

  // ============================================================
  // 6. RENDER
  // ============================================================
  const getProductsByCategory = (categoryId) => {
    return products.filter(p => p.category_id === categoryId);
  };

  const activeCategories = categories.filter(cat => 
    getProductsByCategory(cat.id).length > 0
  );

  const styles = getStyles(darkMode);

  return (
    <div style={styles.container}>
      {/* ===== TOAST ===== */}
      {toast.show && (
        <div style={styles.toast}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ===== HERO SLIDER ===== */}
      <div style={styles.sliderContainer}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              ...styles.slide,
              transform: `translateX(-${currentSlide * 100}%)`,
              background: `url(${slide.image}) no-repeat center/cover, ${slide.color}`,
            }}
          >
            <div style={styles.slideOverlay}></div>
            <div style={styles.slideContent}>
              <div style={styles.slideEmoji}>{slide.emoji}</div>
              {slide.tag && <span style={styles.slideTag}>{slide.tag}</span>}
              <h2 style={styles.slideTitle}>{slide.title}</h2>
              <p style={styles.slideSubtitle}>{slide.subtitle}</p>
              <button style={styles.slideButton}>{slide.buttonText}</button>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <button
              key={index}
              style={{
                ...styles.dot,
                backgroundColor: index === currentSlide ? '#febd69' : 'rgba(255,255,255,0.5)',
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* ===== CATEGORY SECTIONS ===== */}
      {activeCategories.map((category) => {
        const categoryProducts = getProductsByCategory(category.id);
        return (
          <div key={category.id} style={styles.categorySection}>
            <div style={styles.categoryHeader}>
              <h2 style={styles.categoryTitle}>{category.name}</h2>
              <Link to={`/category/${category.id}`} style={styles.seeAllLink}>
                See all →
              </Link>
            </div>
            
            <div style={styles.categoryGrid}>
              {categoryProducts.slice(0, 6).map((product) => (
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
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 7. STYLES FUNCTION (FULL DARK MODE SUPPORT)
// ============================================================
const getStyles = (darkMode) => ({
  container: {
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '0',
    fontFamily: "'Amazon Ember', Arial, sans-serif",
    backgroundColor: darkMode ? '#131921' : '#f3f3f3',
    transition: 'background-color 0.3s ease',
  },

  toast: {
    position: 'fixed',
    top: '80px',
    right: '20px',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '14px 24px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    zIndex: 9999,
    fontSize: '16px',
    fontWeight: '600',
    animation: 'slideInRight 0.5s ease-out',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    maxWidth: '400px',
  },

  sliderContainer: {
    position: 'relative',
    width: '100%',
    height: '420px',
    overflow: 'hidden',
    marginBottom: '24px',
  },

  slide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: 'transform 0.8s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    padding: '60px',
  },

  slideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },

  slideContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '500px',
    color: 'white',
    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
  },

  slideEmoji: {
    fontSize: '56px',
    marginBottom: '12px',
    display: 'block',
  },

  slideTag: {
    display: 'inline-block',
    padding: '4px 16px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },

  slideTitle: {
    fontSize: '42px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },

  slideSubtitle: {
    fontSize: '18px',
    margin: '0 0 20px 0',
    opacity: 0.9,
  },

  slideButton: {
    padding: '12px 32px',
    backgroundColor: '#febd69',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#111',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  dotsContainer: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
    zIndex: 3,
  },

  dot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    padding: 0,
  },

  categorySection: {
    padding: '20px 16px',
    marginBottom: '16px',
    backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
    transition: 'background-color 0.3s ease',
  },

  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },

  categoryTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: darkMode ? '#e0e0e0' : '#1a1a2e',
    margin: 0,
    transition: 'color 0.3s ease',
  },

  seeAllLink: {
    color: darkMode ? '#febd69' : '#0066c0',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background 0.2s, color 0.3s ease',
  },

  categoryGrid: {
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

  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: darkMode ? '#aaa' : '#666',
    transition: 'color 0.3s ease',
  },
});

// ============================================================
// 8. HOVER EFFECTS & ANIMATIONS
// ============================================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .slide-button:hover { background-color: #f3a847 !important; }
  .add-button:hover:not(:disabled) {
    background-color: #f3a847 !important;
    transform: scale(1.03);
  }
  .add-button:active:not(:disabled) { transform: scale(0.95); }
  .product-card-wrapper:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  }
  .dot:hover { transform: scale(1.2); }
  .see-all-link:hover {
    background-color: #e8f0fe;
    text-decoration: underline;
    color: #0052a3 !important;
  }
`;
document.head.appendChild(styleSheet);

export default HomeScreen;