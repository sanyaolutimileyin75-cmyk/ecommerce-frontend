import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { Header } from '../../components/Header';
import { ProductsGrid } from './ProductsGrid';
import './HomePage.css';

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const categoryBarRef = useRef(null);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  /* ── load categories once ── */
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

  /* ── load products when category changes ── */
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const url = selectedCategoryId
          ? `/api/products?categoryId=${selectedCategoryId}`
          : '/api/products';
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategoryId]);

  /* ── filter products by search query ── */
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const handleCategorySelect = (id) => {
    setSelectedCategoryId(id);
    if (categoryBarRef.current) {
      const activeBtn = categoryBarRef.current.querySelector('.category-btn.active');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <>
      <title>TimzyKay - Shop Quality Products</title>

      <Header cart={cart} />

      <div className="home-page">

        {/* ── Search Results Banner ── */}
        {searchQuery && (
          <div className="search-results-banner">
            <p>
              Showing results for: <strong>"{searchQuery}"</strong>
              <span className="search-count"> ({filteredProducts.length} found)</span>
            </p>
          </div>
        )}

        {/* ── Category Filter Bar ── */}
        <div className="category-filter" ref={categoryBarRef}>
          <button
            className={`category-btn ${selectedCategoryId === '' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('')}
          >
            All Products
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              {cat.name}
              <span className="category-count">{cat.productCount}</span>
            </button>
          ))}
        </div>

        {/* ── Products ── */}
        {isLoading ? (
          <div className="products-loading">
            <div className="loading-spinner" />
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>
              {searchQuery
                ? `No products found matching "${searchQuery}".`
                : 'No products found in this category.'}
            </p>
          </div>
        ) : (
          <ProductsGrid products={filteredProducts} loadCart={loadCart} />
        )}

      </div>
    </>
  );
}