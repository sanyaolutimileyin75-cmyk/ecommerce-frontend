import axios from 'axios';
import { Routes, Route } from 'react-router';
import { useState, useEffect } from 'react';
import { HomePage } from './pages/home/HomePage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { TrackingPage } from './pages/TrackingPage';
import { AdminPage } from './pages/admin/AdminPage';
import { ManageProducts } from './pages/admin/ManageProducts';
import { AddProduct } from './pages/admin/AddProduct';
import { EditProduct } from './pages/admin/EditProduct';
import { ViewOrders } from './pages/admin/ViewOrders';
import { LoginPage } from './pages/admin/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ProductDetailPage } from './pages/product/ProductDetailPage';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    const response = await axios.get('/api/cart-items?expand=product');
    setCart(response.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    /* page-wrapper pushes content below the fixed header */
    <div className="page-wrapper">
      <Routes>
        {/* Public routes */}
        <Route index element={<HomePage cart={cart} loadCart={loadCart} />} />
        <Route path="checkout" element={<CheckoutPage cart={cart} loadCart={loadCart} />} />
        <Route path="orders" element={<OrdersPage cart={cart} />} />
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="product/:id" element={<ProductDetailPage cart={cart} loadCart={loadCart} />} />

        {/* Public admin login */}
        <Route path="admin/login" element={<LoginPage />} />

        {/* Protected admin routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/products"
          element={
            <ProtectedRoute>
              <ManageProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/products/add"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/products/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/orders"
          element={
            <ProtectedRoute>
              <ViewOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/categories"
          element={
            <ProtectedRoute>
              <ManageCategories />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;