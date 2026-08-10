import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { getImageUrl } from '../../utils/imageUrl';
import './ManageProducts.css';

type Product = {
  id: string;
  image: string;
  name: string;
  rating: { stars: number; count: number };
  priceCents: number;
  keywords: string[];
};

export function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const loadProducts = async (search = '') => {
    try {
      const url = search
        ? `/api/products?search=${encodeURIComponent(search)}`
        : '/api/products';

      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setSearching(true);
    const timer = setTimeout(() => {
      loadProducts(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (productId: string, productName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/products/${productId}`);
      alert('Product deleted successfully! ✅');
      loadProducts(searchQuery);
    } catch (error) {
      console.error(error);
      alert('Failed to delete product ❌');
    }
  };

  const handleEdit = (productId: string) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="manage-products">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="manage-products">
      <div className="header">
        <h1>Manage Products</h1>
        <div className="header-actions">
          <Link to="/admin/products/add" className="add-btn">
            + Add Product
          </Link>
          <Link to="/admin" className="back-link">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="clear-btn" onClick={handleClearSearch}>
            ✕
          </button>
        )}
      </div>

      <p className="count">
        {searching ? (
          'Searching...'
        ) : searchQuery ? (
          <>
            {products.length} result{products.length !== 1 ? 's' : ''} for{' '}
            <strong>"{searchQuery}"</strong>
          </>
        ) : (
          `Total Products: ${products.length}`
        )}
      </p>

      {!searching && products.length === 0 && (
        <div className="no-results">
          <p>No products found for "<strong>{searchQuery}</strong>"</p>
          <button className="clear-btn-text" onClick={handleClearSearch}>
            Clear search
          </button>
        </div>
      )}

      {products.length > 0 && (
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="product-img"
                  />
                </td>
                <td>{product.name}</td>
                <td>${(product.priceCents / 100).toFixed(2)}</td>
                <td>
                  ⭐ {product.rating.stars} ({product.rating.count})
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product.id, product.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}