import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/usertype.css';

export default function UserTypePage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  function selectType(type: 'driver' | 'general') {
    updateUser({ userType: type });
    if (type === 'driver') {
      navigate('/ocr-scan');
    } else {
      navigate('/manual-input');
    }
  }

  return (
    <div className="usertype-container">
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
            <li>주소 자동 추출</li>
            <li>배달 순서 최적화</li>
          </ul>
          <button className="btn-select">배달 기사로 시작</button>
        </div>

        <div className="usertype-card" onClick={() => selectType('general')}>
          <div className="usertype-icon">🧭</div>
          <h2>일반 사용</h2>
          <p>여러 목적지를 직접 입력하여<br />최적의 방문 경로를 찾아드립니다</p>
          <ul className="usertype-features">
            <li>다중 목적지 입력</li>
            <li>경로 최적화</li>
            <li>지도 위 경로 표시</li>
            <li>네비게이션 안내</li>
          </ul>
          <button className="btn-select">일반 사용으로 시작</button>
        </div>
      </div>
    </div>
  );
}
