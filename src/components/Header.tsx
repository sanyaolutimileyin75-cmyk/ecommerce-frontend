import { Link } from 'react-router';
import { getImageUrl } from '../utils/imageUrl';
import './header.css';

type HeaderProps = {
  cart: {
    productId: string;
    quantity: number;
    deliveryOptionId: string;
  }[];
}

export function Header(props: HeaderProps) {
  const { cart } = props

  let totalQuantity = 0;

  if (Array.isArray(cart)) {
    cart.forEach((cartItem) => {
      totalQuantity += cartItem.quantity;
    });
  }

  return (
    <div className="header">
      <div className="left-section">
        <Link to="/" className="header-link">
          <img className="logo"
            src={getImageUrl("images/logo-white.png")} />
          <img className="mobile-logo"
            src={getImageUrl("images/mobile-logo-white.png")} />
        </Link>
      </div>

      <div className="middle-section">
        <input className="search-bar" type="text" placeholder="Search" />

        <button className="search-button">
          <img className="search-icon" src={getImageUrl("images/icons/search-icon.png")} />
        </button>
      </div>

      <div className="right-section">
        <Link className="orders-link header-link" to="/orders">
          <span className="orders-text">Orders</span>
        </Link>

        <Link className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src={getImageUrl("images/icons/cart-icon.png")} />
          <div className="cart-quantity">{totalQuantity}</div>
          <div className="cart-text">Cart</div>
        </Link>
      </div>
    </div>
  );
}