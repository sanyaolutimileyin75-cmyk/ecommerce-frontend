import { Link } from 'react-router';
import { getImageUrl } from '../utils/imageUrl';
import { useState, useEffect, useRef } from 'react';
import './header.css';

type HeaderProps = {
  cart: {
    productId: string;
    quantity: number;
    deliveryOptionId: string;
  }[];
};

export function Header(props: HeaderProps) {
  const { cart } = props;

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  let totalQuantity = 0;
  if (Array.isArray(cart)) {
    cart.forEach((cartItem) => {
      totalQuantity += cartItem.quantity;
    });
  }

  /* close drawer when clicking outside */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  /* lock body scroll when drawer is open + manage focus */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    // When drawer closes, blur any focused element inside it
    if (!menuOpen && drawerRef.current) {
      const focused = drawerRef.current.querySelector(':focus') as HTMLElement;
      if (focused) focused.blur();
    }

    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header className="header">
        {/* ── LEFT ── */}
        <div className="header__left">
          <Link to="/" className="header-link logo-link" onClick={() => setMenuOpen(false)}>
            <span className="brand-logo">
              Timzy<span className="brand-logo__accent">Kay</span>
            </span>
          </Link>
        </div>

        {/* ── MIDDLE – desktop search bar ── */}
        <div className="header__middle">
          <input className="search-bar" type="text" placeholder="Search" />
          <button className="search-button" aria-label="Search">
            <img
              className="search-icon"
              src={getImageUrl('images/icons/search-icon.png')}
              alt=""
            />
          </button>
        </div>

        {/* ── RIGHT ── */}
        <div className="header__right">
          {/* mobile search toggle */}
          <button
            className="icon-btn mobile-search-toggle"
            aria-label="Toggle search"
            onClick={() => setSearchOpen((o) => !o)}
          >
            <img
              className="search-icon"
              src={getImageUrl('images/icons/search-icon.png')}
              alt=""
            />
          </button>

          {/* orders – hidden on very small screens, shown in drawer */}
          <Link className="orders-link header-link" to="/orders">
            <span className="orders-text">Orders</span>
          </Link>

          {/* cart */}
          <Link className="cart-link header-link" to="/checkout">
            <img className="cart-icon" src={getImageUrl('images/icons/cart-icon.png')} alt="Cart" />
            {totalQuantity > 0 && (
              <div className="cart-quantity">{totalQuantity}</div>
            )}
            <div className="cart-text">Cart</div>
          </Link>

          {/* hamburger */}
          <button
            className={`icon-btn hamburger ${menuOpen ? 'hamburger--open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ── MOBILE SEARCH BAR (drops below header) ── */}
      <div className={`mobile-search-bar ${searchOpen ? 'mobile-search-bar--open' : ''}`}>
        <input type="text" placeholder="Search for products..." autoFocus={searchOpen} />
        <button className="search-button" aria-label="Search">
          <img
            className="search-icon"
            src={getImageUrl('images/icons/search-icon.png')}
            alt=""
          />
        </button>
      </div>

      {/* ── DRAWER OVERLAY ── */}
      {menuOpen && (
        <div className="drawer-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ── SIDE DRAWER ── */}
      <nav
        ref={drawerRef}
        className={`drawer ${menuOpen ? 'drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="drawer__header">
          <span className="drawer__title">
            Timzy<span className="brand-logo__accent">Kay</span>
          </span>
          <button
            className="drawer__close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        <ul className="drawer__links">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              🏠 Home
            </Link>
          </li>
          <li>
            <Link to="/orders" onClick={() => setMenuOpen(false)}>
              📦 Orders
            </Link>
          </li>
          <li>
            <Link to="/checkout" onClick={() => setMenuOpen(false)}>
              🛒 Cart
              {totalQuantity > 0 && (
                <span className="drawer__badge">{totalQuantity}</span>
              )}
            </Link>
          </li>
          <li>
            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              ⚙️ Admin
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}