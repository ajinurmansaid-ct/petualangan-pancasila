import React from 'react';
import { Volume2, VolumeX, Gamepad2, BookOpen, Settings, Trophy, HelpCircle, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'game' | 'questions' | 'settings' | 'results' | 'howToPlay';
  setActiveTab: (tab: 'game' | 'questions' | 'settings' | 'results' | 'howToPlay') => void;
  enableAudio: boolean;
  onToggleAudio: () => void;
  onResetGame?: () => void;
  isGameActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  enableAudio,
  onToggleAudio,
  onResetGame,
  isGameActive = false,
}) => {
  return (
    <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white shadow-lg sticky top-0 z-30 border-b-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('game')}>
            <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-red-900 font-extrabold text-2xl shadow-md border-2 border-white transform hover:scale-105 transition-transform">
              🐍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-amber-400 text-red-900 px-2 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
                  Multi-Mapel Edukasi
                </span>
                <span className="text-xs bg-red-900/60 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/40">
                  SD / SMP / SMA / MA
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight drop-shadow-md text-amber-300">
                ULAR TANGGA EDUKASI <span className="text-white text-lg font-medium italic">“Jelajah Nusantara”</span>
              </h1>
            </div>
          </div>

          {/* Navigation Buttons */}
          <nav className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'game'
                  ? 'bg-amber-400 text-red-950 shadow-md scale-105'
                  : 'bg-red-800/80 hover:bg-red-700 text-white hover:text-amber-200'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Permainan</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'questions'
                  ? 'bg-amber-400 text-red-950 shadow-md scale-105'
                  : 'bg-red-800/80 hover:bg-red-700 text-white hover:text-amber-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Bank Soal</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-red-950 shadow-md scale-105'
                  : 'bg-red-800/80 hover:bg-red-700 text-white hover:text-amber-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Mode Guru</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'results'
                  ? 'bg-amber-400 text-red-950 shadow-md scale-105'
                  : 'bg-red-800/80 hover:bg-red-700 text-white hover:text-amber-200'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Hasil</span>
            </button>

            <button
              onClick={() => setActiveTab('howToPlay')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'howToPlay'
                  ? 'bg-amber-400 text-red-950 shadow-md scale-105'
                  : 'bg-red-800/80 hover:bg-red-700 text-white hover:text-amber-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Cara Bermain</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleAudio}
              title={enableAudio ? 'Matikan Suara' : 'Aktifkan Suara'}
              className={`p-2 rounded-xl text-sm font-bold transition-all border ${
                enableAudio
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-500'
              }`}
            >
              {enableAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Quick Reset Game */}
            {isGameActive && onResetGame && (
              <button
                onClick={onResetGame}
                title="Reset Permainan Baru"
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-red-950 shadow-sm border border-amber-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden lg:inline">Ulang Game</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
