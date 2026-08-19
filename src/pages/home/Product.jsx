// pages/home/Product.jsx
import { useState } from 'react';
import { Link } from 'react-router';
import { formatMoney } from '../../utils/money';
import { getImageUrl } from '../../utils/imageUrl';
import { useToast } from '../../context/ToastContext';   // ← ADD (1 of 3)
import axios from 'axios';

export function Product({ product, loadCart }) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();                       // ← ADD (2 of 3)

  const addToCart = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await axios.post('/api/cart-items', {
        productId: product.id,
        quantity,
      });
      await loadCart();
      showToast(`${product.name} added to cart!`, 'success');   // ← ADD (3 of 3)
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('Failed to add to cart. Please try again.', 'error');  // bonus
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-container" data-testid="product-container">
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

      <Link
        to={`/product/${product.id}`}
        className="product-name limit-text-to-2-lines product-link"
      >
        {product.name}
      </Link>

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

      <div className="product-price">
        {formatMoney(product.priceCents)}
      </div>

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