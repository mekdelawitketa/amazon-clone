import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

function WishlistScreen() {
    const { wishlist, loading, fetchWishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { darkMode } = useTheme();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const styles = getStyles(darkMode);

    const handleMoveToCart = (product) => {
        addToCart(product, 1);
        removeFromWishlist(product.id);
    };

    if (loading) return <div style={styles.loading}>Loading wishlist...</div>;

    if (wishlist.length === 0) {
        return (
            <div style={styles.empty}>
                <h2>❤️ Your Wishlist is Empty</h2>
                <p>Start adding items you love!</p>
                <Link to="/" style={styles.backLink}>← Browse Products</Link>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>❤️ My Wishlist ({wishlist.length})</h1>
            <div style={styles.grid}>
                {wishlist.map((product) => (
                    <div key={product.id} style={styles.card}>
                        <Link to={`/product/${product.id}`}>
                            <img src={product.image} alt={product.name} style={styles.image} />
                            <h4 style={styles.name}>{product.name}</h4>
                            <p style={styles.price}>${product.price}</p>
                        </Link>
                        <button onClick={() => handleMoveToCart(product)} style={styles.cartButton}>
                            🛒 Move to Cart
                        </button>
                        <button onClick={() => removeFromWishlist(product.id)} style={styles.removeButton}>
                            ❌ Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const getStyles = (darkMode) => ({
    container: {
        padding: '30px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: darkMode ? '#121212' : '#f3f3f3',
        transition: 'background 0.3s',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: darkMode ? '#e0e0e0' : '#1a1a2e',
        marginBottom: '24px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '24px',
    },
    card: {
        backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        border: darkMode ? '1px solid #333' : '1px solid #e8e8e8',
        textAlign: 'center',
        transition: 'transform 0.2s',
    },
    image: {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '8px',
    },
    name: {
        color: darkMode ? '#e0e0e0' : '#1a1a2e',
        margin: '4px 0',
    },
    price: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#b12704',
        margin: '4px 0',
    },
    cartButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#febd69',
        border: '1px solid #a88734',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        marginTop: '8px',
    },
    removeButton: {
        width: '100%',
        padding: '8px',
        backgroundColor: 'transparent',
        border: 'none',
        color: 'red',
        cursor: 'pointer',
        marginTop: '4px',
        fontSize: '13px',
    },
    loading: { textAlign: 'center', padding: '60px', fontSize: '18px', color: '#666' },
    empty: { textAlign: 'center', padding: '60px' },
    backLink: { color: '#0066c0', textDecoration: 'none', fontSize: '16px' },
});

export default WishlistScreen;