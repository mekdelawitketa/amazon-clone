import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Fetch wishlist
    const fetchWishlist = async () => {
        if (!userInfo?.token) {
            setWishlist([]);
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('/api/wishlist', {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    // Add to wishlist
    const addToWishlist = async (productId) => {
        if (!userInfo?.token) {
            alert('Please login first!');
            window.location.href = '/login';
            return false;
        }
        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ productId })
            });
            if (res.ok) {
                await fetchWishlist();
                return true;
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to add');
                return false;
            }
        } catch (err) {
            console.error('Error adding to wishlist:', err);
            return false;
        }
    };

    // Remove from wishlist
    const removeFromWishlist = async (productId) => {
        if (!userInfo?.token) return false;
        try {
            const res = await fetch(`/api/wishlist/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            });
            if (res.ok) {
                await fetchWishlist();
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            return false;
        }
    };

    // Check if product is in wishlist
    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const value = {
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}