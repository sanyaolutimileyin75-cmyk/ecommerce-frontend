import { Header } from '../components/Header';
import { getImageUrl } from '../utils/imageUrl';
import { Link } from 'react-router';
import './TrackingPage.css';

/* 
  Status can be: 'preparing' | 'shipped' | 'delivered'
  Progress bar width maps to status:
    preparing → 16%
    shipped   → 50%
    delivered → 100%
*/
const STATUS_CONFIG = {
  preparing: { label: 'Preparing',  progress: 16  },
  shipped:   { label: 'Shipped',    progress: 50  },
  delivered: { label: 'Delivered',  progress: 100 },
};

const CURRENT_STATUS = 'shipped'; // change this to test different states

export function TrackingPage() {
  const steps    = Object.keys(STATUS_CONFIG);
  const progress = STATUS_CONFIG[CURRENT_STATUS].progress;

  /* find which step index is current */
  const currentIndex = steps.indexOf(CURRENT_STATUS);

  return (
    <>
      <title>Tracking</title>
      <Header />

      <div className="tracking-page">
        <div className="tracking-card">

          {/* ── back link ── */}
          <Link className="back-to-orders-link link-primary" to="/orders">
            ← View all orders
          </Link>

          {/* ── delivery info ── */}
          <div className="tracking-status-badge">
            {STATUS_CONFIG[CURRENT_STATUS].label}
          </div>

          <div className="delivery-date">
            Arriving on Monday, June 13
          </div>

          {/* ── product info ── */}
          <div className="tracking-product">
            <img
              className="product-image"
              src={getImageUrl('images/products/athletic-cotton-socks-6-pairs.jpg')}
              alt="Black and Gray Athletic Cotton Socks"
              loading="lazy"
            />
            <div className="tracking-product-info">
              <div className="product-name">
                Black and Gray Athletic Cotton Socks - 6 Pairs
              </div>
              <div className="product-quantity">Quantity: 1</div>
            </div>
          </div>

          {/* ── progress section ── */}
          <div className="tracking-progress">

            {/* step labels */}
            <div className="progress-labels-container">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`progress-label
                    ${index <= currentIndex ? 'progress-label--done' : ''}
                    ${step === CURRENT_STATUS ? 'progress-label--current' : ''}
                  `}
                >
                  {/* step dot */}
                  <div className="progress-dot">
                    {index < currentIndex && (
                      <span className="progress-dot-check">✓</span>
                    )}
                  </div>
                  <span>{STATUS_CONFIG[step].label}</span>
                </div>
              ))}
            </div>

            {/* progress bar */}
            <div className="progress-bar-container" role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Order status: ${STATUS_CONFIG[CURRENT_STATUS].label}`}
            >
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* step percentages */}
            <div className="progress-step-markers">
              {steps.map((step) => (
                <div key={step} className="progress-step-marker">
                  {step === CURRENT_STATUS && (
                    <span className="progress-step-marker-label">You are here</span>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </>
  );
}