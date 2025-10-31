
import React from 'react';

interface ScoreDisplayProps {
  score: number;
  feedback: string;
  correctAnswer: string;
  onNext: () => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, feedback, correctAnswer, onNext }) => {
  const getScoreColor = () => {
    if (score >= 90) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBackgroundColor = () => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className={`p-6 rounded-2xl shadow-md w-full animate-fade-in ${getBackgroundColor()}`}>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">Điểm của bạn:</p>
        <p className={`text-6xl font-extrabold my-2 ${getScoreColor()}`}>{score}%</p>
        <p className="text-md text-gray-600 italic">"{feedback}"</p>
        {score < 100 && (
          <p className="mt-4 text-md text-gray-800">
            Đáp án đúng là: <strong className="font-bold capitalize">{correctAnswer}</strong>
          </p>
        )}
      </div>
      <div className="mt-6">
        <button
          onClick={onNext}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
        >
          Từ tiếp theo
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ScoreDisplay;
