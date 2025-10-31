
import React from 'react';

interface VocabularyCardProps {
  vietnameseWord: string;
  userAnswer: string;
  onAnswerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isSubmitted: boolean;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({
  vietnameseWord,
  userAnswer,
  onAnswerChange,
  onSubmit,
  isLoading,
  isSubmitted,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSubmitted && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full">
      <div className="text-center">
        <p className="text-lg text-gray-500 mb-2">Nghĩa của từ:</p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 capitalize">
          {vietnameseWord}
        </h2>
      </div>
      <div className="mt-8">
        <input
          type="text"
          value={userAnswer}
          onChange={onAnswerChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu trả lời của bạn..."
          disabled={isLoading || isSubmitted}
          className="w-full px-4 py-3 text-lg text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-100"
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      <div className="mt-6">
        <button
          onClick={onSubmit}
          disabled={isLoading || isSubmitted}
          className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang chấm điểm...
            </>
          ) : (
            'Kiểm tra'
          )}
        </button>
      </div>
    </div>
  );
};

export default VocabularyCard;
