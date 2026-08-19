// components/Footer.tsx
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* ── Brand section ─────────────────────── */}
        <div className="footer-brand">
          <span className="footer-logo">
            <span className="footer-logo-timzy">Timzy</span>
            <span className="footer-logo-kay">Kay</span>
          </span>
          <p className="footer-tagline">
            Quality products, delivered with care.
          </p>
        </div>

        {/* ── Link columns ──────────────────────── */}
        <div className="footer-links">

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="/">All Products</a></li>
              <li><a href="/?category=electronics">Electronics</a></li>
              <li><a href="/?category=clothing">Clothing</a></li>
              <li><a href="/?category=books">Books</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><a href="/orders">My Orders</a></li>
              <li><a href="/checkout">Checkout</a></li>
              <li><a href="/tracking">Track Order</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/sanyaolutimileyin75-cmyks"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/YOUR_LINKEDIN"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="sanyaolutimileyin75@gmail.com">Contact</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────── */}
      <div className="footer-bottom">
        <p>© {currentYear} TimzyKay. All rights reserved.</p>
        <p className="footer-credit">
          Built with 💚 by{' '}
          <a
            href="https://github.com/sanyaolutimileyin75-cmyks"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sanyaolu Timilehin
          </a>
        </p>
      </div>
    </footer>
  );
}