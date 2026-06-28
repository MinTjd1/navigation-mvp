import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import words, { type Word } from '../data/words';
import '../styles/vocab.css';

function generateChoices(correctWord: Word, allWords: Word[]): Word[] {
  const choices = [correctWord];
  const others = allWords.filter((w) => w.word !== correctWord.word);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  for (const w of shuffled) {
    if (choices.length >= 4) break;
    if (!choices.some((c) => c.meaning === w.meaning)) {
      choices.push(w);
    }
  }
  return choices.sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizWords, mode } = location.state as { quizWords: Word[]; mode: string };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongList, setWrongList] = useState<Word[]>([]);
  const [answered, setAnswered] = useState(false);

  const currentWord = quizWords[currentIndex];

  const choices = useMemo(
    () => generateChoices(currentWord, words),
    [currentIndex]
  );

  const handleSelect = (meaning: string) => {
    if (answered) return;
    setSelected(meaning);
    setAnswered(true);

    if (meaning === currentWord.meaning) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongList((prev) => [...prev, currentWord]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= quizWords.length) {
      const existingWrong: Word[] = JSON.parse(localStorage.getItem('wrongWords') || '[]');

      if (mode === 'wrong') {
        const remaining = wrongList;
        localStorage.setItem('wrongWords', JSON.stringify(remaining));
      } else {
        const merged = [...existingWrong];
        for (const w of wrongList) {
          if (!merged.some((m) => m.word === w.word)) {
            merged.push(w);
          }
        }
        localStorage.setItem('wrongWords', JSON.stringify(merged));
      }

      navigate('/result', {
        state: {
          total: quizWords.length,
          correct: correctCount,
          wrongList,
          mode,
        },
      });
      return;
    }

    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  };

  const meaning = selected;
  const isCorrect = meaning === currentWord.meaning;

  const getChoiceClass = (choiceMeaning: string) => {
    if (!answered) return 'choice-btn';
    if (choiceMeaning === currentWord.meaning) return 'choice-btn correct';
    if (choiceMeaning === selected) return 'choice-btn wrong';
    return 'choice-btn';
  };

  return (
    <div className="vocab-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <span className="quiz-progress">
            {currentIndex + 1} / {quizWords.length}
          </span>
          <span className="quiz-score">
            {correctCount}개 정답
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / quizWords.length) * 100}%` }}
          />
        </div>

        <div className="word-display">
          <h2 className="quiz-word">{currentWord.word}</h2>
        </div>

        <div className="choices">
          {choices.map((choice, i) => (
            <button
              key={i}
              className={getChoiceClass(choice.meaning)}
              onClick={() => handleSelect(choice.meaning)}
              disabled={answered}
            >
              {choice.meaning}
            </button>
          ))}
        </div>

        {answered && (
          <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
            {isCorrect ? 'O 정답!' : `X 오답! 정답: ${currentWord.meaning}`}
          </div>
        )}

        {answered && (
          <button className="btn btn-next" onClick={handleNext}>
            {currentIndex + 1 >= quizWords.length ? '결과 보기' : '다음 문제'}
          </button>
        )}
      </div>
    </div>
  );
}
