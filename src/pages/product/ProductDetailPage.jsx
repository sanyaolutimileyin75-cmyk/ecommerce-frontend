import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Header } from '../../components/Header';
import { ReviewsSection } from './ReviewsSection';
import { formatMoney } from '../../utils/money';
import { getImageUrl } from '../../utils/imageUrl';
import './ProductDetailPage.css';

export function ProductDetailPage({ cart, loadCart }) {
  const { id } = useParams();
  const [product, setProduct]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [quantity, setQuantity]       = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

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
    /* scroll to top when navigating to a new product */
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = async () => {
    if (addingToCart) return;
    setAddingToCart(true);
    try {
      await axios.post('/api/cart-items', {
        productId: product.id,
        quantity,
      });
      await loadCart();
      /* show success message instead of alert */
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2500);
    } catch (error) {
      console.error(error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  /* ── loading state ── */
  if (loading) {
    return (
      <>
        <Header cart={cart} />
        <div className="product-detail-page">
          <div className="detail-loading">
            <div className="detail-spinner" />
            <p>Loading product...</p>
          </div>
        </div>
      </>
    );
  }

  /* ── not found state ── */
  if (!product) {
    return (
      <>
        <Header cart={cart} />
        <div className="product-detail-page">
          <div className="detail-not-found">
            <p>😕 Product not found</p>
            <Link to="/" className="back-btn">← Back to store</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <title>{product.name}</title>
      <Header cart={cart} />

      <div className="product-detail-page">

        {/* ── back link ── */}
        <Link to="/" className="back-btn">← Back to store</Link>

        {/* ── main card ── */}
        <div className="product-detail-card">

          {/* IMAGE */}
          <div className="product-image-section">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              loading="eager"
            />
          </div>

          {/* INFO */}
          <div className="product-info-section">

            {/* category badge */}
            {product.category && (
              <div className="product-category-badge">
                {product.category.name}
              </div>
            )}

            {/* title */}
            <h1 className="product-title">{product.name}</h1>

            {/* rating */}
            <div className="product-rating">
              <span className="stars">
                {'★'.repeat(Math.round(product.rating.stars))}
                {'☆'.repeat(5 - Math.round(product.rating.stars))}
              </span>
              <span className="rating-text">
                {product.rating.stars} &nbsp;·&nbsp;
                {product.rating.count} review{product.rating.count !== 1 ? 's' : ''}
              </span>
            </div>

            {/* price */}
            <div className="product-price">
              {formatMoney(product.priceCents)}
            </div>

            {/* keywords */}
            {product.keywords?.length > 0 && (
              <div className="product-keywords">
                {product.keywords.map((keyword, i) => (
                  <span key={i} className="keyword-tag">{keyword}</span>
                ))}
              </div>
            )}

            {/* purchase section */}
            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="detail-qty">Quantity:</label>
                <select
                  id="detail-qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* success message */}
              {cartSuccess && (
                <div className="cart-success-msg" aria-live="polite">
                  ✅ Added {quantity} × {product.name} to cart!
                </div>
              )}

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={addingToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* ── reviews ── */}
        <ReviewsSection
          productId={product.id}
          onReviewChange={loadProduct}
        />

      </div>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="sticky-cta">
        <div className="sticky-cta__price">
          {formatMoney(product.priceCents)}
        </div>
        <button
          className="sticky-cta__btn"
          onClick={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
        </button>
      </div>
    </>
  );
}