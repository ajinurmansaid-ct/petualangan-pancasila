export type Difficulty = 'Mudah' | 'Sedang' | 'Sulit';

export type CorrectAnswerOption = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswerOption;
  category: string;
  difficulty: Difficulty;
  points: number;
  explanation: string;
}

export type TeamColorKey = 'garuda' | 'nusantara' | 'pancasila' | 'merahputih' | 'bhinneka' | 'indonesia';

export interface TeamColorConfig {
  key: TeamColorKey;
  defaultName: string;
  hex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeBg: string;
}

export interface Player {
  id: string;
  name: string;
  colorKey: TeamColorKey;
  position: number; // 1 to 50
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  isWinner?: boolean;
}

export interface Ladder {
  from: number;
  to: number;
}

export interface Snake {
  from: number;
  to: number;
}

export type SpecialSquareType = 'bonus' | 'double_point' | 'challenge' | 'bonus_question';

export interface SquareInfo {
  number: number;
  type: 'normal' | 'ladder' | 'snake' | 'question' | 'special' | 'finish';
  specialType?: SpecialSquareType;
  ladderTo?: number;
  snakeTo?: number;
}

export interface GameSettings {
  timerSeconds: number; // 10, 15, 20, 30, 45, 60
  questionPoints: number; // default 10
  ladderPoints: number; // default 5
  snakePenalty: number; // default 5
  streakBonus: number; // default 10
  enableAudio: boolean;
  enableSpecialSquares: boolean;
  selectedCategories: string[]; // [] means all
  selectedDifficulties: Difficulty[]; // [] means all
}

export interface GameHistoryItem {
  id: string;
  date: string;
  winnerName: string;
  durationSeconds: number;
  totalTeams: number;
  playersStats: {
    name: string;
    colorKey: TeamColorKey;
    score: number;
    position: number;
    correctAnswers: number;
    wrongAnswers: number;
    accuracyPercentage: number;
    predicate: string;
  }[];
}

export type GamePhase = 'setup' | 'playing' | 'question' | 'event' | 'finished';
