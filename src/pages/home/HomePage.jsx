import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { ProductsGrid } from './ProductsGrid';
import './HomePage.css';

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); // '' means "All"

  // Load categories once on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Load products - re-runs when selectedCategoryId changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const url = selectedCategoryId
          ? `/api/products?categoryId=${selectedCategoryId}`
          : '/api/products';

        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadProducts();
  }, [selectedCategoryId]);

  return (
    <>
      <title>Ecommerce Project</title>

      <Header cart={cart} />

      <div className="home-page">
        {/* Category Filter Bar */}
        <div className="category-filter">
          <button
            className={`category-btn ${selectedCategoryId === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategoryId('')}
          >
            All Products
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategoryId(cat.id)}
            >
              {cat.name}
              <span className="category-count">{cat.productCount}</span>
            </button>
          ))}
        </div>

        {/* Empty state if selected category has no products */}
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found in this category.</p>
          </div>
        ) : (
          <ProductsGrid products={products} loadCart={loadCart} />
        )}
      </div>
    </>
  );
}