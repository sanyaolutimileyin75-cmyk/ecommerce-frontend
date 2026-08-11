import { useState } from 'react';
import { Link } from 'react-router';
import { formatMoney } from '../../utils/money';
import { getImageUrl } from '../../utils/imageUrl';
import axios from 'axios';

export function Product({ product, loadCart }) {
  const [quantity, setQuantity]     = useState(1);
  const [added, setAdded]           = useState(false);
  const [isLoading, setIsLoading]   = useState(false);

  const addToCart = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await axios.post('/api/cart-items', {
        productId: product.id,
        quantity,
      });
      await loadCart();

      /* show "Added" message for 2 seconds */
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-container" data-testid="product-container">

      {/* ── image (clickable) ── */}
      <Link
        to={`/product/${product.id}`}
        className="product-image-container product-link"
      >
        <img
          className="product-image"
          data-testid="product-image"
          src={getImageUrl(product.image)}
          alt={product.name}
          loading="lazy"
        />
      </Link>

      {/* ── name (clickable) ── */}
      <Link
        to={`/product/${product.id}`}
        className="product-name limit-text-to-2-lines product-link"
      >
        {product.name}
      </Link>

      {/* ── rating ── */}
      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={getImageUrl(`images/ratings/rating-${product.rating.stars * 10}.png`)}
          alt={`${product.rating.stars} stars`}
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      {/* ── price ── */}
      <div className="product-price">
        {formatMoney(product.priceCents)}
      </div>

      {/* ── quantity selector ── */}
      <div className="product-quantity-container">
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          aria-label="Select quantity"
        >
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="product-spacer" />

      {/* ── added confirmation ── */}
      <div
        className="added-to-cart"
        style={{ opacity: added ? 1 : 0 }}
        aria-live="polite"
      >
        <img src={getImageUrl('images/icons/checkmark.png')} alt="" />
        Added
      </div>

      {/* ── add to cart button ── */}
      <button
        className="add-to-cart-button button-primary"
        data-testid="add-to-cart-button"
        onClick={addToCart}
        disabled={isLoading}
        aria-label={`Add ${product.name} to cart`}
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>

    </div>
  );
}