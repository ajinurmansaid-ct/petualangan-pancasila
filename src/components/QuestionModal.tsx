import React, { useState, useEffect } from 'react';
import { Question, Player, CorrectAnswerOption } from '../types';
import { TEAM_COLORS } from '../data/defaultData';
import { HelpCircle, Clock, CheckCircle2, XCircle, Award, Sparkles, ArrowRight } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  activePlayer: Player;
  timerSeconds: number;
  isDoublePoint?: boolean;
  isChallenge?: boolean;
  onAnswer: (isCorrect: boolean, pointsEarned: number, explanation: string) => void;
  onClose: () => void;
  enableAudio: boolean;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  activePlayer,
  timerSeconds,
  isDoublePoint = false,
  isChallenge = false,
  onAnswer,
  onClose,
  enableAudio,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timerSeconds);
  const [selectedOption, setSelectedOption] = useState<CorrectAnswerOption | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const basePoints = isChallenge ? question.points + 5 : question.points;
  const calculatedPoints = isDoublePoint ? basePoints * 2 : basePoints;
  const colorCfg = TEAM_COLORS[activePlayer.colorKey];

  // Timer countdown
  useEffect(() => {
    if (isAnswered) return;

    if (timeLeft <= 0) {
      // Time expired
      handleSelectOption(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleSelectOption = (option: CorrectAnswerOption | null) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option === question.correctAnswer;
    setIsCorrect(correct);

    const earned = correct ? calculatedPoints : 0;
    onAnswer(correct, earned, question.explanation);
  };

  const getOptionLabel = (key: CorrectAnswerOption) => {
    switch (key) {
      case 'A':
        return question.optionA;
      case 'B':
        return question.optionB;
      case 'C':
        return question.optionC;
      case 'D':
        return question.optionD;
    }
  };

  const progressPct = Math.max(0, (timeLeft / timerSeconds) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-amber-400 overflow-hidden flex flex-col transform transition-transform">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white p-4 sm:p-5 flex items-center justify-between border-b-4 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 text-red-950 font-black rounded-2xl flex items-center justify-center text-xl shadow-md">
              ❓
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold bg-amber-400 text-red-950 px-2 py-0.5 rounded-full uppercase">
                  SOAL PPKn
                </span>
                <span className="text-xs font-semibold bg-red-900/70 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  {question.category}
                </span>
                <span
                  className={`text-xs font-extrabold px-2 py-0.5 rounded-full text-white ${
                    question.difficulty === 'Mudah'
                      ? 'bg-emerald-600'
                      : question.difficulty === 'Sedang'
                      ? 'bg-amber-600'
                      : 'bg-rose-600'
                  }`}
                >
                  {question.difficulty}
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-1 font-medium">
                Giliran: <span className="font-extrabold text-white">{activePlayer.name}</span>
              </p>
            </div>
          </div>

          {/* Points & Special Badges */}
          <div className="flex flex-col items-end shrink-0">
            {isDoublePoint && (
              <span className="text-xs font-black bg-amber-400 text-red-950 px-2 py-0.5 rounded-full animate-bounce mb-1 flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> 2X DOUBLE POINT
              </span>
            )}
            <span className="text-lg font-black text-amber-300 flex items-center gap-1">
              <Award className="w-5 h-5" /> +{calculatedPoints} Poin
            </span>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-slate-200 h-3 relative">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft <= 5 ? 'bg-red-600 animate-pulse' : 'bg-amber-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Timer Display */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Clock className="w-4 h-4 text-amber-600" /> WAKTU MENJAWAB:
            </span>
            <span className={`text-base font-black ${timeLeft <= 5 ? 'text-red-600 font-extrabold' : 'text-slate-800'}`}>
              ⏱️ {timeLeft} DETIK
            </span>
          </div>

          {/* Question Text */}
          <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 shadow-inner">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
              {question.text}
            </h3>
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {(['A', 'B', 'C', 'D'] as CorrectAnswerOption[]).map((optionKey) => {
              const optionText = getOptionLabel(optionKey);
              if (!optionText) return null;

              const isSelected = selectedOption === optionKey;
              const isTargetCorrect = optionKey === question.correctAnswer;

              let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

              if (isAnswered) {
                if (isTargetCorrect) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400';
                } else if (isSelected && !isTargetCorrect) {
                  btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-400';
                } else {
                  btnStyle = 'bg-slate-100 opacity-50 border-slate-200 text-slate-500';
                }
              }

              return (
                <button
                  key={optionKey}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(optionKey)}
                  className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${btnStyle}`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 border ${
                      isAnswered && isTargetCorrect
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : isAnswered && isSelected && !isTargetCorrect
                        ? 'bg-rose-600 text-white border-rose-700'
                        : 'bg-white text-slate-800 border-slate-300 shadow-xs'
                    }`}
                  >
                    {optionKey}
                  </span>
                  <span className="text-base sm:text-lg font-semibold pt-0.5 flex-1 leading-snug">
                    {optionText}
                  </span>

                  {isAnswered && isTargetCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 self-center" />
                  )}
                  {isAnswered && isSelected && !isTargetCorrect && (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Section */}
          {isAnswered && (
            <div
              className={`p-4 rounded-2xl border-2 animate-fade-in space-y-2 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <span className="text-2xl">🎉</span>
                      <div>
                        <h4 className="font-extrabold text-lg text-emerald-800">
                          JAWABAN BENAR!
                        </h4>
                        <p className="text-xs font-bold text-emerald-700">
                          +{calculatedPoints} Poin ditambahkan ke {activePlayer.name}!
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">❌</span>
                      <div>
                        <h4 className="font-extrabold text-lg text-rose-800">
                          {timeLeft <= 0 ? '⏰ WAKTU HABIS!' : 'JAWABAN SALAH!'}
                        </h4>
                        <p className="text-xs font-bold text-rose-700">
                          Jawaban yang benar adalah pilihan{' '}
                          <span className="underline">{question.correctAnswer}</span>.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Explanation Text */}
              {question.explanation && (
                <div className="mt-2 pt-2 border-t border-slate-200/60 text-sm">
                  <span className="font-bold block mb-1">💡 Penjelasan Jawaban:</span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {isAnswered && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center gap-2 py-3 px-6 rounded-xl font-extrabold text-base bg-amber-500 hover:bg-amber-400 text-red-950 shadow-md border-b-4 border-amber-700 transition-all cursor-pointer"
            >
              <span>Lanjutkan Permainan</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
