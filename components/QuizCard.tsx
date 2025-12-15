import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { QuizQuestion } from '../types';

interface Props {
  questions: QuizQuestion[];
}

const QuizCard: React.FC<Props> = ({ questions }) => {
  const [selections, setSelections] = useState<{ [key: number]: number | null }>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qIndex: number, optIndex: number) => {
    if (showResults) return;
    setSelections(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const checkResults = () => {
    setShowResults(true);
  };

  const reset = () => {
    setSelections({});
    setShowResults(false);
  };

  const score = questions.reduce((acc, q, idx) => {
    return acc + (selections[idx] === q.correctAnswerIndex ? 1 : 0);
  }, 0);

  return (
    <div className="mt-4 space-y-6">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="font-semibold text-slate-800 dark:text-slate-100 mb-4 text-lg">{qIndex + 1}. {q.question}</p>
          <div className="space-y-2.5">
            {q.options.map((opt, optIndex) => {
              const isSelected = selections[qIndex] === optIndex;
              const isCorrect = q.correctAnswerIndex === optIndex;
              
              let baseClass = "w-full text-left p-3.5 rounded-lg text-sm border transition-all flex items-center justify-between ";
              
              if (showResults) {
                if (isCorrect) baseClass += "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800 text-green-800 dark:text-green-300 font-medium";
                else if (isSelected && !isCorrect) baseClass += "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300";
                else baseClass += "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500 opacity-60";
              } else {
                if (isSelected) baseClass += "bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-800 dark:text-violet-200 font-medium ring-1 ring-violet-300 dark:ring-violet-700";
                else baseClass += "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300";
              }

              return (
                <button
                  key={optIndex}
                  onClick={() => handleSelect(qIndex, optIndex)}
                  className={baseClass}
                >
                  <span>{String.fromCharCode(65 + optIndex)}. {opt}</span>
                  {showResults && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />}
                  {showResults && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
        {!showResults ? (
          <button
            onClick={checkResults}
            disabled={Object.keys(selections).length < questions.length}
            className={`px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-md
              ${Object.keys(selections).length < questions.length 
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
                : 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 hover:shadow-lg'}`}
          >
            Verificar Respuestas
          </button>
        ) : (
          <div className="flex items-center justify-between w-full bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className={`font-bold text-lg ${score === questions.length ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-slate-200'}`}>
              Resultado Final: {score} de {questions.length}
            </span>
            <button
              onClick={reset}
              className="px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:text-violet-600 hover:border-violet-300 font-medium transition-all"
            >
              Intentar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;