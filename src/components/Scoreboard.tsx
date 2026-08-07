import React from 'react';
import { Player } from '../types';
import { TEAM_COLORS } from '../data/defaultData';
import { Trophy, Flame, CheckCircle, XCircle } from 'lucide-react';

interface ScoreboardProps {
  players: Player[];
  activePlayerIndex: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, activePlayerIndex }) => {
  // Sort players by score descending, then by position descending
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.position - a.position;
  });

  const getRankBadge = (rankIndex: number) => {
    if (rankIndex === 0) return <span className="text-lg">🥇</span>;
    if (rankIndex === 1) return <span className="text-lg">🥈</span>;
    if (rankIndex === 2) return <span className="text-lg">🥉</span>;
    return <span className="text-xs font-black text-slate-500">{rankIndex + 1}.</span>;
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-slate-200 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b pb-2.5">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="font-black text-base text-slate-900 tracking-tight">
            🏆 PAPAN SKOR KELOMPOK
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">{players.length} Kelompok</span>
      </div>

      <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {sortedPlayers.map((player) => {
          const originalIndex = players.findIndex((p) => p.id === player.id);
          const rankIndex = sortedPlayers.findIndex((p) => p.id === player.id);
          const colorCfg = TEAM_COLORS[player.colorKey];
          const isActive = originalIndex === activePlayerIndex;

          return (
            <div
              key={player.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isActive
                  ? 'border-amber-400 bg-amber-50/80 ring-2 ring-amber-300 shadow-md'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
              }`}
            >
              {/* Rank & Team Badge */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 text-center font-extrabold flex items-center justify-center">
                  {getRankBadge(rankIndex)}
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-xs ${colorCfg.bgClass}`}
                >
                  {player.name.charAt(0)}
                </div>

                <div className="truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-extrabold text-sm text-slate-900 truncate">
                      {player.name}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full uppercase shrink-0">
                        Giliran
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-slate-500 block">
                    Kotak <span className="font-bold text-slate-800">{player.position}</span>
                  </span>
                </div>
              </div>

              {/* Stats Column */}
              <div className="flex items-center gap-3 shrink-0 text-right">
                {/* Streak Badge */}
                {player.streak >= 2 && (
                  <div
                    title={`${player.streak} Jawaban Benar Beruntun (+10 Bonus)`}
                    className="flex items-center gap-0.5 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-xs font-extrabold border border-orange-300 animate-pulse"
                  >
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                    <span>{player.streak}</span>
                  </div>
                )}

                {/* Correct / Wrong Stats */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-0.5 text-emerald-600">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {player.correctAnswers}
                  </span>
                  <span className="flex items-center gap-0.5 text-rose-600">
                    <XCircle className="w-3.5 h-3.5" />
                    {player.wrongAnswers}
                  </span>
                </div>

                {/* Score */}
                <div className="min-w-[50px]">
                  <span className="text-base font-black text-slate-900 block">
                    {player.score}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    Poin
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
