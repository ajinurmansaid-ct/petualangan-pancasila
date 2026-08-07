import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { TEAM_COLORS } from '../data/defaultData';
import { Dices, Play } from 'lucide-react';

interface DiceControlProps {
  activePlayer: Player;
  totalPlayers: number;
  activePlayerIndex: number;
  isRolling: boolean;
  isMoving: boolean;
  onRollDice: () => void;
  lastDiceValue: number | null;
  movementLog: string | null;
  isQuestionActive: boolean;
}

export const DiceControl: React.FC<DiceControlProps> = ({
  activePlayer,
  totalPlayers,
  activePlayerIndex,
  isRolling,
  isMoving,
  onRollDice,
  lastDiceValue,
  movementLog,
  isQuestionActive,
}) => {
  const [animatedDice, setAnimatedDice] = useState<number>(1);

  // Animate dice numbers during roll phase
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRolling) {
      interval = setInterval(() => {
        setAnimatedDice(Math.floor(Math.random() * 6) + 1);
      }, 70);
    } else if (lastDiceValue !== null) {
      setAnimatedDice(lastDiceValue);
    }
    return () => clearInterval(interval);
  }, [isRolling, lastDiceValue]);

  const activeColor = TEAM_COLORS[activePlayer.colorKey];
  const isDisabled = isRolling || isMoving || isQuestionActive;

  // Dice dots mapping for visual 3D dice display
  const renderDiceDots = (value: number) => {
    const dotsMap: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };

    const activeDots = dotsMap[value] || [4];

    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-12 h-12 p-1.5 bg-white rounded-xl shadow-inner border-2 border-slate-300">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((dotIndex) => (
          <div key={dotIndex} className="flex items-center justify-center">
            {activeDots.includes(dotIndex) && (
              <div className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-xs" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg border-2 border-slate-200 flex flex-col justify-between gap-4">
      {/* Current Turn Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black tracking-wider uppercase text-slate-500 flex items-center gap-1">
            🎯 GILIRAN SAAT INI
          </span>
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Giliran {activePlayerIndex + 1} dari {totalPlayers}
          </span>
        </div>

        {/* Active Team Card */}
        <div
          className={`p-3.5 rounded-xl border-2 flex items-center justify-between transition-all shadow-sm ${activeColor.badgeBg}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md ${activeColor.bgClass}`}
            >
              {activePlayer.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-extrabold text-base md:text-lg tracking-tight text-slate-900">
                {activePlayer.name}
              </h2>
              <p className="text-xs font-semibold opacity-80">
                Posisi: Kotak <span className="font-bold underline">{activePlayer.position}</span> dari 50
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 block">Skor</span>
            <span className="text-lg font-black text-slate-800">{activePlayer.score} Pts</span>
          </div>
        </div>
      </div>

      {/* Movement Log Display */}
      {movementLog && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-2.5 rounded-r-xl text-xs font-bold text-amber-900 animate-fade-in flex items-center gap-2">
          <span>🏃</span>
          <span>{movementLog}</span>
        </div>
      )}

      {/* Dice & Roll Section */}
      <div className="flex items-center justify-between gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        {/* Dice Visual */}
        <div className="flex items-center gap-3">
          {renderDiceDots(animatedDice)}
          <div>
            <span className="text-xs font-bold text-slate-500 block">Dadu</span>
            <span className="text-2xl font-black text-slate-900">
              {isRolling ? '...' : lastDiceValue ?? '-'}
            </span>
          </div>
        </div>

        {/* Roll Button */}
        <button
          onClick={onRollDice}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-black text-base md:text-lg shadow-lg border-b-4 transition-all transform active:translate-y-0.5 ${
            isDisabled
              ? 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 border-red-800 text-white shadow-red-200 hover:scale-102 cursor-pointer'
          }`}
        >
          <Dices className={`w-6 h-6 ${isRolling ? 'animate-spin' : ''}`} />
          <span>{isRolling ? 'MENGOKOK DADU...' : isMoving ? 'BERJALAN...' : '🎲 KOCOK DADU'}</span>
        </button>
      </div>
    </div>
  );
};
