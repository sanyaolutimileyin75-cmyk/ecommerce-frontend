import { formatMoney } from '../../utils/money';
import axios from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';

export function DeliveryOptions({ cartItem, deliveryOptions, loadCart }) {
  const [updatingId, setUpdatingId] = useState(null);

  const updateDeliveryOption = async (deliveryOptionId) => {
    if (updatingId) return;
    setUpdatingId(deliveryOptionId);
    try {
      await axios.put(`/api/cart-items/${cartItem.productId}`, {
        deliveryOptionId,
      });
      await loadCart();
    } catch (error) {
      console.error('Failed to update delivery option:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>

      {deliveryOptions.map((option) => {
        const isSelected  = option.id === cartItem.deliveryOptionId;
        const isUpdating  = updatingId === option.id;
        const priceString = option.priceCents > 0
          ? `${formatMoney(option.priceCents)} - Shipping`
          : 'FREE SHIPPING';

        return (
          <div
            key={option.id}
            className={`delivery-option ${isSelected ? 'delivery-option--selected' : ''}`}
            onClick={() => updateDeliveryOption(option.id)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && updateDeliveryOption(option.id)}
          >
            <input
              type="radio"
              checked={isSelected}
              onChange={() => {}}
              className="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`}
              aria-label={`Delivery option: ${priceString}`}
              tabIndex={-1}
            />
            <div className="delivery-option-info">
              <div className="delivery-option-date">
                {dayjs(option.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
              </div>
              <div className={`delivery-option-price ${option.priceCents === 0 ? 'delivery-option-price--free' : ''}`}>
                {isUpdating ? 'Updating...' : priceString}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}