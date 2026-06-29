import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/payment.css';

interface PlanInfo {
  name: string;
  price: string;
  priceNum: number;
}

const PLANS: Record<string, PlanInfo> = {
  Pro: { name: 'Pro', price: '₩9,900', priceNum: 9900 },
  Enterprise: { name: 'Enterprise', price: '₩29,900', priceNum: 29900 },
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  const planKey = (location.state as { plan?: string })?.plan || 'Pro';
  const plan = PLANS[planKey] || PLANS.Pro;

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  function formatCardNumber(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const digits = cardNumber.replace(/\s/g, '');
    if (digits.length < 16) {
      setError('카드 번호 16자리를 입력해주세요.');
      return;
    }
    if (expiry.length < 5) {
      setError('유효기간을 입력해주세요. (MM/YY)');
      return;
    }
    if (cvc.length < 3) {
      setError('CVC 3자리를 입력해주세요.');
      return;
    }
    if (!cardHolder.trim()) {
      setError('카드 소유자 이름을 입력해주세요.');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      updateUser({ isSubscribed: true, plan: plan.name });
      setProcessing(false);
      navigate('/payment-complete', { state: { plan: plan.name, price: plan.price } });
    }, 2000);
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <button className="payment-back" onClick={() => navigate('/subscription')}>
          ← 뒤로
        </button>

        <div className="payment-header">
          <h1>결제 정보 입력</h1>
          <p>안전한 결제를 위해 카드 정보를 입력해주세요</p>
        </div>

        <div className="payment-summary">
          <div className="payment-plan-name">{plan.name} 플랜</div>
          <div className="payment-plan-price">
            <span className="payment-amount">{plan.price}</span>
            <span className="payment-period">/월</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="payment-field">
            <label>카드 번호</label>
            <div className="card-input-wrapper">
              <span className="card-icon">💳</span>
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
            </div>
          </div>

          <div className="payment-row">
            <div className="payment-field">
              <label>유효기간</label>
              <input
                type="text"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div className="payment-field">
              <label>CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="000"
                maxLength={3}
              />
            </div>
          </div>

          <div className="payment-field">
            <label>카드 소유자</label>
            <input
              type="text"
              value={cardHolder}
              onChange={e => setCardHolder(e.target.value)}
              placeholder="홍길동"
            />
          </div>

          {error && <div className="payment-error">{error}</div>}

          <button type="submit" className="btn-pay" disabled={processing}>
            {processing ? (
              <span className="pay-processing">
                <span className="pay-spinner" />
                결제 처리 중...
              </span>
            ) : (
              `${plan.price} 결제하기`
            )}
          </button>
        </form>

        <div className="payment-secure">
          <span>🔒</span> 모든 결제 정보는 안전하게 암호화됩니다
        </div>
      </div>
    </div>
  );
}
