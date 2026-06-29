import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    if (login(email, password)) {
      navigate('/subscription');
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🗺️</span>
          <h1>NaviOptima</h1>
          <p className="auth-subtitle">다중목적지 경로최적화 네비게이션</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary">로그인</button>
        </form>
        <div className="auth-footer auth-footer-links">
          <Link to="#">아이디 찾기</Link>
          <span className="auth-divider">|</span>
          <Link to="#">비밀번호 찾기</Link>
          <span className="auth-divider">|</span>
          <Link to="/consent">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
