import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/settings.css';

export default function SettingsPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <button className="settings-trigger" onClick={() => navigate('/login')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    );
  }

  const plan = user.plan || '무료';
  const planClass = plan === 'Enterprise' ? 'enterprise' : plan === 'Pro' ? 'pro' : 'free';

  return (
    <>
      <button className="settings-trigger" onClick={() => setOpen(true)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {open && <div className="settings-overlay" onClick={() => setOpen(false)} />}

      <div className={`settings-panel ${open ? 'open' : ''}`}>
        <div className="settings-header">
          <h2>설정</h2>
          <button className="settings-close" onClick={() => setOpen(false)}>×</button>
        </div>

        <div className="settings-body">
          <div className="settings-section">
            <div className="settings-section-title">프로필</div>
            <div className="settings-profile">
              <div className="settings-avatar">
                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </div>
              <div className="settings-profile-info">
                <div className="settings-name">{user.name || '사용자'}</div>
                <div className="settings-email">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">구독 플랜</div>
            <div className="settings-plan-card">
              <div className={`settings-plan-badge ${planClass}`}>{plan}</div>
              <div className="settings-plan-detail">
                {plan === '무료' && '최대 5개 목적지 · 기본 경로 최적화'}
                {plan === 'Pro' && '최대 20개 목적지 · OCR 바코드 스캔'}
                {plan === 'Enterprise' && '무제한 목적지 · 실시간 교통 반영'}
              </div>
              <button
                className="settings-plan-btn"
                onClick={() => { setOpen(false); navigate('/subscription'); }}
              >
                플랜 변경
              </button>
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">자주 사용한 출발지</div>
            {user.recentOrigins && user.recentOrigins.length > 0 ? (
              <ul className="settings-place-list">
                {user.recentOrigins.slice(0, 5).map((place, i) => (
                  <li key={i}>
                    <span className="settings-place-icon">🚩</span>
                    <span className="settings-place-name">{place}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="settings-empty">아직 사용 기록이 없습니다</div>
            )}
          </div>

          <div className="settings-section">
            <div className="settings-section-title">자주 사용한 목적지</div>
            {user.recentDestinations && user.recentDestinations.length > 0 ? (
              <ul className="settings-place-list">
                {user.recentDestinations.slice(0, 5).map((place, i) => (
                  <li key={i}>
                    <span className="settings-place-icon">📍</span>
                    <span className="settings-place-name">{place}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="settings-empty">아직 사용 기록이 없습니다</div>
            )}
          </div>

          <div className="settings-section">
            <div className="settings-section-title">사용 유형</div>
            <div className="settings-usertype">
              {user.userType === 'driver' ? '🚚 배달 기사' : user.userType === 'general' ? '🧭 일반 사용' : '미선택'}
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button
            className="settings-logout"
            onClick={() => { logout(); setOpen(false); navigate('/'); }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}
