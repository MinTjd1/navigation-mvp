import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/usertype.css';

export default function UserTypePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const currentPlan = user?.plan || '무료';

  function selectType(type: 'driver' | 'general') {
    updateUser({ userType: type });
    if (type === 'driver') {
      navigate('/origin-select');
    } else {
      navigate('/general-input');
    }
  }

  return (
    <div className="usertype-container">
      <div className="plan-badge-fixed" onClick={() => navigate('/subscription')}>
        <span className="plan-badge-label">현재 플랜</span>
        <span className="plan-badge-name">{currentPlan}</span>
      </div>
      <h1>사용 유형을 선택해주세요</h1>
      <p className="usertype-subtitle">어떤 용도로 NaviOptima를 사용하시나요?</p>

      <div className="usertype-cards">
        <div className="usertype-card" onClick={() => selectType('driver')}>
          <div className="usertype-icon">🚚</div>
          <h2>배달 기사</h2>
          <p>운송장 바코드를 스캔하여<br />자동으로 배달 경로를 최적화합니다</p>
          <ul className="usertype-features">
            <li>OCR 카메라 연동</li>
            <li>운송장 바코드 자동 인식</li>
            <li>대전 지역 주소 자동 추출</li>
            <li>배달 순서 최적화</li>
          </ul>
          <button className="btn-select">배달 기사로 시작</button>
        </div>

        <div className="usertype-card" onClick={() => selectType('general')}>
          <div className="usertype-icon">🧭</div>
          <h2>일반 사용</h2>
          <p>대전 지역 내 여러 목적지를 입력하여<br />최적의 방문 경로를 찾아드립니다</p>
          <ul className="usertype-features">
            <li>대전 지역 다중 목적지 입력</li>
            <li>플로이드-워셜 경로 최적화</li>
            <li>지도 위 경로 표시</li>
            <li>네비게이션 안내</li>
          </ul>
          <button className="btn-select">일반 사용으로 시작</button>
        </div>
      </div>
    </div>
  );
}
