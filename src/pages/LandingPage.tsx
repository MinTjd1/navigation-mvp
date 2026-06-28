import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleStart() {
    navigate('/login');
  }

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <nav className="landing-nav">
          <div className="nav-logo">
            <span className="nav-logo-icon">🗺️</span>
            <span className="nav-logo-text">NaviOptima</span>
          </div>
          {user && (
            <div className="nav-user-badge">
              <span className="nav-user-icon">👤</span>
              <span className="nav-user-email">{user.email}</span>
            </div>
          )}
        </nav>

        <div className="hero-content">
          <div className="hero-badge">Floyd-Warshall Algorithm Powered</div>
          <h1>
            대전 지역<br />
            <span className="gradient-text">다중 목적지 경로 최적화</span>
          </h1>
          <p className="hero-desc">
            여러 곳을 방문해야 할 때, AI 알고리즘이 최적의 순서와 경로를 찾아드립니다.
            배달 기사부터 일반 사용자까지, 시간과 거리를 절약하세요.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={handleStart}>
              경로 최적화 시작하기
            </button>
            <a href="#features" className="btn-hero-secondary">기능 알아보기</a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">O(n³)</span>
              <span className="stat-label">Floyd-Warshall</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">30+</span>
              <span className="stat-label">대전 주요 랜드마크</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">실시간</span>
              <span className="stat-label">도로 기반 경로</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">📍</div>
            <div className="card-text">
              <strong>대전역</strong>
              <span>동구 중앙로 215</span>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">📍</div>
            <div className="card-text">
              <strong>카이스트</strong>
              <span>유성구 대학로 291</span>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">📍</div>
            <div className="card-text">
              <strong>성심당</strong>
              <span>중구 대종로 480번길</span>
            </div>
          </div>
          <div className="matrix-demo">
            <div className="matrix-label">Distance Matrix</div>
            <div className="matrix-grid-demo">
              {['0', '5.2', '8.1', '5.2', '0', '3.7', '8.1', '3.7', '0'].map((v, i) => (
                <div key={i} className={`m-cell ${i % 4 === 0 ? 'diag' : ''}`}>{v}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <h2 className="section-title">핵심 기능</h2>
        <p className="section-sub">최적의 경로를 찾기 위한 강력한 도구들</p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap purple">
              <span>🧮</span>
            </div>
            <h3>플로이드-워셜 알고리즘</h3>
            <p>모든 지점 간 최단 거리를 계산하여 수학적으로 최적화된 방문 순서를 결정합니다.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap blue">
              <span>🛣️</span>
            </div>
            <h3>실제 도로 기반 경로</h3>
            <p>직선 거리가 아닌 실제 도로 네트워크를 기반으로 정확한 이동 거리와 경로를 제공합니다.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap green">
              <span>📍</span>
            </div>
            <h3>정확한 위치 검색</h3>
            <p>장소명만 입력해도 Kakao API와 내장 데이터베이스로 정확한 좌표와 도로명주소를 찾습니다.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap orange">
              <span>📷</span>
            </div>
            <h3>운송장 OCR 스캔</h3>
            <p>배달 기사를 위한 카메라 기반 운송장 바코드 스캔으로 주소를 자동 입력합니다.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap red">
              <span>📱</span>
            </div>
            <h3>GPS 현재 위치</h3>
            <p>현재 내 위치를 자동으로 파악하여 출발지로 설정, 가장 효율적인 경로를 안내합니다.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap teal">
              <span>🗺️</span>
            </div>
            <h3>인터랙티브 지도</h3>
            <p>최적화된 경로를 지도 위에 시각화하고, 각 구간 거리와 방문 순서를 한눈에 확인합니다.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2 className="section-title">이용 방법</h2>
        <p className="section-sub">3단계로 최적 경로를 찾으세요</p>

        <div className="steps-row">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3>목적지 입력</h3>
            <p>방문할 장소를 입력하거나 운송장을 스캔합니다</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-num">2</div>
            <h3>알고리즘 최적화</h3>
            <p>Floyd-Warshall이 모든 경로를 분석합니다</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-num">3</div>
            <h3>네비게이션 시작</h3>
            <p>최적 경로를 따라 이동을 시작합니다</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>지금 바로 시작하세요</h2>
          <p>대전 지역 다중 목적지 경로 최적화를 무료로 체험해보세요.</p>
          <button className="btn-cta" onClick={handleStart}>무료로 시작하기</button>

        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span>🗺️</span> NaviOptima
          </div>
          <p>Floyd-Warshall 알고리즘 기반 다중 목적지 경로 최적화 서비스</p>
          <p className="footer-copy">© 2024 NaviOptima. 대전광역시 한정 서비스.</p>
        </div>
      </footer>
    </div>
  );
}
