import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getImageUrl } from '../../utils/imageUrl';
import './ViewOrders.css';

type Product = {
  id: string;
  image: string;
  name: string;
  priceCents: number;
};

type OrderProduct = {
  productId: string;
  quantity: number;
  estimatedDeliveryTimeMs: number;
  product: Product;
};

type Order = {
  id: string;
  orderTimeMs: number;
  totalCostCents: number;
  products: OrderProduct[];
};

export function ViewOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await axios.get('/api/orders?expand=products');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Format timestamp → "Oct 15, 2024"
  const formatDate = (timeMs: number) => {
    return new Date(Number(timeMs)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Count total items in an order
  const getTotalItems = (order: Order) => {
    return order.products.reduce((sum, p) => sum + p.quantity, 0);
  };

  // Filter orders by search (matches order ID or product names)
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();

    // Check order ID
    if (order.id.toLowerCase().includes(q)) return true;

    // Check any product name in the order
    return order.products.some((p) =>
      p.product?.name.toLowerCase().includes(q)
    );
  });

  // Calculate summary stats for the top cards
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalCostCents, 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + getTotalItems(o), 0);

  if (loading) {
    return (
      <div className="view-orders">
        <p className="loading">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="view-orders">
      {/* Header */}
      <div className="orders-header">
        <div>
          <h1>All Orders</h1>
          <p className="subtitle">Manage and view customer orders</p>
        </div>
        <Link to="/admin" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Total Orders</span>
          <span className="summary-value">{orders.length}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Items Sold</span>
          <span className="summary-value">{totalItemsSold}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Revenue</span>
          <span className="summary-value">
            ${(totalRevenue / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by order ID or product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="clear-btn"
            onClick={() => setSearchQuery('')}
          >
            ✕
          </button>
        )}
      </div>

      {/* No orders at all */}
      {orders.length === 0 && (
        <div className="no-orders">
          <p>📭 No orders yet</p>
          <span>Orders will appear here once customers start buying.</span>
        </div>
      )}

      {/* No search results */}
      {orders.length > 0 && filteredOrders.length === 0 && (
        <div className="no-orders">
          <p>No orders match "{searchQuery}"</p>
        </div>
      )}

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.map((order) => (
          <div key={order.id} className="order-card">
            {/* Order Header */}
            <div className="order-card-header">
              <div>
                <div className="order-id-label">Order ID</div>
                <div className="order-id">#{order.id.slice(0, 8)}</div>
              </div>
              <div className="order-date">
                <div className="order-date-label">Placed On</div>
                <div className="order-date-value">
                  {formatDate(order.orderTimeMs)}
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="order-products">
              {order.products.map((item, idx) => (
                <div key={idx} className="order-product">
                  {item.product ? (
                    <>
                      <img
                        src={getImageUrl(item.product.image)}
                        alt={item.product.name}
                        className="product-img"
                      />
                      <div className="product-info">
                        <div className="product-name">
                          {item.product.name}
                        </div>
                        <div className="product-meta">
                          Qty: <strong>{item.quantity}</strong> · Delivery:{' '}
                          {formatDate(item.estimatedDeliveryTimeMs)}
                        </div>
                      </div>
                      <div className="product-price">
                        ${((item.product.priceCents * item.quantity) / 100).toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <div className="product-info">
                      <div className="product-name deleted">
                        [Product no longer available]
                      </div>
                      <div className="product-meta">
                        Qty: <strong>{item.quantity}</strong>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="order-card-footer">
              <div className="items-count">
                {getTotalItems(order)} item{getTotalItems(order) !== 1 ? 's' : ''}
              </div>
              <div className="order-total">
                Total:{' '}
                <span className="total-amount">
                  ${(order.totalCostCents / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}