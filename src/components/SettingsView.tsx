import React, { useState } from 'react';
import { GameSettings } from '../types';
import { Settings, Volume2, VolumeX, Clock, Award, RotateCcw, Trash2, HelpCircle } from 'lucide-react';

interface SettingsViewProps {
  settings: GameSettings;
  onSaveSettings: (newSettings: GameSettings) => void;
  onResetAllData: () => void;
  onOpenQuestionBank: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetAllData,
  onOpenQuestionBank,
}) => {
  const [currentSettings, setCurrentSettings] = useState<GameSettings>({ ...settings });
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleTimerChange = (val: number) => {
    const updated = { ...currentSettings, timerSeconds: val };
    setCurrentSettings(updated);
    onSaveSettings(updated);
  };

  const handlePointsChange = (field: keyof GameSettings, val: number) => {
    const updated = { ...currentSettings, [field]: val };
    setCurrentSettings(updated);
    onSaveSettings(updated);
  };

  const handleToggle = (field: 'enableAudio' | 'enableSpecialSquares') => {
    const updated = { ...currentSettings, [field]: !currentSettings[field] };
    setCurrentSettings(updated);
    onSaveSettings(updated);
  };

  const handleConfirmReset = () => {
    onResetAllData();
    setShowResetConfirm(false);
    alert('Seluruh data game, bank soal, dan hasil telah di-reset ke data default.');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white p-6 rounded-3xl shadow-xl border-4 border-amber-400">
        <div className="inline-flex items-center gap-1.5 bg-amber-400 text-red-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" /> PENGATURAN KELAS
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
          ⚙️ MODE GURU & PENGATURAN ATURAN
        </h1>
        <p className="text-xs sm:text-sm text-red-100 mt-1">
          Atur timer menjawab, poin pertanyaan, bonus tangga, penalti ular, efek suara, dan kelola data pembelajaran.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Timer & Audio */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-slate-200 space-y-5">
          <div className="flex items-center gap-2 border-b pb-3">
            <Clock className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-slate-900">1. TIMER & AUDIO</h2>
          </div>

          {/* Timer Selector */}
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-2 uppercase">
              Waktu Menjawab Soal (Detik):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20, 30, 45, 60].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleTimerChange(s)}
                  className={`py-2 rounded-xl font-extrabold text-sm border-2 transition-all cursor-pointer ${
                    currentSettings.timerSeconds === s
                      ? 'bg-amber-400 border-amber-500 text-red-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ⏱️ {s} Detik
                </button>
              ))}
            </div>
          </div>

          {/* Audio Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="font-extrabold text-sm text-slate-900 block">Efek Suara (Audio)</span>
              <span className="text-xs text-slate-500 block">Suara dadu, tangga, ular, dan jawaban</span>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('enableAudio')}
              className={`p-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer ${
                currentSettings.enableAudio
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-300 text-slate-600'
              }`}
            >
              {currentSettings.enableAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span>{currentSettings.enableAudio ? 'AKTIF' : 'MATI'}</span>
            </button>
          </div>

          {/* Special Squares Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="font-extrabold text-sm text-slate-900 block">Kotak Khusus</span>
              <span className="text-xs text-slate-500 block">Aktifkan kotak ⭐ Bonus, ⚡ Double Point, 🎯 Tantangan</span>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('enableSpecialSquares')}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                currentSettings.enableSpecialSquares
                  ? 'bg-amber-400 text-red-950 border border-amber-500'
                  : 'bg-slate-300 text-slate-600'
              }`}
            >
              {currentSettings.enableSpecialSquares ? 'AKTIF' : 'NONAKTIF'}
            </button>
          </div>
        </div>

        {/* Section 2: Points Rules */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-slate-200 space-y-5">
          <div className="flex items-center gap-2 border-b pb-3">
            <Award className="w-5 h-5 text-amber-600" />
            <h2 className="font-extrabold text-lg text-slate-900">2. ATURAN POIN</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">
                Poin Jawaban Benar:
              </label>
              <input
                type="number"
                value={currentSettings.questionPoints}
                onChange={(e) => handlePointsChange('questionPoints', parseInt(e.target.value, 10) || 10)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">
                Bonus Poin Naik Tangga:
              </label>
              <input
                type="number"
                value={currentSettings.ladderPoints}
                onChange={(e) => handlePointsChange('ladderPoints', parseInt(e.target.value, 10) || 5)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">
                Penalti Poin Terkena Ular:
              </label>
              <input
                type="number"
                value={currentSettings.snakePenalty}
                onChange={(e) => handlePointsChange('snakePenalty', parseInt(e.target.value, 10) || 5)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">
                Bonus Streak (3 Jawaban Benar Beruntun):
              </label>
              <input
                type="number"
                value={currentSettings.streakBonus}
                onChange={(e) => handlePointsChange('streakBonus', parseInt(e.target.value, 10) || 10)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone / Reset Controls */}
      <div className="bg-rose-50 rounded-3xl p-5 border-2 border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-rose-900 text-base">🗑️ RESET SEMUA DATA APLIKASI</h3>
          <p className="text-xs text-rose-700 mt-0.5">
            Menghapus seluruh bank soal buatan, pengaturan, dan riwayat game, lalu mengembalikan soal default.
          </p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-5 py-3 rounded-2xl font-black text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-md cursor-pointer shrink-0"
        >
          RESET ALL DATA
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border-4 border-rose-500 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 text-3xl mx-auto">
              ⚠️
            </div>
            <h3 className="font-black text-xl text-slate-900">KONFIRMASI HAPUS SEMUA DATA</h3>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              Apakah Anda yakin? Seluruh bank soal buatan Anda, skor, dan riwayat permainan akan terhapus total dari browser ini.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-200 text-slate-800"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 rounded-xl font-extrabold text-xs bg-rose-600 text-white shadow-md"
              >
                YA, HAPUS SEMUA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
