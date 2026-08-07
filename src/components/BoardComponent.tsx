import React from 'react';
import { Player, Ladder, Snake } from '../types';
import { TEAM_COLORS, BONUS_SQUARES, DOUBLE_POINT_SQUARES, CHALLENGE_SQUARES } from '../data/defaultData';

interface BoardProps {
  players: Player[];
  activePlayerIndex: number;
  ladders: Ladder[];
  snakes: Snake[];
  enableSpecialSquares: boolean;
  movingPlayerId?: string | null;
}

// Convert square number N (1..100) to grid coordinates
export const getSquareCoords = (squareNum: number): { xPct: number; yPct: number; gridRow: number; gridCol: number } => {
  const zeroBased = Math.max(0, Math.min(99, squareNum - 1));
  const rowIndexFromBottom = Math.floor(zeroBased / 10); // 0 (1-10) to 9 (91-100)
  const isEvenRow = rowIndexFromBottom % 2 === 0;

  const colIndex = isEvenRow ? zeroBased % 10 : 9 - (zeroBased % 10); // 0..9
  const gridRow = 9 - rowIndexFromBottom; // 0 (top: 91-100) to 9 (bottom: 1-10)
  const gridCol = colIndex;

  return {
    xPct: (gridCol + 0.5) * 10,
    yPct: (gridRow + 0.5) * 10,
    gridRow,
    gridCol,
  };
};

