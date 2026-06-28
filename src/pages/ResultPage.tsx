import { useLocation, useNavigate } from 'react-router-dom';
import type { Word } from '../data/words';
import '../styles/vocab.css';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { total, correct, wrongList, mode } = location.state as {
    total: number;
    correct: number;
    wrongList: Word[];
    mode: string;
  };

  const percentage = Math.round((correct / total) * 100);

  const getGrade = () => {
    if (percentage >= 90) return { text: 'Excellent!', color: '#10b981' };
    if (percentage >= 70) return { text: 'Good!', color: '#3b82f6' };
    if (percentage >= 50) return { text: 'Not Bad', color: '#f59e0b' };
    return { text: 'Keep Trying', color: '#ef4444' };
  };

  const grade = getGrade();

  return (
    <div className="vocab-container">
      <div className="result-card">
        <h1 className="result-title">퀴즈 결과</h1>

        <div className="result-circle" style={{ borderColor: grade.color }}>
          <span className="result-percentage">{percentage}%</span>
          <span className="result-grade" style={{ color: grade.color }}>
            {grade.text}
          </span>
        </div>

        <div className="result-stats">
          <div className="result-stat">
            <span className="result-stat-value">{total}</span>
            <span className="result-stat-label">전체</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-value correct-text">{correct}</span>
            <span className="result-stat-label">정답</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-value wrong-text">{total - correct}</span>
            <span className="result-stat-label">오답</span>
          </div>
        </div>

        {wrongList.length > 0 && (
          <div className="wrong-words-section">
            <h3>틀린 단어 목록</h3>
            <div className="wrong-words-list">
              {wrongList.map((w, i) => (
                <div key={i} className="wrong-word-item">
                  <span className="wrong-word-en">{w.word}</span>
                  <span className="wrong-word-ko">{w.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="result-actions">
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            홈으로
          </button>
          {wrongList.length > 0 && (
            <button
              className="btn btn-wrong"
              onClick={() => {
                const shuffled = [...wrongList].sort(() => Math.random() - 0.5);
                navigate('/quiz', { state: { quizWords: shuffled, mode: 'wrong' } });
              }}
            >
              틀린 단어 다시 풀기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
