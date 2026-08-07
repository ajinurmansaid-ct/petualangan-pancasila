import React from 'react';
import { GameHistoryItem } from '../types';
import { Trophy, Calendar, Clock, Award } from 'lucide-react';

interface ResultsViewProps {
  history: GameHistoryItem[];
}

export const getPredicate = (accuracyPct: number): { title: string; colorClass: string } => {
  if (accuracyPct >= 90) return { title: '🌟 SANGAT BAIK', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  if (accuracyPct >= 80) return { title: '⭐ BAIK', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' };
  if (accuracyPct >= 70) return { title: '👍 CUKUP', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' };
  return { title: '💪 PERLU BERLATIH', colorClass: 'bg-rose-100 text-rose-800 border-rose-300' };
};

export const ResultsView: React.FC<ResultsViewProps> = ({ history }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white p-6 rounded-3xl shadow-xl border-4 border-amber-400">
        <div className="inline-flex items-center gap-1.5 bg-amber-400 text-red-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" /> REKAP PEMBELAJARAN
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
          📊 HASIL PERMAINAN & RIWAYAT SKOR
        </h1>
        <p className="text-xs sm:text-sm text-red-100 mt-1">
          Laporan peringkat, skor akhir, akurasi jawaban, dan predikat performa kelompok siswa di kelas.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-lg border-2 border-slate-200">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            🏆
          </div>
          <h2 className="font-extrabold text-xl text-slate-800">Belum Ada Riwayat Permainan</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Selesaikan minimal satu permainan Ular Tangga PPKn untuk melihat rekap statistik dan predikat hasil siswa di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item, hIdx) => (
            <div key={item.id} className="bg-white rounded-3xl p-5 shadow-lg border-2 border-slate-200 space-y-4">
              {/* Match Header info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-400 text-red-950 font-black flex items-center justify-center text-sm shadow-xs">
                    #{history.length - hIdx}
                  </span>
                  <div>
                    <h3 className="font-black text-base text-slate-900">
                      Juara: <span className="text-red-600">{item.winnerName}</span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                  {item.totalTeams} Kelompok Bertanding
                </span>
              </div>

              {/* Match Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 text-[10px] sm:text-xs font-black uppercase text-slate-600 border-b">
                    <tr>
                      <th className="p-2.5 text-center w-12">Peringkat</th>
                      <th className="p-2.5">Kelompok</th>
                      <th className="p-2.5 text-center">Skor</th>
                      <th className="p-2.5 text-center">Posisi</th>
                      <th className="p-2.5 text-center">Benar</th>
                      <th className="p-2.5 text-center">Salah</th>
                      <th className="p-2.5 text-center">Akurasi</th>
                      <th className="p-2.5 text-center">Predikat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-semibold">
                    {item.playersStats.map((p, idx) => {
                      const pred = getPredicate(p.accuracyPercentage);
                      return (
                        <tr key={idx} className={idx === 0 ? 'bg-amber-50/60 font-bold' : ''}>
                          <td className="p-2.5 text-center font-black text-slate-700">
                            {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `${idx + 1}`}
                          </td>
                          <td className="p-2.5 font-extrabold text-slate-900">{p.name}</td>
                          <td className="p-2.5 text-center font-black text-amber-600">{p.score}</td>
                          <td className="p-2.5 text-center">Kotak {p.position}</td>
                          <td className="p-2.5 text-center text-emerald-600 font-bold">{p.correctAnswers}</td>
                          <td className="p-2.5 text-center text-rose-600 font-bold">{p.wrongAnswers}</td>
                          <td className="p-2.5 text-center font-black">{p.accuracyPercentage}%</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black border ${pred.colorClass}`}>
                              {pred.title}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
