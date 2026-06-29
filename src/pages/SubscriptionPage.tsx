import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/subscription.css';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  function handleSubscribe(plan: string) {
    updateUser({ isSubscribed: true, plan });
    alert(`${plan} 구독이 완료되었습니다!`);
    navigate('/user-type');
  }

  function handleSkip() {
    updateUser({ isSubscribed: false, plan: '무료' });
    navigate('/user-type');
  }

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1>구독 플랜 선택</h1>
        <p>NaviOptima의 프리미엄 기능을 이용해보세요</p>
      </div>

      <div className="plans-grid">
        <div className="plan-card">
          <div className="plan-badge">무료</div>
          <h2>Basic</h2>
          <div className="plan-price">
            <span className="price">₩0</span>
            <span className="period">/월</span>
          </div>
          <ul className="plan-features">
            <li>✓ 최대 5개 목적지</li>
            <li>✓ 기본 경로 최적화</li>
            <li>✗ OCR 바코드 스캔</li>
            <li>✗ 실시간 교통 반영</li>
          </ul>
          <button className="btn-plan btn-basic" onClick={handleSkip}>
            무료로 시작
          </button>
        </div>

        <div className="plan-card plan-popular">
          <div className="plan-badge popular">인기</div>
          <h2>Pro</h2>
          <div className="plan-price">
            <span className="price">₩9,900</span>
            <span className="period">/월</span>
          </div>
          <ul className="plan-features">
            <li>✓ 최대 20개 목적지</li>
            <li>✓ 고급 경로 최적화</li>
            <li>✓ OCR 바코드 스캔</li>
            <li>✗ 실시간 교통 반영</li>
          </ul>
          <button className="btn-plan btn-pro" onClick={() => handleSubscribe('Pro')}>
            Pro 구독하기
          </button>
        </div>

        <div className="plan-card">
          <div className="plan-badge">프리미엄</div>
          <h2>Enterprise</h2>
          <div className="plan-price">
            <span className="price">₩29,900</span>
            <span className="period">/월</span>
          </div>
          <ul className="plan-features">
            <li>✓ 무제한 목적지</li>
            <li>✓ 고급 경로 최적화</li>
            <li>✓ OCR 바코드 스캔</li>
            <li>✓ 실시간 교통 반영</li>
          </ul>
          <button className="btn-plan btn-enterprise" onClick={() => handleSubscribe('Enterprise')}>
            Enterprise 구독하기
          </button>
        </div>
      </div>

      <button className="btn-skip" onClick={handleSkip}>
        건너뛰기 →
      </button>
    </div>
  );
}
