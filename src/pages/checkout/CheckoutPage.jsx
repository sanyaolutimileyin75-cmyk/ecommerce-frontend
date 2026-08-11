import axios from 'axios';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/imageUrl';
import './checkout-header.css';
import './CheckoutPage.css';
import { OrderSummary } from './OrderSummary';
import { PaymentSummary } from './PaymentSummary';

export function CheckoutPage({ cart, loadCart }) {
  const [deliveryOptions, setDeliveryOptions]   = useState([]);
  const [paymentSummary, setPaymentSummary]     = useState(null);
  const [isLoading, setIsLoading]               = useState(true);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      setIsLoading(true);
      try {
        const [deliveryRes, paymentRes] = await Promise.all([
          axios.get('/api/delivery-options?expand=estimatedDeliveryTime'),
          axios.get('/api/payment-summary'),
        ]);
        setDeliveryOptions(deliveryRes.data);
        setPaymentSummary(paymentRes.data);
      } catch (error) {
        console.error('Failed to load checkout data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckoutData();
  }, [cart]);

  /* total cart quantity for header */
  const totalItems = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <>
      <title>Checkout</title>

      {/* ── checkout header ── */}
      <div className="checkout-header">
        <div className="header-content">

          <div className="checkout-header-left-section">
            <a href="/" aria-label="Back to store">
              <img
                className="logo"
                src={getImageUrl('images/logo.png')}
                alt="Logo"
              />
              <img
                className="mobile-logo"
                src={getImageUrl('images/mobile-logo.png')}
                alt="Logo"
              />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout&nbsp;
            <span className="checkout-item-count">
              (<a className="return-to-home-link" href="/">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </a>)
            </span>
          </div>

          <div className="checkout-header-right-section">
            <img
              src={getImageUrl('images/icons/checkout-lock-icon.png')}
              alt="Secure checkout"
            />
          </div>

        </div>
      </div>

      {/* ── page body ── */}
      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        {isLoading ? (
          <div className="checkout-loading">
            <div className="checkout-spinner" />
            <p>Loading your cart...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="checkout-empty">
            <p>🛒 Your cart is empty</p>
            <a href="/" className="checkout-empty-link">
              Continue shopping
            </a>
          </div>
        ) : (
          <div className="checkout-grid">
            {/* order summary left / top on mobile */}
            <OrderSummary
              cart={cart}
              deliveryOptions={deliveryOptions}
              loadCart={loadCart}
            />

            {/* payment summary right / top on mobile */}
            <PaymentSummary
              paymentSummary={paymentSummary}
              loadCart={loadCart}
            />
          </div>
        )}
      </div>
    </>
  );
}