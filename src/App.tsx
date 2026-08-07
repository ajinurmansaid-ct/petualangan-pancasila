import React, { useState, useEffect, useRef } from 'react';
import {
  Player,
  Question,
  GameSettings,
  GameHistoryItem,
  Ladder,
  Snake,
} from './types';
import {
  LADDERS,
  SNAKES,
  BONUS_SQUARES,
  DOUBLE_POINT_SQUARES,
  CHALLENGE_SQUARES,
} from './data/defaultData';
import {
  loadQuestions,
  saveQuestions,
  loadSettings,
  saveSettings,
  loadGameHistory,
  saveGameHistoryItem,
  resetAllDataToDefault,
} from './utils/storage';
import { soundFx } from './utils/audio';

import { Navbar } from './components/Navbar';
import { BoardComponent } from './components/BoardComponent';
import { DiceControl } from './components/DiceControl';
import { Scoreboard } from './components/Scoreboard';
import { QuestionModal } from './components/QuestionModal';
import { EventModal, EventType } from './components/EventModal';
import { VictoryModal } from './components/VictoryModal';
import { PreGameSetupModal } from './components/PreGameSetupModal';
import { QuestionBankView } from './components/QuestionBankView';
import { SettingsView } from './components/SettingsView';
import { ResultsView } from './components/ResultsView';
import { HowToPlayView } from './components/HowToPlayView';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<
    'game' | 'questions' | 'settings' | 'results' | 'howToPlay'
  >('game');

  // Persistent State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [settings, setSettings] = useState<GameSettings>(loadSettings());
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);

  // Active Game State
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [activeQuestionBank, setActiveQuestionBank] = useState<Question[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());

  // Turn Action & Animation State
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [lastDiceValue, setLastDiceValue] = useState<number | null>(null);
  const [movementLog, setMovementLog] = useState<string | null>(null);
  const [movingPlayerId, setMovingPlayerId] = useState<string | null>(null);

  // Active Modals State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isDoublePointActive, setIsDoublePointActive] = useState<boolean>(false);
  const [isChallengeActive, setIsChallengeActive] = useState<boolean>(false);

  const [eventModalData, setEventModalData] = useState<{
    type: EventType;
    title: string;
    message: string;
    fromSquare?: number;
    toSquare?: number;
    pointsDelta?: number;
  } | null>(null);

  const [winner, setWinner] = useState<Player | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [gameDurationSeconds, setGameDurationSeconds] = useState<number>(0);

  // Load initial data on mount
  useEffect(() => {
    setQuestions(loadQuestions());
    setSettings(loadSettings());
    setGameHistory(loadGameHistory());
  }, []);

  // Update questions handler
  const handleSaveQuestions = (updated: Question[]) => {
    setQuestions(updated);
    saveQuestions(updated);
  };

  // Update settings handler
  const handleSaveSettings = (updated: GameSettings) => {
    setSettings(updated);
    saveSettings(updated);
  };

  // Reset all data
  const handleResetAllData = () => {
    resetAllDataToDefault();
    setQuestions(loadQuestions());
    setSettings(loadSettings());
    setGameHistory(loadGameHistory());
    setIsGameActive(false);
  };

  // Start a new game session
  const handleStartGame = (initialPlayers: Player[], filteredQuestions: Question[]) => {
    setPlayers(initialPlayers);
    setActivePlayerIndex(0);
    setActiveQuestionBank(filteredQuestions);
    setUsedQuestionIds(new Set());
    setIsGameActive(true);
    setWinner(null);
    setLastDiceValue(null);
    setMovementLog(null);
    setGameStartTime(Date.now());
    setActiveTab('game');
  };

  // Pick next unused question from bank
  const getNextQuestion = (): Question | null => {
    if (activeQuestionBank.length === 0) return null;

    const available = activeQuestionBank.filter((q) => !usedQuestionIds.has(q.id));
    if (available.length === 0) {
      // All questions used once, reset pool
      setUsedQuestionIds(new Set());
      const randomIndex = Math.floor(Math.random() * activeQuestionBank.length);
      return activeQuestionBank[randomIndex];
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const selected = available[randomIndex];
    setUsedQuestionIds((prev) => new Set(prev).add(selected.id));
    return selected;
  };

  // Advance turn to next player
  const advanceTurn = () => {
    setActivePlayerIndex((prev) => (prev + 1) % players.length);
    setIsDoublePointActive(false);
    setIsChallengeActive(false);
  };

  // Roll Dice & Move Token
  const handleRollDice = () => {
    if (isRolling || isMoving || !isGameActive || players.length === 0) return;

    setIsRolling(true);
    setMovementLog(null);
    soundFx.playDiceRoll(settings.enableAudio);

    // Dice animation delay
    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      setLastDiceValue(dice);
      setIsRolling(false);

      const activePlayer = players[activePlayerIndex];
      const currentPos = activePlayer.position;
      const targetPos = currentPos + dice;

      // Check Exact 50 Finish Condition
      if (targetPos > 50) {
        soundFx.playWrong(settings.enableAudio);
        setEventModalData({
          type: 'over_roll',
          title: '⚠️ ANGKA DADU MELEBIHI 50!',
          message: `Angka dadu ${dice} terlalu besar untuk mencapai FINISH (kotak 50). ${activePlayer.name} tetap berada di kotak ${currentPos}.`,
        });
        setMovementLog(`Dadu: ${dice} (melebihi 50) → Tetap di Kotak ${currentPos}`);
        return;
      }

      // Start Step-by-Step movement
      setIsMoving(true);
      setMovingPlayerId(activePlayer.id);

      let step = currentPos;
      const stepInterval = setInterval(() => {
        step++;
        soundFx.playMoveStep(settings.enableAudio);

        setPlayers((prev) =>
          prev.map((p, idx) => (idx === activePlayerIndex ? { ...p, position: step } : p))
        );

        setMovementLog(`Bergerak ke Kotak ${step}...`);

        if (step >= targetPos) {
          clearInterval(stepInterval);
          setIsMoving(false);
          setMovingPlayerId(null);

          // Handle landing on target square
          handleSquareLanding(targetPos);
        }
      }, 300);
    }, 800);
  };

  // Handle landing on destination square
  const handleSquareLanding = (landSquare: number) => {
    const activePlayer = players[activePlayerIndex];

    // 1. Check Finish (Square 50)
    if (landSquare === 50) {
      handleWin(activePlayer);
      return;
    }

    // 2. Check Ladder
    const ladder = LADDERS.find((l) => l.from === landSquare);
    if (ladder) {
      setTimeout(() => {
        soundFx.playLadder(settings.enableAudio);
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex
              ? {
                  ...p,
                  position: ladder.to,
                  score: p.score + settings.ladderPoints,
                }
              : p
          )
        );

        setEventModalData({
          type: 'ladder',
          title: '🪜 NAIK TANGGA!',
          message: `Hebat! ${activePlayer.name} menemukan tangga dari kotak ${ladder.from} meluncur NAIK ke kotak ${ladder.to}!`,
          fromSquare: ladder.from,
          toSquare: ladder.to,
          pointsDelta: settings.ladderPoints,
        });

        // Check if ladder directly reached 50
        if (ladder.to === 50) {
          handleWin({ ...activePlayer, position: 50 });
        }
      }, 300);
      return;
    }

    // 3. Check Snake
    const snake = SNAKES.find((s) => s.from === landSquare);
    if (snake) {
      setTimeout(() => {
        soundFx.playSnake(settings.enableAudio);
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex
              ? {
                  ...p,
                  position: snake.to,
                  score: Math.max(0, p.score - settings.snakePenalty),
                }
              : p
          )
        );

        setEventModalData({
          type: 'snake',
          title: '🐍 TERKENA ULAR!',
          message: `Ups! ${activePlayer.name} digigit ular di kotak ${snake.from} dan harus TURUN ke kotak ${snake.to}.`,
          fromSquare: snake.from,
          toSquare: snake.to,
          pointsDelta: -settings.snakePenalty,
        });
      }, 300);
      return;
    }

    // 4. Check Special Squares
    let isDouble = false;
    let isChallenge = false;

    if (settings.enableSpecialSquares) {
      if (BONUS_SQUARES.includes(landSquare)) {
        soundFx.playCorrect(settings.enableAudio);
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex ? { ...p, score: p.score + 10 } : p
          )
        );
        setEventModalData({
          type: 'bonus',
          title: '⭐ KOTAK BONUS!',
          message: `Selamat! ${activePlayer.name} mendarat di Kotak Bonus dan mendapatkan +10 Poin tambahan!`,
          pointsDelta: 10,
        });
        return;
      }

      if (DOUBLE_POINT_SQUARES.includes(landSquare)) {
        isDouble = true;
        setIsDoublePointActive(true);
      }

      if (CHALLENGE_SQUARES.includes(landSquare)) {
        isChallenge = true;
        setIsChallengeActive(true);
      }
    }

    // 5. Trigger Question Modal
    triggerQuestionModal(isDouble, isChallenge);
  };

  // Trigger Question
  const triggerQuestionModal = (isDouble: boolean = false, isChallenge: boolean = false) => {
    const question = getNextQuestion();
    if (!question) {
      // Fallback if no questions available
      advanceTurn();
      return;
    }
    setCurrentQuestion(question);
  };

  // Handle Question Answer Submission
  const handleAnswerSubmit = (
    isCorrect: boolean,
    pointsEarned: number,
    explanation: string
  ) => {
    const activePlayer = players[activePlayerIndex];

    if (isCorrect) {
      soundFx.playCorrect(settings.enableAudio);
    } else {
      soundFx.playWrong(settings.enableAudio);
    }

    setPlayers((prev) =>
      prev.map((p, idx) => {
        if (idx !== activePlayerIndex) return p;

        const newStreak = isCorrect ? p.streak + 1 : 0;
        let bonusStreakPoints = 0;

        // Check 3-in-a-row streak bonus
        if (newStreak > 0 && newStreak % 3 === 0) {
          bonusStreakPoints = settings.streakBonus;
          soundFx.playVictory(settings.enableAudio);
        }

        return {
          ...p,
          score: p.score + pointsEarned + bonusStreakPoints,
          correctAnswers: p.correctAnswers + (isCorrect ? 1 : 0),
          wrongAnswers: p.wrongAnswers + (isCorrect ? 0 : 1),
          streak: newStreak,
        };
      })
    );
  };

  // Handle Close Question Modal
  const handleCloseQuestionModal = () => {
    setCurrentQuestion(null);
    advanceTurn();
  };

  // Handle Close Event Modal
  const handleCloseEventModal = () => {
    const wasOverRoll = eventModalData?.type === 'over_roll';
    setEventModalData(null);

    if (wasOverRoll) {
      advanceTurn();
    } else {
      // Trigger question after ladder/snake landing
      const activePlayer = players[activePlayerIndex];
      if (activePlayer && activePlayer.position < 50) {
        triggerQuestionModal(false, false);
      } else {
        advanceTurn();
      }
    }
  };

  // Handle Win Condition
  const handleWin = (winnerPlayer: Player) => {
    soundFx.playVictory(settings.enableAudio);
    const durationSec = Math.floor((Date.now() - gameStartTime) / 1000);
    setGameDurationSeconds(durationSec);

    const updatedWinner = { ...winnerPlayer, position: 50, isWinner: true };
    setWinner(updatedWinner);

    // Save Game History Item
    const historyItem: GameHistoryItem = {
      id: `game_${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      winnerName: updatedWinner.name,
      durationSeconds: durationSec,
      totalTeams: players.length,
      playersStats: players
        .map((p) => (p.id === updatedWinner.id ? updatedWinner : p))
        .map((p) => {
          const totalAns = p.correctAnswers + p.wrongAnswers;
          const accPct = totalAns > 0 ? Math.round((p.correctAnswers / totalAns) * 100) : 0;
          let pred = 'CUKUP';
          if (accPct >= 90) pred = 'SANGAT BAIK';
          else if (accPct >= 80) pred = 'BAIK';
          else if (accPct < 70) pred = 'PERLU BERLATIH';

          return {
            name: p.name,
            colorKey: p.colorKey,
            score: p.score,
            position: p.position,
            correctAnswers: p.correctAnswers,
            wrongAnswers: p.wrongAnswers,
            accuracyPercentage: accPct,
            predicate: pred,
          };
        }),
    };

    saveGameHistoryItem(historyItem);
    setGameHistory(loadGameHistory());
  };

  const activePlayer = players[activePlayerIndex] || players[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-300">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        enableAudio={settings.enableAudio}
        onToggleAudio={() =>
          handleSaveSettings({ ...settings, enableAudio: !settings.enableAudio })
        }
        onResetGame={() => setIsGameActive(false)}
        isGameActive={isGameActive}
      />

      {/* Main View Container */}
      <main className="flex-1 py-4 sm:py-6 px-2 sm:px-4 lg:px-6">
        {/* TAB 1: PERMAINAN (GAME) */}
        {activeTab === 'game' && (
          <div>
            {!isGameActive ? (
              /* Pre-Game Player & Question Setup */
              <PreGameSetupModal
                questions={questions}
                settings={settings}
                onStartGame={handleStartGame}
                onOpenQuestionBank={() => setActiveTab('questions')}
              />
            ) : (
              /* Playing Mode Desktop/Mobile Layout */
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Side: 50-Square Board (7 cols on desktop) */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <BoardComponent
                    players={players}
                    activePlayerIndex={activePlayerIndex}
                    ladders={LADDERS}
                    snakes={SNAKES}
                    enableSpecialSquares={settings.enableSpecialSquares}
                    movingPlayerId={movingPlayerId}
                  />
                </div>

                {/* Right Side: Dice Control & Live Scoreboard (4 cols on desktop) */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <DiceControl
                    activePlayer={activePlayer}
                    totalPlayers={players.length}
                    activePlayerIndex={activePlayerIndex}
                    isRolling={isRolling}
                    isMoving={isMoving}
                    onRollDice={handleRollDice}
                    lastDiceValue={lastDiceValue}
                    movementLog={movementLog}
                    isQuestionActive={!!currentQuestion || !!eventModalData}
                  />

                  <Scoreboard players={players} activePlayerIndex={activePlayerIndex} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BANK SOAL */}
        {activeTab === 'questions' && (
          <QuestionBankView
            questions={questions}
            onSaveQuestions={handleSaveQuestions}
          />
        )}

        {/* TAB 3: MODE GURU (SETTINGS) */}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onResetAllData={handleResetAllData}
            onOpenQuestionBank={() => setActiveTab('questions')}
          />
        )}

        {/* TAB 4: HASIL PERMAINAN */}
        {activeTab === 'results' && <ResultsView history={gameHistory} />}

        {/* TAB 5: CARA BERMAIN */}
        {activeTab === 'howToPlay' && <HowToPlayView />}
      </main>

      {/* QUESTION MODAL POPUP */}
      {currentQuestion && activePlayer && (
        <QuestionModal
          question={currentQuestion}
          activePlayer={activePlayer}
          timerSeconds={settings.timerSeconds}
          isDoublePoint={isDoublePointActive}
          isChallenge={isChallengeActive}
          onAnswer={handleAnswerSubmit}
          onClose={handleCloseQuestionModal}
          enableAudio={settings.enableAudio}
        />
      )}

      {/* EVENT ANNOUNCEMENT MODAL (Ladder / Snake / Bonus / Over Roll) */}
      {eventModalData && (
        <EventModal
          type={eventModalData.type}
          title={eventModalData.title}
          message={eventModalData.message}
          fromSquare={eventModalData.fromSquare}
          toSquare={eventModalData.toSquare}
          pointsDelta={eventModalData.pointsDelta}
          onClose={handleCloseEventModal}
        />
      )}

      {/* VICTORY CELEBRATION MODAL */}
      {winner && (
        <VictoryModal
          winner={winner}
          players={players}
          durationSeconds={gameDurationSeconds}
          onPlayAgain={() => {
            setWinner(null);
            setIsGameActive(false);
          }}
          onViewResults={() => {
            setWinner(null);
            setActiveTab('results');
          }}
          onBackToMenu={() => {
            setWinner(null);
            setIsGameActive(false);
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-3 text-center text-xs border-t border-slate-800">
        <p className="font-semibold">
          🎓 Ular Tangga PPKn “Jelajah Pancasila” — Game Pembelajaran Interaktif Kelas SMP/MA
        </p>
      </footer>
    </div>
  );
}
