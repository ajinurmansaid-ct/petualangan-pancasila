import React, { useState } from 'react';
import { Player, TeamColorKey, GameSettings, Question } from '../types';
import { TEAM_COLORS, CATEGORIES_LIST, CLASSES_LIST, SUBJECTS_LIST } from '../data/defaultData';
import { Users, Filter, Play, CheckCircle2, GraduationCap, BookOpen } from 'lucide-react';

interface PreGameSetupProps {
  questions: Question[];
  settings: GameSettings;
  onStartGame: (players: Player[], filteredQuestions: Question[]) => void;
  onOpenQuestionBank: () => void;
}

export const PreGameSetupModal: React.FC<PreGameSetupProps> = ({
  questions,
  settings,
  onStartGame,
  onOpenQuestionBank,
}) => {
  const [teamCount, setTeamCount] = useState<number>(4);

  const colorKeys: TeamColorKey[] = ['garuda', 'nusantara', 'pancasila', 'merahputih', 'bhinneka', 'indonesia'];

  const [teamNames, setTeamNames] = useState<Record<TeamColorKey, string>>({
    garuda: TEAM_COLORS.garuda.defaultName,
    nusantara: TEAM_COLORS.nusantara.defaultName,
    pancasila: TEAM_COLORS.pancasila.defaultName,
    merahputih: TEAM_COLORS.merahputih.defaultName,
    bhinneka: TEAM_COLORS.bhinneka.defaultName,
    indonesia: TEAM_COLORS.indonesia.defaultName,
  });

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  const handleTeamNameChange = (key: TeamColorKey, newName: string) => {
    setTeamNames((prev) => ({ ...prev, [key]: newName }));
  };

  const toggleSubject = (subj: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const toggleClass = (cls: string) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleDifficulty = (diff: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
  };

  // Filter available questions
  const getFilteredQuestions = () => {
    return questions.filter((q) => {
      const matchSubject =
        selectedSubjects.length === 0 ||
        selectedSubjects.includes(q.subject || 'PPKn / Pendidikan Pancasila');
      const matchClass =
        selectedClasses.length === 0 ||
        selectedClasses.includes(q.targetClass || 'Umum');
      const matchCat =
        selectedCategories.length === 0 || selectedCategories.includes(q.category);
      const matchDiff =
        selectedDifficulties.length === 0 || selectedDifficulties.includes(q.difficulty);
      return matchSubject && matchClass && matchCat && matchDiff;
    });
  };

  const filteredQuestions = getFilteredQuestions();

  const handleStart = () => {
    if (filteredQuestions.length === 0) {
      alert('Tidak ada soal yang cocok dengan filter yang dipilih! Silakan sesuaikan filter atau tambahkan soal di Bank Soal.');
      return;
    }

    const players: Player[] = colorKeys.slice(0, teamCount).map((key, idx) => ({
      id: `p_${idx}_${Date.now()}`,
      name: teamNames[key] || TEAM_COLORS[key].defaultName,
      colorKey: key,
      position: 1,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      streak: 0,
    }));

    onStartGame(players, filteredQuestions);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Title Card */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white p-6 rounded-3xl shadow-xl border-4 border-amber-400 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-400 text-red-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          ⚙️ PERSIAPAN PERMAINAN
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-amber-300">
          PENGATURAN PEMAIN & SOAL
        </h1>
        <p className="text-sm text-red-100 mt-1 max-w-xl mx-auto">
          Atur jumlah kelompok, ganti nama tim, dan pilih mata pelajaran, kelas, serta materi sebelum memulai permainan edukasi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Team Configuration */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-slate-200 space-y-5">
          <div className="flex items-center gap-2 border-b pb-3">
            <Users className="w-5 h-5 text-red-600" />
            <h2 className="font-extrabold text-lg text-slate-900">1. JUMLAH & NAMA KELOMPOK</h2>
          </div>

          {/* Team Count Selector */}
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-2 uppercase">
              Pilih Jumlah Kelompok:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTeamCount(num)}
                  className={`py-2.5 rounded-xl font-extrabold text-sm border-2 transition-all cursor-pointer ${
                    teamCount === num
                      ? 'bg-red-600 border-red-700 text-white shadow-md scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {num} Tim
                </button>
              ))}
            </div>
          </div>

          {/* Team Names Inputs */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 block uppercase">
              Nama Kelompok:
            </label>
            {colorKeys.slice(0, teamCount).map((key, idx) => {
              const cfg = TEAM_COLORS[key];
              return (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-xs ${cfg.bgClass}`}
                  >
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={teamNames[key]}
                    onChange={(e) => handleTeamNameChange(key, e.target.value)}
                    placeholder={cfg.defaultName}
                    className="flex-1 p-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-900 focus:border-red-500 focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Question Filters */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-slate-200 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-600" />
                <h2 className="font-extrabold text-lg text-slate-900">2. FILTER BANK SOAL</h2>
              </div>
              <button
                onClick={onOpenQuestionBank}
                className="text-xs font-extrabold text-red-600 hover:text-red-700 underline cursor-pointer"
              >
                Kelola Bank Soal ({questions.length})
              </button>
            </div>

            {/* Filter by Subject */}
            <div className="bg-indigo-50/80 p-3.5 rounded-2xl border-2 border-indigo-200">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-4 h-4 text-indigo-700" />
                <span className="text-xs font-black text-indigo-950 uppercase">
                  Pilihan Mata Pelajaran (Mapel):
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                <button
                  type="button"
                  onClick={() => setSelectedSubjects([])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    selectedSubjects.length === 0
                      ? 'bg-indigo-700 text-white border-indigo-800 shadow-xs'
                      : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  Semua Mapel
                </button>
                {SUBJECTS_LIST.map((subj) => {
                  const isChecked = selectedSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                      }`}
                    >
                      {isChecked ? '☑ ' : '☐ '} {subj}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Target Class */}
            <div className="bg-purple-50/70 p-3.5 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center gap-1.5 mb-2">
                <GraduationCap className="w-4 h-4 text-purple-700" />
                <span className="text-xs font-black text-purple-900 uppercase">
                  Pilihan Kelas (Tingkat Pembelajaran):
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                <button
                  type="button"
                  onClick={() => setSelectedClasses([])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    selectedClasses.length === 0
                      ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                      : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  Semua Kelas
                </button>
                {CLASSES_LIST.map((cls) => {
                  const isChecked = selectedClasses.includes(cls);
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => toggleClass(cls)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                      }`}
                    >
                      {isChecked ? '☑ ' : '☐ '} {cls}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Category */}
            <div>
              <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">
                Materi / Bab:
              </span>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategories([])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedCategories.length === 0
                      ? 'bg-amber-500 text-red-950 border-amber-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Semua Materi
                </button>
                {CATEGORIES_LIST.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-red-600 text-white border-red-700 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {isChecked ? '☑ ' : '☐ '} {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Difficulty */}
            <div>
              <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">
                Tingkat Kesulitan:
              </span>
              <div className="flex gap-2">
                {['Mudah', 'Sedang', 'Sulit'].map((diff) => {
                  const isChecked = selectedDifficulties.includes(diff);
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => toggleDifficulty(diff)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-slate-900 text-amber-300 border-slate-950 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {isChecked ? '☑ ' : '☐ '} {diff}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Result Counter */}
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Soal Tersedia untuk Permainan:</span>
              <span className="text-base font-black text-red-700 bg-white px-3 py-0.5 rounded-full border border-amber-300">
                {filteredQuestions.length} Soal
              </span>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={filteredQuestions.length === 0}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg md:text-xl shadow-xl border-b-4 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4 ${
              filteredQuestions.length === 0
                ? 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 border-red-800 text-white shadow-red-200 hover:scale-102'
            }`}
          >
            <Play className="w-6 h-6 fill-white" />
            <span>▶️ MULAI PERMAINAN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
