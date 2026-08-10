import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Header } from '../../components/Header';
import { ReviewsSection } from './ReviewsSection';
import { formatMoney } from '../../utils/money';
import './ProductDetailPage.css';

export function ProductDetailPage({ cart, loadCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Load product
  const loadProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  // Handle add to cart
  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await axios.post('/api/cart-items', {
        productId: product.id,
        quantity
      });
      await loadCart();
      alert(`Added ${quantity} × ${product.name} to cart!`);
    } catch (error) {
      console.error(error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  // Called by ReviewsSection when a new review is added
  // So the rating updates without a full page reload
  const handleReviewChange = () => {
    loadProduct();
  };

  if (loading) {
    return (
      <>
        <Header cart={cart} />
        <div className="product-detail-page">
          <p className="loading">Loading product...</p>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header cart={cart} />
        <div className="product-detail-page">
          <p className="loading">Product not found</p>
          <Link to="/" className="back-btn">← Back to store</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <title>{product.name}</title>
      <Header cart={cart} />

      <div className="product-detail-page">
        <Link to="/" className="back-btn">← Back to store</Link>

        <div className="product-detail-card">
          {/* Image */}
          <div className="product-image-section">
            <img src={product.image} alt={product.name} />
          </div>

          {/* Info */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>

            {product.category && (
              <div className="product-category-badge">
                {product.category.name}
              </div>
            )}

            <div className="product-rating">
              <span className="stars">
                {'★'.repeat(Math.round(product.rating.stars))}
                {'☆'.repeat(5 - Math.round(product.rating.stars))}
              </span>
              <span className="rating-text">
                {product.rating.stars} ({product.rating.count} review{product.rating.count !== 1 ? 's' : ''})
              </span>
            </div>

            <div className="product-price">
              {formatMoney(product.priceCents)}
            </div>

            <div className="product-keywords">
              {product.keywords.map((keyword, i) => (
                <span key={i} className="keyword-tag">{keyword}</span>
              ))}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="purchase-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection productId={product.id} onReviewChange={handleReviewChange} />
      </div>
    </>
  );
}