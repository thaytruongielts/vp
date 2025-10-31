
import React, { useState, useCallback, useMemo } from 'react';
import { VOCABULARY_LIST } from './constants';
import type { VocabularyItem, EvaluationResult } from './types';
import { evaluateAnswer } from './services/geminiService';
import VocabularyCard from './components/VocabularyCard';
import ScoreDisplay from './components/ScoreDisplay';
import ProgressBar from './components/ProgressBar';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const App: React.FC = () => {
  const [vocabulary, setVocabulary] = useState(() => shuffleArray(VOCABULARY_LIST));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const currentWord: VocabularyItem = vocabulary[currentIndex];

  const handleCheck = useCallback(async () => {
    if (!userAnswer.trim()) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const correctAnswer = currentWord.english;
      const evaluation = await evaluateAnswer(userAnswer, correctAnswer);
      setResult({ ...evaluation, correctAnswer });
      setScores(prev => [...prev, evaluation.score]);
    } catch (err) {
      console.error("Error evaluating answer:", err);
      setError("Đã có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [userAnswer, currentWord]);

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setResult(null);
      setError(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setVocabulary(shuffleArray(VOCABULARY_LIST));
    setCurrentIndex(0);
    setUserAnswer('');
    setResult(null);
    setIsLoading(false);
    setIsFinished(false);
    setScores([]);
    setError(null);
  };

  const averageScore = useMemo(() => {
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / scores.length);
  }, [scores]);

  const renderContent = () => {
    if (isFinished) {
      return (
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Hoàn thành!</h2>
          <p className="text-lg text-gray-600 mb-6">Bạn đã hoàn thành tất cả các từ vựng.</p>
          <div className="mb-6">
            <p className="text-xl font-semibold text-gray-700">Điểm trung bình của bạn:</p>
            <p className={`text-5xl font-extrabold mt-2 ${averageScore > 80 ? 'text-green-500' : averageScore > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
              {averageScore}%
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
          >
            Làm lại từ đầu
          </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-lg space-y-6">
        <ProgressBar current={currentIndex + 1} total={vocabulary.length} />
        <VocabularyCard
          vietnameseWord={currentWord.vietnamese}
          userAnswer={userAnswer}
          onAnswerChange={(e) => setUserAnswer(e.target.value)}
          onSubmit={handleCheck}
          isLoading={isLoading}
          isSubmitted={!!result || !!error}
        />
        {error && <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        {result && (
          <ScoreDisplay 
            score={result.score}
            feedback={result.feedback}
            correctAnswer={result.correctAnswer}
            onNext={handleNext}
          />
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
       <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Luyện Từ Vựng
        </h1>
        <p className="text-gray-500 mt-2">Nhập từ tiếng Anh tương ứng và kiểm tra nhé!</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default App;