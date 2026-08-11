import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { formatMoney } from '../../utils/money';

export function PaymentSummary({ paymentSummary, loadCart }) {
  const navigate          = useNavigate();
  const [placing, setPlacing] = useState(false);

  const createOrder = async () => {
    if (placing) return;
    setPlacing(true);
    try {
      await axios.post('/api/orders');
      await loadCart();
      navigate('/orders');
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (!paymentSummary) return null;

  const rows = [
    {
      label: `Items (${paymentSummary.totalItems}):`,
      value: formatMoney(paymentSummary.productCostCents),
      className: '',
    },
    {
      label: 'Shipping & handling:',
      value: formatMoney(paymentSummary.shippingCostCents),
      className: '',
    },
    {
      label: 'Total before tax:',
      value: formatMoney(paymentSummary.totalCostBeforeTaxCents),
      className: 'subtotal-row',
    },
    {
      label: 'Estimated tax (10%):',
      value: formatMoney(paymentSummary.taxCents),
      className: '',
    },
  ];

  return (
    <div className="payment-summary">
      <div className="payment-summary-title">Payment Summary</div>

      {rows.map(({ label, value, className }) => (
        <div key={label} className={`payment-summary-row ${className}`}>
          <div>{label}</div>
          <div className="payment-summary-money">{value}</div>
        </div>
      ))}

      {/* order total */}
      <div className="payment-summary-row total-row">
        <div>Order total:</div>
        <div className="payment-summary-money">
          {formatMoney(paymentSummary.totalCostCents)}
        </div>
      </div>

      <button
        className="place-order-button button-primary"
        onClick={createOrder}
        disabled={placing}
        aria-label="Place your order"
      >
        {placing ? 'Placing order...' : 'Place your order'}
      </button>

      {/* trust badge */}
      <div className="payment-trust">
        🔒 Secure checkout
      </div>
    </div>
  );
}