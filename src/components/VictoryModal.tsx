import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../types';
import { TEAM_COLORS } from '../data/defaultData';
import { Trophy, RefreshCw, BarChart2, Home, CheckCircle2, XCircle, Clock, Target } from 'lucide-react';

interface VictoryModalProps {
  winner: Player;
  players: Player[];
  durationSeconds: number;
  onPlayAgain: () => void;
  onViewResults: () => void;
  onBackToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  players,
  durationSeconds,
  onPlayAgain,
  onViewResults,
  onBackToMenu,
}) => {
  const colorCfg = TEAM_COLORS[winner.colorKey];

  // Trigger confetti burst on load
  useEffect(() => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const totalAnswered = winner.correctAnswers + winner.wrongAnswers;
  const accuracyPct = totalAnswered > 0 ? Math.round((winner.correctAnswers / totalAnswered) * 100) : 0;

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const durationText = minutes > 0 ? `${minutes} menit ${seconds} detik` : `${seconds} detik`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border-4 border-amber-400 overflow-hidden flex flex-col transform transition-transform">
        {/* Victory Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 p-6 text-center border-b-4 border-amber-600 text-amber-950 flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-5xl shadow-xl border-4 border-white animate-bounce">
            🏆
          </div>
          <span className="text-sm font-black tracking-widest uppercase bg-amber-900 text-amber-100 px-3 py-0.5 rounded-full shadow-xs">
            JUARA ULAR TANGGA PPKn
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-amber-950 drop-shadow-xs">
            SELAMAT!
          </h1>
          <h2 className="text-xl md:text-2xl font-extrabold text-red-900">
            {winner.name} MENANG!
          </h2>
        </div>

        {/* Stats Summary Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 block">Posisi Akhir</span>
              <span className="text-xl font-black text-slate-900">Kotak 50 🏆</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 block">Total Skor</span>
              <span className="text-xl font-black text-amber-600">{winner.score} Pts</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-slate-500 block">Akurasi Jawaban</span>
              <span className="text-xl font-black text-emerald-600">{accuracyPct}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-100 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Jawaban Benar</span>
                <span className="text-base font-black text-slate-900">{winner.correctAnswers}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Jawaban Salah</span>
                <span className="text-base font-black text-slate-900">{winner.wrongAnswers}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Waktu Bermain</span>
                <span className="text-xs font-extrabold text-slate-900 leading-tight">{durationText}</span>
              </div>
            </div>
          </div>

          {/* Quick Final Leaderboard */}
          <div className="border-t pt-3">
            <span className="text-xs font-extrabold text-slate-500 block mb-2 uppercase tracking-wider">
              Peringkat Akhir Kelompok
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {[...players]
                .sort((a, b) => b.score - a.score)
                .map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-xs font-extrabold p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <span>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}</span>
                      <span className="text-slate-900">{p.name}</span>
                    </span>
                    <span className="text-slate-700">{p.score} Pts (Kotak {p.position})</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={onPlayAgain}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-md border-b-4 border-red-800 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>MAIN LAGI</span>
          </button>

          <button
            onClick={onViewResults}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-extrabold text-sm bg-slate-800 hover:bg-slate-700 text-white shadow-md border-b-4 border-slate-950 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BarChart2 className="w-4 h-4" />
            <span>HASIL PERMAINAN</span>
          </button>

          <button
            onClick={onBackToMenu}
            className="w-full sm:w-auto py-3 px-4 rounded-xl font-extrabold text-sm bg-slate-200 hover:bg-slate-300 text-slate-800 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
