import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ORIGIN_POINTS } from '../utils/geocoding';
import '../styles/originselect.css';

export default function OriginSelectPage() {
  const [selected, setSelected] = useState<'hanjin' | 'coupang' | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleProceed() {
    if (!selected) {
      alert('출발지를 선택해주세요.');
      return;
    }
    const origin = ORIGIN_POINTS[selected];
    sessionStorage.setItem('selectedOrigin', JSON.stringify(origin));

    if (user?.userType === 'driver') {
      navigate('/ocr-scan');
    } else {
      navigate('/manual-input');
    }
  }

  return (
    <div className="origin-container">
      <h1>배송 출발지 선택</h1>
      <p className="origin-subtitle">배송을 시작할 물류센터를 선택해주세요</p>

      <div className="origin-cards">
        <div
          className={`origin-card ${selected === 'hanjin' ? 'selected' : ''}`}
          onClick={() => setSelected('hanjin')}
        >
          <div className="origin-icon">📦</div>
          <h2>{ORIGIN_POINTS.hanjin.name}</h2>
          <p className="origin-address">{ORIGIN_POINTS.hanjin.address}</p>
          <div className="origin-coords">
            위도 {ORIGIN_POINTS.hanjin.lat.toFixed(4)}, 경도 {ORIGIN_POINTS.hanjin.lng.toFixed(4)}
          </div>
          {selected === 'hanjin' && <div className="check-badge">✓</div>}
        </div>

        <div
          className={`origin-card ${selected === 'coupang' ? 'selected' : ''}`}
          onClick={() => setSelected('coupang')}
        >
          <div className="origin-icon">🚀</div>
          <h2>{ORIGIN_POINTS.coupang.name}</h2>
          <p className="origin-address">{ORIGIN_POINTS.coupang.address}</p>
          <div className="origin-coords">
            위도 {ORIGIN_POINTS.coupang.lat.toFixed(4)}, 경도 {ORIGIN_POINTS.coupang.lng.toFixed(4)}
          </div>
          {selected === 'coupang' && <div className="check-badge">✓</div>}
        </div>
      </div>

      <div className="origin-actions">
        <button className="btn-back" onClick={() => navigate('/user-type')}>
          ← 뒤로
        </button>
        <button
          className="btn-proceed"
          onClick={handleProceed}
          disabled={!selected}
        >
          선택 완료 →
        </button>
      </div>
    </div>
  );
}
