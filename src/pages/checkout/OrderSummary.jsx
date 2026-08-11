import axios from 'axios';
import dayjs from 'dayjs';
import { formatMoney } from '../../utils/money';
import { getImageUrl } from '../../utils/imageUrl';
import { DeliveryOptions } from './DeliveryOptions';
import { useState } from 'react';

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
  const [deletingId, setDeletingId] = useState(null);

  if (!deliveryOptions.length || !cart.length) return null;

  return (
    <div className="order-summary">
      {cart.map((cartItem) => {
        const selectedDelivery = deliveryOptions.find(
          (opt) => opt.id === cartItem.deliveryOptionId
        );

        const deleteCartItem = async () => {
          if (deletingId) return;
          setDeletingId(cartItem.productId);
          try {
            await axios.delete(`/api/cart-items/${cartItem.productId}`);
            await loadCart();
          } catch (error) {
            console.error('Failed to delete item:', error);
          } finally {
            setDeletingId(null);
          }
        };

        const isDeleting = deletingId === cartItem.productId;

        return (
          <div
            key={cartItem.productId}
            className={`cart-item-container ${isDeleting ? 'cart-item--deleting' : ''}`}
          >
            {/* delivery date */}
            {selectedDelivery && (
              <div className="delivery-date">
                Delivery date:{' '}
                {dayjs(selectedDelivery.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
              </div>
            )}

            {/* item details */}
            <div className="cart-item-details-grid">

              {/* image */}
              <div className="cart-item-image-wrapper">
                <img
                  className="product-image"
                  src={getImageUrl(cartItem.product.image)}
                  alt={cartItem.product.name}
                  loading="lazy"
                />
              </div>

              {/* text details */}
              <div className="cart-item-details">
                <div className="product-name">{cartItem.product.name}</div>
                <div className="product-price">
                  {formatMoney(cartItem.product.priceCents)}
                </div>
                <div className="product-quantity">
                  <span>
                    Quantity:{' '}
                    <span className="quantity-label">{cartItem.quantity}</span>
                  </span>
                  <button
                    className="item-action-btn link-primary"
                    onClick={deleteCartItem}
                    disabled={isDeleting}
                    aria-label={`Delete ${cartItem.product.name}`}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              {/* delivery options - spans both columns on mobile */}
              <div className="cart-item-delivery-wrapper">
                <DeliveryOptions
                  cartItem={cartItem}
                  deliveryOptions={deliveryOptions}
                  loadCart={loadCart}
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}