import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import words from '../data/words';
import '../styles/vocab.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [wrongWords, setWrongWords] = useState<typeof words>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wrongWords');
    if (stored) {
      setWrongWords(JSON.parse(stored));
    }
  }, []);

  const startQuiz = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 30);
    navigate('/quiz', { state: { quizWords: selected, mode: 'all' } });
  };

  const startWrongQuiz = () => {
    const count = Math.min(wrongWords.length, 30);
    const shuffled = [...wrongWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    navigate('/quiz', { state: { quizWords: selected, mode: 'wrong' } });
  };

  const clearWrongWords = () => {
    localStorage.removeItem('wrongWords');
    setWrongWords([]);
  };

  return (
    <div className="vocab-container">
      <div className="home-card">
        <h1 className="home-title">Vocab Quiz</h1>
        <p className="home-subtitle">영단어 뜻 맞추기</p>

        <div className="home-stats">
          <div className="stat-item">
            <span className="stat-number">{words.length}</span>
            <span className="stat-label">전체 단어</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{wrongWords.length}</span>
            <span className="stat-label">틀린 단어</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={startQuiz}>
          퀴즈 시작 (30문제)
        </button>

        {wrongWords.length > 0 && (
          <>
            <button className="btn btn-wrong" onClick={startWrongQuiz}>
              틀린 단어 복습 ({wrongWords.length}개)
            </button>
            <button className="btn btn-clear" onClick={clearWrongWords}>
              틀린 단어 초기화
            </button>
          </>
        )}
      </div>
    </div>
  );
}
