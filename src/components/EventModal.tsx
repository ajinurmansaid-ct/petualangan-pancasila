import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export type EventType = 'ladder' | 'snake' | 'bonus' | 'double' | 'challenge' | 'over_roll';

interface EventModalProps {
  type: EventType;
  title: string;
  message: string;
  fromSquare?: number;
  toSquare?: number;
  pointsDelta?: number;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  type,
  title,
  message,
  fromSquare,
  toSquare,
  pointsDelta,
  onClose,
}) => {
  const getConfig = () => {
    switch (type) {
      case 'ladder':
        return {
          bg: 'bg-emerald-600',
          border: 'border-emerald-400',
          icon: '🪜',
          textBg: 'bg-emerald-50 text-emerald-950',
          btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950',
        };
      case 'snake':
        return {
          bg: 'bg-rose-600',
          border: 'border-rose-400',
          icon: '🐍',
          textBg: 'bg-rose-50 text-rose-950',
          btnBg: 'bg-rose-500 hover:bg-rose-400 text-white',
        };
      case 'bonus':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-300',
          icon: '⭐',
          textBg: 'bg-amber-50 text-amber-950',
          btnBg: 'bg-amber-500 hover:bg-amber-400 text-amber-950',
        };
      case 'double':
        return {
          bg: 'bg-blue-600',
          border: 'border-blue-400',
          icon: '⚡',
          textBg: 'bg-blue-50 text-blue-950',
          btnBg: 'bg-blue-500 hover:bg-blue-400 text-white',
        };
      case 'challenge':
        return {
          bg: 'bg-purple-600',
          border: 'border-purple-400',
          icon: '🎯',
          textBg: 'bg-purple-50 text-purple-950',
          btnBg: 'bg-purple-500 hover:bg-purple-400 text-white',
        };
      case 'over_roll':
      default:
        return {
          bg: 'bg-slate-700',
          border: 'border-slate-500',
          icon: '⚠️',
          textBg: 'bg-slate-100 text-slate-900',
          btnBg: 'bg-slate-800 hover:bg-slate-700 text-white',
        };
    }
  };

  const cfg = getConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 ${cfg.border} overflow-hidden transform transition-all`}>
        {/* Header */}
        <div className={`${cfg.bg} text-white p-5 text-center flex flex-col items-center justify-center gap-2`}>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl shadow-inner border border-white/30">
            {cfg.icon}
          </div>
          <h2 className="text-2xl font-black tracking-tight">{title}</h2>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-4">
          <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
            {message}
          </p>

          {/* Square Transition Indicator */}
          {fromSquare !== undefined && toSquare !== undefined && (
            <div className="flex items-center justify-center gap-4 bg-slate-100 p-3 rounded-2xl border border-slate-200">
              <span className="text-xl font-black text-slate-700">Kotak {fromSquare}</span>
              <ArrowRight className="w-6 h-6 text-slate-400 animate-pulse" />
              <span className="text-2xl font-black text-amber-600">Kotak {toSquare}</span>
            </div>
          )}

          {/* Points Delta Tag */}
          {pointsDelta !== undefined && pointsDelta !== 0 && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-black text-sm bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{pointsDelta > 0 ? `+${pointsDelta} Poin Bonus` : `${pointsDelta} Poin Penalti`}</span>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center">
          <button
            onClick={onClose}
            className={`w-full py-3 px-6 rounded-2xl font-extrabold text-base shadow-md transition-all cursor-pointer ${cfg.btnBg}`}
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};
