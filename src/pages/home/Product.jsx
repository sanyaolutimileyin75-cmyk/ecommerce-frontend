import { useState } from "react";
import { Link } from "react-router";
import { formatMoney } from "../../utils/money";
import { getImageUrl } from "../../utils/imageUrl";
import axios from "axios";

export function Product({ product, loadCart }) {
  const [quantity, setQuantity] = useState(1);

  const addToCart = async () => {
    await axios.post('/api/cart-items', {
      productId: product.id,
      quantity: quantity
    });
    await loadCart();
  };

  const selectQuantity = (event) => {
    const quantitySelected = Number(event.target.value);
    setQuantity(quantitySelected);
  };

  return (
    <div className="product-container" data-testid="product-container">
      <Link to={`/product/${product.id}`} className="product-image-container product-link">
        <img
          className="product-image"
          data-testid="product-image"
          src={getImageUrl(product.image)}
          alt={product.name}
        />
      </Link>

      <Link to={`/product/${product.id}`} className="product-name limit-text-to-2-lines product-link">
        {product.name}
      </Link>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={getImageUrl(`images/ratings/rating-${product.rating.stars * 10}.png`)}
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">
        {formatMoney(product.priceCents)}
      </div>

      <div className="product-quantity-container">
        <select value={quantity} onChange={selectQuantity}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="product-spacer"></div>

      <div className="added-to-cart">
        <img src={getImageUrl("images/icons/checkmark.png")} />
        Added
      </div>

      <button
        className="add-to-cart-button button-primary"
        data-testid="add-to-cart-button"
        onClick={addToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}