export const BoardComponent: React.FC<BoardProps> = ({
  players,
  activePlayerIndex,
  ladders,
  snakes,
  enableSpecialSquares,
  movingPlayerId,
}) => {
  // Generate 100 squares in top-down display order (rows 9 down to 0)
  const rows: number[][] = [];
  for (let r = 9; r >= 0; r--) {
    const rowSquares: number[] = [];
    const isEvenRowFromBottom = r % 2 === 0;
    const startNum = r * 10 + 1;
    if (isEvenRowFromBottom) {
      for (let i = 0; i < 10; i++) rowSquares.push(startNum + i);
    } else {
      for (let i = 9; i >= 0; i--) rowSquares.push(startNum + i);
    }
    rows.push(rowSquares);
  }

  // Helper to determine square theme colors
  const getSquareBg = (num: number): string => {
    if (num === 100) return 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 font-black border-2 border-amber-600 shadow-inner';
    if (num === 1) return 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-900 font-bold border border-emerald-300';

    const isLadderStart = ladders.some((l) => l.from === num);
    const isSnakeHead = snakes.some((s) => s.from === num);

    if (isLadderStart) return 'bg-amber-50/90 text-amber-900 border-amber-300';
    if (isSnakeHead) return 'bg-rose-50/90 text-rose-900 border-rose-300';

    if (enableSpecialSquares) {
      if (BONUS_SQUARES.includes(num)) return 'bg-yellow-50 text-amber-900 border-yellow-300';
      if (DOUBLE_POINT_SQUARES.includes(num)) return 'bg-blue-50 text-blue-900 border-blue-300';
      if (CHALLENGE_SQUARES.includes(num)) return 'bg-purple-50 text-purple-900 border-purple-300';
    }

    // Alternating chess-like light tones
    const { gridRow, gridCol } = getSquareCoords(num);
    return (gridRow + gridCol) % 2 === 0
      ? 'bg-slate-50 text-slate-800 border-slate-200'
      : 'bg-red-50/40 text-slate-800 border-slate-200';
  };

  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-amber-50 via-red-50 to-amber-100 rounded-2xl p-1.5 sm:p-2.5 shadow-2xl border-4 border-amber-500 overflow-hidden select-none">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#b91c1c_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Grid Container (10x10) */}
      <div className="relative w-full h-full grid grid-rows-10 grid-cols-10 gap-0.5 sm:gap-1">
        {rows.map((rowSquares) =>
          rowSquares.map((num) => {
            const ladderInfo = ladders.find((l) => l.from === num);
            const snakeInfo = snakes.find((s) => s.from === num);
            const isBonus = enableSpecialSquares && BONUS_SQUARES.includes(num);
            const isDouble = enableSpecialSquares && DOUBLE_POINT_SQUARES.includes(num);
            const isChallenge = enableSpecialSquares && CHALLENGE_SQUARES.includes(num);

            return (
              <div
                key={`sq-${num}`}
                className={`relative rounded-lg sm:rounded-xl flex flex-col justify-between p-0.5 sm:p-1 transition-all shadow-xs overflow-hidden ${getSquareBg(
                  num
                )}`}
              >
                {/* Square Number */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[9px] sm:text-xs md:text-sm font-black px-0.5 rounded-xs ${
                      num === 100 ? 'bg-amber-900 text-amber-200' : 'text-slate-700'
                    }`}
                  >
                    {num}
                  </span>

                  {/* Badges / Icons */}
                  <div className="text-[10px] sm:text-xs font-bold flex items-center gap-0.5">
                    {num === 100 && <span title="Finish">🏆</span>}
                    {num === 1 && <span className="text-[8px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-200 px-0.5 rounded">START</span>}
                    {ladderInfo && <span title={`Naik ke ${ladderInfo.to}`}>🪜</span>}
                    {snakeInfo && <span title={`Turun ke ${snakeInfo.to}`}>🐍</span>}
                    {isBonus && <span title="Bonus +10 Poin">⭐</span>}
                    {isDouble && <span title="2x Poin Soal">⚡</span>}
                    {isChallenge && <span title="Soal Tantangan">🎯</span>}
                  </div>
                </div>

                {/* Question Icon on non-special squares for visual clarity */}
                {!ladderInfo && !snakeInfo && !isBonus && !isDouble && !isChallenge && num !== 1 && num !== 100 && num % 2 === 0 && (
                  <div className="absolute bottom-0.5 right-0.5 opacity-20 text-[9px] sm:text-xs">❓</div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* SVG Overlay layer for Ladders and Snakes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          {/* Snake gradient */}
          <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Ladder wood pattern */}
          <linearGradient id="ladderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Render Ladders */}
        {ladders.map((ladder, idx) => {
          const start = getSquareCoords(ladder.from);
          const end = getSquareCoords(ladder.to);

          const x1 = `${start.xPct}%`;
          const y1 = `${start.yPct}%`;
          const x2 = `${end.xPct}%`;
          const y2 = `${end.yPct}%`;

          // Calculate parallel rails for ladder width
          const dx = end.xPct - start.xPct;
          const dy = end.yPct - start.yPct;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = (-dy / len) * 1.8; // rail offset %
          const ny = (dx / len) * 1.8;

          const rail1X1 = start.xPct + nx;
          const rail1Y1 = start.yPct + ny;
          const rail1X2 = end.xPct + nx;
          const rail1Y2 = end.yPct + ny;

          const rail2X1 = start.xPct - nx;
          const rail2Y1 = start.yPct - ny;
          const rail2X2 = end.xPct - nx;
          const rail2Y2 = end.yPct - ny;

          // Calculate rungs along ladder
          const numRungs = Math.max(3, Math.floor(len / 6));
          const rungs = [];
          for (let i = 1; i <= numRungs; i++) {
            const t = i / (numRungs + 1);
            const rx1 = rail1X1 + t * (rail1X2 - rail1X1);
            const ry1 = rail1Y1 + t * (rail1Y2 - rail1Y1);
            const rx2 = rail2X1 + t * (rail2X2 - rail2X1);
            const ry2 = rail2Y1 + t * (rail2Y2 - rail2Y1);
            rungs.push({ x1: `${rx1}%`, y1: `${ry1}%`, x2: `${rx2}%`, y2: `${ry2}%` });
          }

          return (
            <g key={`ladder-${idx}`} filter="url(#dropShadow)" opacity="0.9">
              {/* Left Rail */}
              <line
                x1={`${rail1X1}%`}
                y1={`${rail1Y1}%`}
                x2={`${rail1X2}%`}
                y2={`${rail1Y2}%`}
                stroke="url(#ladderGradient)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Right Rail */}
              <line
                x1={`${rail2X1}%`}
                y1={`${rail2Y1}%`}
                x2={`${rail2X2}%`}
                y2={`${rail2Y2}%`}
                stroke="url(#ladderGradient)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Rungs */}
              {rungs.map((r, rIdx) => (
                <line
                  key={`rung-${idx}-${rIdx}`}
                  x1={r.x1}
                  y1={r.y1}
                  x2={r.x2}
                  y2={r.y2}
                  stroke="#fef3c7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              ))}
            </g>
          );
        })}

        {/* Render Snakes */}
        {snakes.map((snake, idx) => {
          const head = getSquareCoords(snake.from);
          const tail = getSquareCoords(snake.to);

          // Create wavy snake curve path
          const midX = (head.xPct + tail.xPct) / 2 + (idx % 2 === 0 ? 8 : -8);
          const midY = (head.yPct + tail.yPct) / 2 + (idx % 2 === 0 ? -5 : 5);

          const pathD = `M ${head.xPct} ${head.yPct} Q ${midX} ${midY} ${tail.xPct} ${tail.yPct}`;

          return (
            <g key={`snake-${idx}`} filter="url(#dropShadow)">
              {/* Snake Body Outer Glow */}
              <path
                d={pathD}
                fill="none"
                stroke="#450a0a"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.3"
              />
              {/* Snake Body */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#snakeGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="8 4"
              />
              {/* Snake Head Dot/Icon */}
              <circle cx={`${head.xPct}%`} cy={`${head.yPct}%`} r="10" fill="#991b1b" stroke="#fef2f2" strokeWidth="2" />
              <text x={`${head.xPct}%`} y={`${head.yPct}%`} textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#ffffff">
                🐍
              </text>
            </g>
          );
        })}
      </svg>

      {/* Render Player Tokens Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {players.map((player, pIdx) => {
          const coords = getSquareCoords(player.position);
          const colorCfg = TEAM_COLORS[player.colorKey];
          const isActive = pIdx === activePlayerIndex;
          const isMoving = player.id === movingPlayerId;

          // Offset tokens slightly if multiple players occupy the exact same square
          const sameSquarePlayers = players.filter((p) => p.position === player.position);
          const playerOffsetIndex = sameSquarePlayers.findIndex((p) => p.id === player.id);
          const totalInSquare = sameSquarePlayers.length;

          // Offset offsets in %
          let offsetX = 0;
          let offsetY = 0;
          if (totalInSquare > 1) {
            const angle = (playerOffsetIndex / totalInSquare) * Math.PI * 2;
            offsetX = Math.cos(angle) * 1.8;
            offsetY = Math.sin(angle) * 1.8;
          }

          return (
            <div
              key={`token-${player.id}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
              style={{
                left: `${coords.xPct + offsetX}%`,
                top: `${coords.yPct + offsetY}%`,
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Active Indicator Arrow */}
                {isActive && (
                  <div className="animate-bounce mb-1 text-amber-500 font-black text-sm drop-shadow-md">
                    ▼
                  </div>
                )}

                {/* Token Circle */}
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-extrabold text-white text-xs sm:text-sm border-2 border-white shadow-xl ${
                    colorCfg.bgClass
                  } ${isActive ? 'ring-4 ring-amber-400 scale-110' : ''} ${
                    isMoving ? 'animate-pulse scale-125' : ''
                  }`}
                >
                  {player.name.charAt(0) || pIdx + 1}
                </div>

                {/* Player Name Badge */}
                <div
                  className={`mt-0.5 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold whitespace-nowrap shadow-md border ${
                    colorCfg.badgeBg
                  }`}
                >
                  {player.name.replace('Kelompok ', '')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
