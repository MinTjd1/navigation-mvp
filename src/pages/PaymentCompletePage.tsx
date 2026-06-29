import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/payment.css';

export default function PaymentCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { plan?: string; price?: string } | null;
  const plan = state?.plan || 'Pro';
  const price = state?.price || '₩9,900';

  return (
    <div className="payment-container">
      <div className="payment-card complete-card">
        <div className="complete-icon">✅</div>
        <h1>결제가 완료되었습니다!</h1>
        <p className="complete-desc">
          <strong>{plan}</strong> 플랜이 활성화되었습니다.
        </p>

        <div className="complete-receipt">
          <div className="receipt-row">
            <span>구독 플랜</span>
            <span className="receipt-value">{plan}</span>
          </div>
          <div className="receipt-row">
            <span>결제 금액</span>
            <span className="receipt-value">{price}/월</span>
          </div>
          <div className="receipt-row">
            <span>결제 상태</span>
            <span className="receipt-status">완료</span>
          </div>
        </div>

        <button className="btn-pay" onClick={() => navigate('/user-type')}>
          시작하기 →
        </button>
      </div>
    </div>
  );
}
