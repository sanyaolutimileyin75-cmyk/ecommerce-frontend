import axios from 'axios';
import { useState, useEffect, Fragment } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router';
import { Header } from '../../components/Header';
import { formatMoney } from '../../utils/money';
import { getImageUrl } from '../../utils/imageUrl';
import './OrdersPage.css';

export function OrdersPage({ cart }) {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    axios
      .get('/api/orders?expand=products')
      .then((response) => setOrders(response.data))
      .catch((err) => console.error('Failed to load orders:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleBuyAgain = async (productId) => {
    if (addingId) return;
    setAddingId(productId);
    try {
      await axios.post('/api/cart-items', { productId, quantity: 1 });
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      <title>Orders</title>
      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        {/* ── loading ── */}
        {loading && (
          <div className="orders-loading">
            <div className="orders-spinner" />
            <p>Loading your orders...</p>
          </div>
        )}

        {/* ── empty state ── */}
        {!loading && orders.length === 0 && (
          <div className="orders-empty">
            <p>📦 No orders yet</p>
            <Link to="/" className="orders-empty-link">
              Start shopping
            </Link>
          </div>
        )}

        {/* ── orders list ── */}
        {!loading && orders.length > 0 && (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-container">

                {/* ── order header ── */}
                <div className="order-header">
                  <div className="order-header-left-section">

                    <div className="order-header-item">
                      <div className="order-header-label">Order Placed:</div>
                      <div className="order-header-value">
                        {dayjs(order.orderTimeMs).format('MMMM D, YYYY')}
                      </div>
                    </div>

                    <div className="order-header-item">
                      <div className="order-header-label">Total:</div>
                      <div className="order-header-value">
                        {formatMoney(order.totalCostCents)}
                      </div>
                    </div>

                  </div>

                  <div className="order-header-right-section">
                    <div className="order-header-label">Order ID:</div>
                    <div className="order-id">{order.id}</div>
                  </div>
                </div>

                {/* ── order products ── */}
                <div className="order-details-grid">
                  {order.products.map((orderProduct) => (
                    <Fragment key={orderProduct.product.id}>

                      {/* image */}
                      <div className="product-image-container">
                        <img
                          src={getImageUrl(orderProduct.product.image)}
                          alt={orderProduct.product.name}
                          loading="lazy"
                        />
                      </div>

                      {/* details */}
                      <div className="product-details">
                        <div className="product-name">
                          {orderProduct.product.name}
                        </div>
                        <div className="product-delivery-date">
                          Arriving on:{' '}
                          {dayjs(orderProduct.estimatedDeliveryTimeMs).format('MMMM D')}
                        </div>
                        <div className="product-quantity">
                          Quantity: {orderProduct.quantity}
                        </div>

                        <button
                          className="buy-again-button button-primary"
                          onClick={() => handleBuyAgain(orderProduct.product.id)}
                          disabled={addingId === orderProduct.product.id}
                          aria-label={`Add ${orderProduct.product.name} to cart`}
                        >
                          <img
                            className="buy-again-icon"
                            src={getImageUrl('images/icons/buy-again.png')}
                            alt=""
                          />
                          <span className="buy-again-message">
                            {addingId === orderProduct.product.id
                              ? 'Adding...'
                              : 'Add to Cart'}
                          </span>
                        </button>
                      </div>

                      {/* actions */}
                      <div className="product-actions">
                        <Link to="/tracking">
                          <button
                            className="track-package-button button-secondary"
                            aria-label="Track package"
                          >
                            Track package
                          </button>
                        </Link>
                      </div>

                    </Fragment>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}