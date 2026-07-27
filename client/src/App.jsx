import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import AdminDashboard from './screens/AdminDashboard';
import AdminProducts from './screens/AdminProducts';
import AdminOrders from './screens/AdminOrders';
import AdminUsers from './screens/AdminUsers';
import AdminRegisterScreen from './screens/AdminRegisterScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminCategories from './screens/AdminCategories';
import SearchScreen from './screens/SearchScreen';
import WishlistScreen from './screens/WishlistScreen'; // ✅ IMPORT WISHLIST
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Routes>
        {/* ========== PUBLIC ROUTES (with Header + Footer) ========== */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <HomeScreen />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <LoginScreen />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <RegisterScreen />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <ProductScreen />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <CartScreen />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <CheckoutScreen />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <OrderHistoryScreen />
              </main>
              <Footer />
            </>
          }
        />

        {/* ✅ WISHLIST ROUTE (NEW) */}
        <Route
          path="/wishlist"
          element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <WishlistScreen />
              </main>
              <Footer />
            </>
          }
        />

        {/* ========== SEARCH ROUTE ========== */}
        <Route
          path="/search"
          element={
            <>
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <SearchScreen />
              </main>
              <Footer />
            </>
          }
        />

        {/* ========== ADMIN ROUTES (Standalone - NO Header/Footer) ========== */}
        <Route path="/admin/login" element={<AdminLoginScreen />} />
        <Route path="/admin/register" element={<AdminRegisterScreen />} />

        {/* Protected Admin Routes - ONLY AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;